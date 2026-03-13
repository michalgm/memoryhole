# Memoryhole Deployment

This guide covers three workflows: provisioning a new server (optional), deploying Memoryhole, and upgrading existing instances.

All commands are run from the `deployment/ansible/` directory unless noted otherwise.

---

## Setting Up Ansible

You need Ansible installed either on your local machine or on the server itself.

### Option A: Local machine

Run playbooks from your laptop against a remote server.

```bash
# macOS
brew install ansible

# Ubuntu/Debian (including WSL2 on Windows)
sudo apt update && sudo apt install -y ansible
```

Then clone the repo locally:

```bash
git clone https://github.com/michalgm/memoryhole.git
cd memoryhole/deployment/ansible
```

### Option B: On the server itself

Good if you don't have a Mac or Linux workstation. SSH into the server as root, install Ansible there, and run playbooks against `localhost`.

```bash
ssh root@YOUR_SERVER_IP
apt update && apt install -y ansible git
git clone https://github.com/michalgm/memoryhole.git
cd memoryhole/deployment/ansible
```

Use the localhost inventory example in the [Deployment](#2-deployment) section below.

---

## 1. Provisioning (Optional — Linode only)

Skip this section if your server already exists.

This creates a new Linode VPS, attaches an encrypted volume, and configures a firewall. It requires a Linode API token and generates an `inventory.yml` automatically.

```bash
cd deployment/ansible
export LINODE_TOKEN=your_linode_api_token
ansible-playbook provision.yml
```

After it completes, your `inventory.yml` will be populated with the new server's IP. Continue to [Deployment](#2-deployment).

---

## 2. Deployment

### Step 1: Configure

```bash
cd deployment/ansible
cp group_vars/all.example.yml group_vars/all.yml
cp inventory.example.yml inventory.yml
```

Edit `group_vars/all.yml` — the key things to set:

| Variable | Description |
|---|---|
| `linux_username` | Service account name on the server |
| `linux_user_ssh_public_keys` | Your SSH public key(s) for root access |
| `instances` | List of domains to deploy (see example file) |
| `encrypted_volume_passphrase` | LUKS passphrase — store this somewhere safe |
| `use_fde` | Set to `false` to skip disk encryption entirely |

The example file has comments explaining every option.

Edit `inventory.yml` — set `ansible_host` to your server's IP address.

**If running Ansible on the server itself**, use this inventory instead:

```yaml
all:
  hosts:
    localhost:
      ansible_connection: local
      ansible_host: localhost
      ansible_user: root
      server_hostname: memoryhole
      encrypted_volume_device: /dev/sdb  # check with: lsblk
```

### Step 2: Run

```bash
ansible-playbook -i inventory.yml deploy.yml
```

This runs all setup steps in order:

1. Server initialization (packages, users, SSH)
2. Disk encryption setup with LUKS (skipped if `use_fde: false`)
3. Security hardening (firewall, fail2ban, SSH hardening)
4. Caddy reverse proxy
5. Memoryhole app instances

To re-run a single step, use tags:

```bash
ansible-playbook -i inventory.yml deploy.yml --tags deploy   # re-deploy app only
ansible-playbook -i inventory.yml deploy.yml --tags security # re-apply security config
```

Available tags: `init`, `fde`, `security`, `caddy`, `deploy`

---

## 3. Upgrading

Pulls the latest Docker images and restarts all instances. Database migrations run automatically on startup.

```bash
cd deployment/ansible
ansible-playbook -i inventory.yml upgrade-instances.yml
```

To pin a specific release instead of pulling `latest`:

```bash
ansible-playbook -i inventory.yml upgrade-instances.yml -e global_image_tag=v0.28.0
```

---

## Security Notes

**LUKS passphrase:** If you enabled disk encryption (`use_fde: true`), store your `encrypted_volume_passphrase` in a password manager and an offline backup. There is no recovery — LUKS is unbreakable without the passphrase.

**SSH access:** The server is configured for key-only root SSH. Password authentication is disabled.

**group_vars/all.yml** is gitignored and stays local. Never commit it — it contains your secrets.

---

## Troubleshooting

- **Ansible can't connect:** Verify `ansible_host` in `inventory.yml` and that your SSH key is authorized on the server.
- **FDE step fails — device not found:** Check the block device name with `lsblk` on the server and update `encrypted_volume_device` in `all.yml`.
- **App not starting:** Re-run with `--tags deploy` and check `docker compose logs` on the server.
- **Incident response:** See [docs/INCIDENT-RESPONSE.md](docs/INCIDENT-RESPONSE.md) for security breach procedures.

For bugs or questions: https://github.com/michalgm/memoryhole/issues
