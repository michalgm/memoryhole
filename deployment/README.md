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

Instead of `inventory.example.yml`, create `inventory.yml` with this content:

```yaml
all:
  hosts:
    localhost:
      ansible_connection: local
      ansible_host: localhost
      ansible_user: root
      server_hostname: memoryhole
      encrypted_volume_device: /dev/sdc  # check with: lsblk
```

Then follow the [Deployment](#2-deployment) section below — skip the inventory.yml step.

---

## 1. Provisioning (Optional — Linode only)

Skip this section if your server already exists.

This creates a new Linode VPS, attaches a volume (to be encrypted), configures a firewall, and generate an `inventory.yml` file automatically. By default, it will provision a $5/month nanode in the eu-central region, and a 20GB volume. Edit 'provision.yml' if you want to change any of these settings.  The playbook will prompt for a Linode API token, which can be created here: https://cloud.linode.com/profile/tokens.

```bash
cd deployment/ansible
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

Edit `group_vars/all.yml`. It only needs the values specific to your deployment — everything else has sensible defaults in `defaults.yml`.

**Required**

| Variable | Description |
|---|---|
| `admin_user_email` | Initial admin account email — also used for Let's Encrypt cert notifications and fail2ban alerts |
| `admin_user_name` | Initial admin display name (default: `Admin`) |
| `linux_user_ssh_key_file` | Path to your SSH public key, e.g. `~/.ssh/id_ed25519.pub` |
| `use_fde` | `true` to encrypt the data volume, `false` to skip |
| `encrypted_volume_device` | Block device to encrypt, e.g. `/dev/sdc` — check with `lsblk` on the server |

The admin password is prompted interactively when `deploy.yml` runs.

**Disk encryption passphrase**

You can set `encrypted_volume_passphrase` in `all.yml`, or leave it out and enter it interactively when `deploy.yml` runs. Either way, store it offline — there is no recovery without it.

**Instances** — one entry per Memoryhole deployment:

| Variable | Required | Description |
|---|---|---|
| `domain` | yes | Fully qualified domain name, e.g. `memoryhole.example.com` |
| `seed_jurisdictions` | no | Comma-separated list of jurisdictions values to pre-load |
| `seed_cities` | no | Comma-separated list of city values to pre-load |
| `image_tag` | no | Pin to a specific memoryhole release, e.g. `v0.28.0` (default: `latest`) |
| `backup_enabled` | no | Enable nightly database backups (default: `true`) |
| `backup_retention_days` | no | Days to keep backups (default: `7`) |

```yaml
instances:
  - domain: memoryhole.example.com
    seed_jurisdictions: 'County Court,Federal Court'
    seed_cities: 'Springfield,Shelbyville'
```

Multiple instances can run on the same server — just add more entries to the list.

Edit `inventory.yml` — set `ansible_host` to your server's IP address. (Skip this if you're running Ansible on the server itself — you already created `inventory.yml` above.)

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
