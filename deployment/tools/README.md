# Deployment Tools

Scripts for working on the deployment itself: testing changes to the playbooks and measuring performance. You don't need any of this for a normal deployment. See the [deployment README](../README.md) for that.

| Script | Runs on | Purpose |
|---|---|---|
| [`e2e-test.sh`](#e2e-testsh-end-to-end-deployment-test) | Your machine | Full deploy onto a freshly installed test server, then verify |
| [`io-benchmark.sh`](#io-benchmarksh-disk-performance) | The server | Disk performance: root disk vs plain loopback vs encrypted volume |
| [`pgbench-benchmark.sh`](#pgbench-benchmarksh-postgres-performance) | The server | Postgres performance in the same locations |

---

## `e2e-test.sh`: end-to-end deployment test

Puts a fresh OS on a test Linode, runs the full `deploy.yml`, then runs `verify.yml` to check everything works. Use it before merging changes to the playbooks.

```bash
cd deployment
LABEL=memoryhole-test bash tools/e2e-test.sh
```

**It wipes the server named by `LABEL`**, so only use it with a dedicated test server. It asks you to type the label before wiping anything. Set `YES=1` to skip the prompt.

### Setup

Run it from a clone of the repo set up for the test server, with its own `inventory.yml` and `group_vars/all/main.yml` in `deployment/ansible`, and test domains in `instances`. It also needs:

- the Ansible setup from the [deployment README](../README.md#setting-up-ansible);
- for `FRESH=1` only: `linode-cli`, configured with `linode-cli configure` or with `LINODE_CLI_TOKEN` set;
- `LINODE_TOKEN` for the playbooks (or you'll be prompted);
- DNS for the test domains pointing at the test server, so Caddy can get certificates.

### Modes

The test domains' DNS has to keep pointing at the server, so the server's IP is kept in both modes:

| Mode | What happens |
|---|---|
| default | **Rebuild** the existing Linode with a fresh OS, using `provision.yml -e allow_rebuild=true`. Same Linode, same IP. Fastest. |
| `FRESH=1` | **Replace** it with a brand-new Linode, which also tests provisioning. It creates the new Linode next to the old one (same region and plan, same firewall), shuts the old one down, swaps their public IPs (Linode's "IP transfer"), reboots the new one so it picks up the address, deletes the old one, renames the new one to `LABEL` and runs `provision.yml`. |
| No Linode named `LABEL` | Creates one with `provision.yml`. It gets a new IP, so point DNS at it before verifying. |

If a `FRESH=1` IP transfer fails partway, the script prints the IDs of both Linodes so you can sort it out in Cloud Manager. The transfer relies on Linode's Network Helper, which is on by default.

### Environment variables

| Variable | Default | |
|---|---|---|
| `LABEL` | (required) | Linode label of the test server |
| `IMAGE` | `linode_image` | OS image to install |
| `SSH_PUBLIC_KEY` | `ssh_public_key_path` | Key authorized for root on the fresh install |
| `E2E_PASSPHRASE` | random | Disk encryption passphrase |
| `E2E_ADMIN_PASSWORD` | random | Initial admin password |
| `FRESH` | unset | `1` to replace the Linode instead of rebuilding it |
| `YES` | unset | `1` to skip the confirmation prompt |

The passphrase and admin password are printed at the end. Keep the passphrase if you want to use the test server afterwards, since you'll need it to unlock the volume after a reboot.

---

## `io-benchmark.sh`: disk performance

Runs `fio` with Postgres-like workloads in each directory you give it and prints a comparison table:

| Test | Stands in for |
|---|---|
| Random read / write, 8k | Postgres reading and writing pages |
| 8k write + `fdatasync` | Each commit waiting on the write-ahead log (**the one that matters most**) |
| Sequential read / write, 1M | Backups, `pg_dump`, pulling Docker images |

Copy it to the server and run it as root:

```bash
scp tools/io-benchmark.sh root@SERVER:/root/
ssh root@SERVER
apt install -y fio
bash io-benchmark.sh /var/tmp loop:/var/tmp /mnt/encrypted
```

`loop:/var/tmp` creates a temporary *unencrypted* loopback filesystem backed by a file in `/var/tmp`, set up like the encrypted volume but without LUKS. Comparing the three separates the cost of the loopback layers (`/var/tmp` vs `loop:`) from the cost of encryption (`loop:` vs `/mnt/encrypted`). With no arguments it compares `/var/tmp` and `/mnt/encrypted`. Each directory needs about 2 GB free, or 3 GB for a `loop:` target; change the size with `SIZE=`.

---

## `pgbench-benchmark.sh`: Postgres performance

For each directory, starts a throwaway `postgres:16` container with its data there, loads pgbench's test database (about 1.5 GB at the default `SCALE=100`), and runs read/write and read-only workloads. This measures what the app actually feels, rather than raw disk speed.

```bash
scp tools/pgbench-benchmark.sh root@SERVER:/root/
ssh root@SERVER
bash pgbench-benchmark.sh /var/tmp /mnt/encrypted
```

Docker must be running, so unlock the volume first. It takes about 5–8 minutes per directory on a nanode. For a quick look, use `SCALE=30 RUNTIME=30`.

### Running the benchmarks

- Use a test server. They load the disk and CPU heavily and compete with any running instances.
- Run them 2–3 times. Linode plans share hardware, and single runs can vary by ±20%.
- Both clean up after themselves, even if interrupted.

For reference, on a nanode the encrypted loopback ran at about 86% of the plain root disk in pgbench's read/write test. In raw `fio` terms, the loopback layer roughly doubles commit (`fdatasync`) latency, from about 0.45 to 0.75 ms, and encryption caps sequential throughput at about 450 MB/s on one vCPU.
