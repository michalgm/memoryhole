#!/usr/bin/env bash
#
# End-to-end deployment test: puts a fresh OS on the test Linode, runs the
# full deploy (deploy.yml), then checks the result (verify.yml).
#
#   LABEL=memoryhole-test bash tools/e2e-test.sh
#
# THIS WIPES THE SERVER NAMED BY LABEL. Use a dedicated test server.
#
# The test domains' DNS must keep pointing at the server, so its public IP
# is kept in both modes:
#
#   default   Rebuild the existing Linode (same Linode, same IP), using
#             provision.yml -e allow_rebuild=true. Creates it if missing.
#   FRESH=1   Replace it with a brand-new Linode, which also tests
#             provisioning. The new Linode is created alongside the old one,
#             the old one is shut down, their public IPs are swapped (Linode's
#             "IP transfer"), and the old one is deleted.
#
# A newly created Linode gets a new IP: point DNS at it before verifying.
#
# Uses the inventory.yml and group_vars/all/main.yml in deployment/ansible,
# so run it from a clone set up for the test server. Requires the Ansible
# setup from the README; FRESH=1 also needs linode-cli (configured, or
# LINODE_CLI_TOKEN set).
#
# Environment:
#   LABEL                 Linode label of the test server (required)
#   IMAGE                 OS image (default: linode_image from group_vars)
#   SSH_PUBLIC_KEY        key authorized for root on the fresh install
#                         (default: ssh_public_key_path from group_vars)
#   E2E_PASSPHRASE        disk encryption passphrase (default: random)
#   E2E_ADMIN_PASSWORD    initial admin password (default: random)
#   FRESH=1               replace the Linode instead of rebuilding it
#   YES=1                 skip the confirmation prompt
#
set -euo pipefail

: "${LABEL:?Set LABEL to the Linode label of the test server}"
E2E_PASSPHRASE="${E2E_PASSPHRASE:-$(openssl rand -base64 24)}"
E2E_ADMIN_PASSWORD="${E2E_ADMIN_PASSWORD:-$(openssl rand -base64 18)}"

cd "$(dirname "$0")/../ansible"

for cmd in ansible-playbook openssl ${FRESH:+linode-cli}; do
  command -v "$cmd" >/dev/null || {
    echo "Missing $cmd" >&2
    exit 1
  }
done

# --- helpers -----------------------------------------------------------------

# A variable's value as provision.yml sees it (group_vars, main.yml overrides)
# Markers around the value keep this independent of Ansible's output format
ansible_var() { # <name>
  ansible localhost -c local -m debug -a "msg=@@{{ $1 }}@@" 2>/dev/null |
    sed -n 's/.*@@\(.*\)@@.*/\1/p'
}

IMAGE="${IMAGE:-$(ansible_var linode_image)}"
SSH_PUBLIC_KEY="${SSH_PUBLIC_KEY:-$(ansible_var ssh_public_key_path)}"
SSH_PUBLIC_KEY="${SSH_PUBLIC_KEY/#\~/$HOME}"
[[ -f $SSH_PUBLIC_KEY ]] || {
  echo "SSH key not found: $SSH_PUBLIC_KEY" >&2
  exit 1
}

PROVISION=(ansible-playbook provision.yml
  -e linode_label="$LABEL"
  -e linode_image="$IMAGE"
  -e ssh_public_key_path="$SSH_PUBLIC_KEY")

linode_id_for() {
  linode-cli linodes list --label "$1" --format id --text --no-headers
}

linode_field() { # <id> <field>
  linode-cli linodes view "$1" --text --no-headers --format "$2"
}

public_ip() { # <id>: first non-private IPv4
  linode_field "$1" ipv4 | tr ' ' '\n' |
    grep -vE '^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)' | head -1
}

wait_for_status() { # <id> <status>
  until [[ "$(linode_field "$1" status)" == "$2" ]]; do sleep 5; done
}

# After a reboot request the status can read "running" for a moment before
# the reboot starts; wait for it to change before waiting for running
wait_for_restart() { # <id>
  for _ in $(seq 1 12); do
    [[ "$(linode_field "$1" status)" != running ]] && break
    sleep 5
  done
  wait_for_status "$1" running
}

# --- get a freshly installed server ------------------------------------------

