# Memoryhole Deployment

This guide covers three workflows: provisioning a new server (optional), deploying Memoryhole, and upgrading existing instances.

All commands are run from the `deployment/ansible/` directory unless noted otherwise.

---

## Setting Up Ansible

You need Ansible installed either on your local machine or on the server itself.

### Option A: Local machine

Run playbooks from your laptop against a remote server.

Clone the repo locally:

```bash
git clone https://github.com/michalgm/memoryhole.git
cd memoryhole/deployment/ansible
```

Then install Ansible via [pipx](https://pipx.pypa.io/), which keeps it isolated, and add the Python libraries and Ansible collections the playbooks require:

```bash
pipx install --include-deps ansible
pipx inject ansible -r requirements.txt
ansible-galaxy collection install -r requirements.yml
```

If you'll be editing the playbooks, also install the dev tools (ansible-lint):

```bash
pipx inject --include-apps ansible -r requirements-dev.txt
```

### Option B: On the server itself

Good if you don't have a Mac or Linux workstation. SSH into the server as root, install Ansible there, and run playbooks against `localhost`.

```bash
ssh root@YOUR_SERVER_IP
apt update && apt install -y pipx git
git clone https://github.com/michalgm/memoryhole.git
cd memoryhole/deployment/ansible
pipx install --include-deps ansible
pipx inject ansible -r requirements.txt
ansible-galaxy collection install -r requirements.yml
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
```

Then follow the [Deployment](#2-deployment) section below — skip the inventory.yml step.

---

## 1. Provisioning (Optional — Linode only)

Skip this section if your server already exists.

This creates a new Linode VPS, attaches a Cloud Firewall (SSH, HTTP and HTTPS only), and sets the server's hostname. By default, it will provision a $5/month nanode in the eu-central region called `memoryhole`. Edit `provision.yml` if you want to change any of these settings.

You need a Linode API token with read/write access to Linodes and Firewalls, which you can create at https://cloud.linode.com/profile/tokens. Either export it, or leave it unset and the playbook will prompt for it:

```bash
cd deployment/ansible
export LINODE_TOKEN=your-token   # optional; prompted for if unset
ansible-playbook provision.yml
```

At the end it prints the server's IP and root password. Save the root password: you'll need it for Linode's web console (Lish) if SSH ever stops working, and it can't be recovered later.

**inventory.yml**

Each clone of this repo manages one server, which can run several Memoryhole instances (see [Instances](#step-1-configure)). To manage a second server, use a separate clone.

- If `inventory.yml` doesn't exist yet, the playbook creates it for the new server.
- If it lists a **different** server than the `linode_label` you're provisioning, the playbook stops before creating anything.
- If it lists the **same** server, it's safe to re-run: the existing Linode and firewall are reused, not duplicated. If the server's IP has changed (for example, you deleted and re-provisioned it), `ansible_host` is updated in place. If `ansible_host` is a hostname rather than an IP, it's left alone and the new IP is printed so you can update DNS.

The root password is only printed when the Linode is first created.

Continue to [Deployment](#2-deployment).

---

## 2. Deployment

### Step 1: Configure

```bash
cd deployment/ansible
cp group_vars/all.example.yml group_vars/all/main.yml
```

Edit `group_vars/all/main.yml`. It only needs the values specific to your deployment — everything else has sensible defaults in `group_vars/all/defaults.yml`.

**Required**

| Variable | Description |
|---|---|
| `admin_user_email` | Initial admin account email — also used for Let's Encrypt cert notifications and fail2ban alerts |
| `admin_user_name` | Initial admin display name (default: `Admin`) |
| `linux_user_ssh_key_file` | Path to your SSH public key, e.g. `~/.ssh/id_ed25519.pub` |
| `use_encrypted_volume` | `true` to encrypt the data volume, `false` to skip |

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
| `port` | no | Internal localhost port Caddy uses to proxy to this instance (not exposed outside the server). Auto-assigned from the domain name — only set this if the assigned port conflicts with something else on the server. Must be >1023. |

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
2. Disk encryption setup with LUKS (skipped if `use_encrypted_volume: false`)
3. Security hardening (firewall, fail2ban, SSH hardening)
4. Caddy reverse proxy
5. Memoryhole app instances

To re-run a single step, use tags:

```bash
ansible-playbook -i inventory.yml deploy.yml --tags deploy   # re-deploy app only
ansible-playbook -i inventory.yml deploy.yml --tags security # re-apply security config
```

Available tags: `init`, `encrypted_volume`, `security`, `caddy`, `deploy`

### Step 3: Set up email with ProtonMail Bridge (optional)

Memoryhole sends email (password resets, notifications) over SMTP. Each instance has its own ProtonMail Bridge container, which turns a ProtonMail account into a local SMTP server. This requires a **paid** ProtonMail account.

You may also use gmail or any other SMTP service, though those will not be automatically encrypted - in that case, you can skip this step and enter the credentials directly into the Admin Settings page.

The Bridge login is interactive (password plus 2FA), so it can't be automated. You do it once per instance:

1. **SSH in as the `memoryhole` user**, not root:

   ```bash
   ssh memoryhole@YOUR_SERVER_IP
   protonmail-bridge-setup
   ```

   If the server runs more than one instance, the script asks which one to set up. It stops that instance's Bridge, prints a short reminder of the next steps, and opens the Bridge shell when you press Enter.

2. **In the Bridge shell**, log in and get the SMTP credentials:

   ```
   >>> login
   ```
   Enter your ProtonMail username and password, then complete the 2FA prompt.

   ```
   >>> info
   ```
   This shows the SMTP **username** and **password** that Bridge generated. Copy them now. The password is **not** your ProtonMail password.

   ```
   >>> exit
   ```

   The script then restarts the instance and prints where to enter the credentials.

3. **In Memoryhole**, log in as an admin and open **Admin → Settings** (`/admin/settings`). Under **Email Settings**:
   - **Email Server:** choose **Protonmail Bridge**. This fills in the host (`protonmail-bridge:25`) and leaves **SMTP Security** unchecked.
   - **SMTP Username / SMTP Password:** paste the values from `info`.
   - Save.

4. **Test it:** enter an address under **Test Email Address** and click **Send Test Email**.

The Bridge login is saved in the instance's data directory on the encrypted volume, so it survives restarts, upgrades and reboots. Re-run `protonmail-bridge-setup` only if Bridge gets logged out, for example after you change your ProtonMail password or revoke the session in ProtonMail's settings.

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

## 4. Unlocking After a Reboot

If you enabled disk encryption, the encrypted volume stays **locked** after every reboot, whether you rebooted it, Linode did host maintenance, or unattended upgrades did. That's the point: the data can't be read without the passphrase. Until someone unlocks it, Docker doesn't start, and each instance's domain shows a "temporarily unavailable" page.

To unlock, SSH in as the `admin-unlock` user and enter the disk encryption passphrase:

```bash
ssh -t admin-unlock@YOUR_SERVER_IP sudo unlock_data unlock
```

The `-t` is needed for the passphrase prompt. This unlocks and mounts the volume, mounts the data directories, and starts Docker. The instances then come back up on their own within a minute or so.

`admin-unlock` uses the same SSH key as the `memoryhole` user. It's an ordinary unprivileged account whose only admin right is running `unlock_data` (all of its commands, including `lock`). It isn't in the `docker` group and can't read the instance data, so you can give someone access to it to bring the server back up after a reboot without giving them full server access.

`unlock_data` has two other commands:

| Command | What it does |
|---|---|
| `sudo unlock_data status` | Shows whether the volume is unlocked and mounted, and which swap is active |
| `sudo unlock_data lock` | Stops Docker, unmounts everything and locks the volume. Instances go offline until it's unlocked again. Use it before handing the server over or if you think it's compromised. |

---

## 5. Decommissioning a Server

Use this to shut a server down for good. Deleting a server, or a Linode, doesn't guarantee its disk is actually erased, so first destroy the data yourself while the server is still running.

**Step 1: Securely wipe the data** (any server). This destroys **all** Memoryhole data on the server and can't be undone. Make sure you have any backups you need first.

```bash
cd deployment/ansible
ansible-playbook -i inventory.yml deprovision.yml --extra-vars "confirm_destroy=yes"
```

It stops all instances and Docker. With disk encryption on, it overwrites the encrypted volume's header, which destroys the encryption key, so everything on the volume becomes unrecoverable at once. Without encryption, it shreds each instance's data files. You get a 10-second warning before anything is deleted; press Ctrl+C twice to cancel.

**Step 2: Delete the Linode** (Linode only). Deletes the Linode and the Cloud Firewall that `provision.yml` created:

```bash
export LINODE_TOKEN=your-token   # optional; prompted for if unset
ansible-playbook -i inventory.yml deprovision-linode.yml --extra-vars "confirm_destroy=yes"
```

On other hosting, delete the server through your provider instead.

**Step 3: Clean up locally.** `inventory.yml` still points at the deleted server, so delete it. If you're done with this deployment entirely, also delete `playbooks/credentials/` (the instances' generated secrets) and `group_vars/all/main.yml`. To replace the server instead, keep them and provision again with the same name. `provision.yml` reuses `inventory.yml` and updates the IP.

---

## Security Notes

**LUKS passphrase:** If you enabled disk encryption (`use_encrypted_volume: true`), store your `encrypted_volume_passphrase` in a password manager and an offline backup. There is no recovery — LUKS is unbreakable without the passphrase.

**SSH access:** The server is configured for key-only root SSH. Password authentication is disabled.

**group_vars/all/main.yml** is gitignored and stays local. Never commit it — it contains your secrets.

---

## Troubleshooting

- **Ansible can't connect:** Verify `ansible_host` in `inventory.yml` and that your SSH key is authorized on the server.
- **App not starting:** Re-run with `--tags deploy` and check `docker compose logs` on the server.


For bugs or questions: https://github.com/michalgm/memoryhole/issues
