#!/usr/bin/env bash
set -euo pipefail

# ---- config (adjust if needed) ----
DEV="${DEV:-{{ encrypted_volume_device }}}"          # your LUKS device
NAME="${NAME:-{{ encrypted_volume_name }}}"       # mapper name
MNT="${MNT:-{{ encrypted_volume_mount }}}"        # mountpoint for decrypted filesystem

# Things you might bind-mount from $MNT via /etc/fstab
BIND_TARGETS=(
  /home
  /var/www
  /var/lib/docker
)

# Services that should be down when the encrypted data isn't mounted
STOP_SERVICES=(
  docker
  postgresql
  memoryhole
)

# Optional swapfile inside the encrypted FS
SWAPFILE="${SWAPFILE:-$MNT/swapfile}"

# ---- helpers ----
is_open() { [[ -e "/dev/mapper/$NAME" ]]; }
is_mounted() { mountpoint -q "$MNT"; }
have_swapfile() { [[ -f "$SWAPFILE" ]]; }

stop_services() {
  for s in "${STOP_SERVICES[@]}"; do
    systemctl stop "$s" >/dev/null 2>&1 || true
  done
}

start_services() {
  for s in "${STOP_SERVICES[@]}"; do
    systemctl start "$s" >/dev/null 2>&1 || true
  done
}

unlock() {
  # Open LUKS if needed
  if ! is_open; then
    echo -n "Enter LUKS passphrase for $DEV: "
    read -rs PASS
    echo ""
    echo -n "$PASS" | cryptsetup open "$DEV" "$NAME" - || {
      # Fallback to standard prompt if pipe fails (though unlikely)
      echo "Pipe unlock failed, trying standard prompt..."
      cryptsetup open "$DEV" "$NAME"
    }
  fi

  # Mount main FS (fstab line for UUID is fine; otherwise mount device directly)
  if ! is_mounted; then
    mount "$MNT" 2>/dev/null || mount "/dev/mapper/$NAME" "$MNT"
  fi

  # Mount binds listed in /etc/fstab (recommended)
  mount -a

  # Enable extra swap on encrypted FS (if it exists)
  if have_swapfile; then
    swapon "$SWAPFILE" >/dev/null 2>&1 || true
  fi

  # Bring dependent services back up
  start_services
  echo "OK: unlocked + mounted ($MNT)."
}

lock() {
  # Stop services first so nothing is writing into encrypted paths
  stop_services

  # Disable swapfile in encrypted FS if active
  if have_swapfile; then
    swapoff "$SWAPFILE" >/dev/null 2>&1 || true
  fi

  # Unmount bind targets first (ignore failures if not mounted)
  for t in "${BIND_TARGETS[@]}"; do
    umount "$t" >/dev/null 2>&1 || true
  done

  # Unmount the main encrypted mount
  umount "$MNT" >/dev/null 2>&1 || true

  # Close LUKS mapping
  if is_open; then
    cryptsetup close "$NAME"
  fi

  echo "OK: unmounted + locked ($NAME)."
}

status() {
  echo "DEV=$DEV NAME=$NAME MNT=$MNT"
  echo -n "LUKS mapping: "; is_open && echo "OPEN" || echo "CLOSED"
  echo -n "Mounted: "; is_mounted && echo "YES" || echo "NO"
  echo "Active swap:"
  swapon --show || true
}

usage() {
  cat <<EOF
Usage: $(basename "$0") <unlock|lock|status>

Environment overrides (optional):
  DEV=/dev/sdc NAME=cryptdata MNT=/srv/crypt SWAPFILE=/srv/crypt/swap/swapfile
EOF
}

cmd="${1:-}"
case "$cmd" in
  unlock) unlock ;;
  lock)   lock ;;
  status) status ;;
  *) usage; exit 2 ;;
esac