if [[ -z ${FRESH:-} ]]; then
  # Rebuilds the Linode if it exists (after asking to type the label, unless
  # YES=1), creates it if not, and sets up firewall, hostname and inventory
  echo "== Rebuilding $LABEL with provision.yml"
  "${PROVISION[@]}" -e allow_rebuild=true ${YES:+-e confirm_rebuild=yes}
else
  OLD_ID=$(linode_id_for "$LABEL")
  if [[ -n $OLD_ID ]]; then
    REGION=$(linode_field "$OLD_ID" region)
    TYPE=$(linode_field "$OLD_ID" type)
    OLD_IP=$(public_ip "$OLD_ID")

    if [[ -z ${YES:-} ]]; then
      echo "This will create a new Linode, move $OLD_IP to it from"
      echo "'$LABEL' (id $OLD_ID), then DELETE the old Linode."
      read -rp "Type the label to continue: " answer
      [[ $answer == "$LABEL" ]] || {
        echo "Aborted."
        exit 1
      }
    fi

    FIREWALL_ID=$(linode-cli firewalls list --label "$LABEL-firewall" \
      --format id --text --no-headers)
    TEMP_LABEL="$LABEL-new"
    # Same swap disk size provision.yml would use
    SWAP_SIZE=$(ansible_var linode_swap_partition_size)

    echo "== Creating replacement Linode ($TEMP_LABEL, $TYPE in $REGION)"
    NEW_ID=$(linode-cli linodes create --label "$TEMP_LABEL" --region "$REGION" \
      --type "$TYPE" --image "$IMAGE" --private_ip true \
      ${SWAP_SIZE:+--swap_size "$SWAP_SIZE"} \
      --root_pass "$(openssl rand -base64 24)" \
      --authorized_keys "$(cat "$SSH_PUBLIC_KEY")" \
      ${FIREWALL_ID:+--firewall_id "$FIREWALL_ID"} \
      --format id --text --no-headers)
    # If anything below fails, say what state the Linodes were left in
    trap 'echo "Interrupted during IP transfer: old Linode $OLD_ID ($LABEL), new Linode $NEW_ID ($TEMP_LABEL). Fix up in Cloud Manager." >&2' ERR
    wait_for_status "$NEW_ID" running
    NEW_IP=$(public_ip "$NEW_ID")

    echo "== Shutting down $LABEL ($OLD_ID)"
    linode-cli linodes shutdown "$OLD_ID" >/dev/null
    wait_for_status "$OLD_ID" offline

    echo "== Moving $OLD_IP to the new Linode"
    # A swap: every Linode must keep a public IPv4
    linode-cli networking ip-assign --region "$REGION" --assignments \
      "[{\"address\": \"$OLD_IP\", \"linode_id\": $NEW_ID}, {\"address\": \"$NEW_IP\", \"linode_id\": $OLD_ID}]" \
      >/dev/null
    # Network Helper applies the new address on boot
    linode-cli linodes reboot "$NEW_ID" >/dev/null
    wait_for_restart "$NEW_ID"

    echo "== Deleting old Linode $OLD_ID and renaming $TEMP_LABEL to $LABEL"
    linode-cli linodes delete "$OLD_ID" >/dev/null
    linode-cli linodes update "$NEW_ID" --label "$LABEL" >/dev/null
    trap - ERR

    ssh-keygen -R "$OLD_IP" >/dev/null 2>&1 || true # new install, new host key
  fi

  # Creates the Linode if there wasn't one; otherwise makes sure the
  # firewall, hostname and inventory.yml match the replacement
  echo "== Running provision.yml"
  "${PROVISION[@]}"
fi

# --- deploy and verify ---------------------------------------------------------

# Pass the secrets in a private vars file rather than on the command line
SECRETS=$(mktemp)
trap 'rm -f "$SECRETS"' EXIT
chmod 600 "$SECRETS"
cat >"$SECRETS" <<EOF
encrypted_volume_passphrase: "$E2E_PASSPHRASE"
admin_user_password: "$E2E_ADMIN_PASSWORD"
EOF

echo "== Deploying"
ansible-playbook deploy.yml -e @"$SECRETS"

echo "== Verifying"
ansible-playbook verify.yml

cat <<EOF

== End-to-end test passed
Server:              $LABEL
Disk passphrase:     $E2E_PASSPHRASE
Admin password:      $E2E_ADMIN_PASSWORD
(Test credentials; you'll need the passphrase to unlock after a reboot.)
EOF
