#!/usr/bin/env bash
#
# Compare disk I/O performance across directories, using workloads that
# resemble what Postgres does. Run on the server as root:
#
#   sudo bash io-benchmark.sh                       # root disk vs encrypted volume
#   sudo bash io-benchmark.sh /var/tmp /mnt/encrypted /mnt/volume-test
#
# A "loop:<dir>" argument benchmarks a plain (unencrypted) loopback filesystem
# backed by a file in <dir>, set up like the encrypted volume but without LUKS.
# Comparing it with <dir> and /mnt/encrypted separates the cost of the
# loopback layers from the cost of encryption:
#
#   sudo bash io-benchmark.sh /var/tmp loop:/var/tmp /mnt/encrypted
#
# Each directory gets a temporary test file (removed afterwards). Run it while
# the server is otherwise idle, and run it 2-3 times: Linode plans share
# hardware, so single runs can be noisy.
#
# Environment overrides:
#   SIZE=2G       test file size; keep it larger than RAM so the page cache
#                 can't hide disk speed (O_DIRECT is used too)
#   RUNTIME=30    seconds per test
#   LOOP_MOUNT_OPTS=noatime,data=writeback
#                 mount options for loop: filesystems (default matches the
#                 encrypted volume's options in 02-setup-encrypted-volume.yml)
#
set -euo pipefail

SIZE="${SIZE:-2G}"
RUNTIME="${RUNTIME:-30}"
LOOP_MOUNT_OPTS="${LOOP_MOUNT_OPTS:-noatime,data=writeback}"
DIRS=("$@")
if [[ ${#DIRS[@]} -eq 0 ]]; then
  DIRS=(/var/tmp /mnt/encrypted)
fi

if ! command -v fio >/dev/null; then
  echo "fio is not installed. Install it with: apt install -y fio" >&2
  exit 1
fi

# name | fio options
TESTS=(
  "Random read 8k (QD16)|--rw=randread --bs=8k --iodepth=16"
  "Random write 8k (QD16)|--rw=randwrite --bs=8k --iodepth=16"
  "Commit 8k + fdatasync (QD1)|--rw=write --bs=8k --iodepth=1 --fdatasync=1"
  "Sequential read 1M|--rw=read --bs=1M --iodepth=8"
  "Sequential write 1M|--rw=write --bs=1M --iodepth=8"
)

RESULTS_DIR=$(mktemp -d)
TEST_FILES=()
LOOPS=() # "backing file|loop device|mountpoint"

# Plain loopback filesystem backed by a file in $1, like the encrypted volume
# minus LUKS. Sets LOOP_DEV and LOOP_MNT. Records each piece in LOOPS as soon
# as it exists, so cleanup can undo a setup that fails partway.
setup_loop() {
  local base=$1 img
  img="$base/.io-benchmark-loop.$$.img"
  LOOP_DEV=""
  LOOP_MNT=$(mktemp -d)
  LOOPS+=("$img||$LOOP_MNT")
  # Room for the test file plus filesystem overhead
  fallocate -l $(($(numfmt --from=iec "$SIZE") + 1024 * 1024 * 1024)) "$img"
  LOOP_DEV=$(losetup -f --show --direct-io=on "$img")
  LOOPS[${#LOOPS[@]} - 1]="$img|$LOOP_DEV|$LOOP_MNT"
  mkfs.ext4 -q -F "$LOOP_DEV"
  mount -o "$LOOP_MOUNT_OPTS" "$LOOP_DEV" "$LOOP_MNT"
}

teardown_loops() {
  local loop img dev mnt
  for loop in "${LOOPS[@]}"; do
    IFS='|' read -r img dev mnt <<<"$loop"
    umount "$mnt" 2>/dev/null || true
    [[ -n "$dev" ]] && { losetup -d "$dev" 2>/dev/null || true; }
    rm -f "$img"
    rmdir "$mnt" 2>/dev/null || true
  done
  LOOPS=()
}

cleanup() {
  rm -f "${TEST_FILES[@]}"
  teardown_loops
  rm -rf "$RESULTS_DIR"
}
trap cleanup EXIT

echo "== System"
echo "CPU AES-NI: $(grep -qm1 -w aes /proc/cpuinfo && echo yes || echo NO)"
if command -v cryptsetup >/dev/null; then
  cryptsetup benchmark -c aes-xts-plain64 -s 512 2>/dev/null | tail -1 |
    awk '{print "LUKS cipher (aes-xts 512) in memory: encrypt " $3 " " $4 ", decrypt " $5 " " $6}'
fi
echo "Test file size: $SIZE, runtime: ${RUNTIME}s per test"
echo

d=0
for target in "${DIRS[@]}"; do
  d=$((d + 1))
  if [[ "$target" == loop:* ]]; then
    base="${target#loop:}"
    if [[ $EUID -ne 0 ]]; then
      echo "Skipping $target: loop tests must run as root" >&2
      continue
    fi
    if [[ ! -d "$base" ]]; then
      echo "Skipping $target: $base is not a directory" >&2
      continue
    fi
    setup_loop "$base"
    dir=$LOOP_MNT
    echo "== $target (plain ext4 on $LOOP_DEV, backed by a file in $base; -o $LOOP_MOUNT_OPTS)"
  else
    dir=$target
    if [[ ! -d "$dir" ]]; then
      echo "Skipping $dir: not a directory" >&2
      continue
    fi
    echo "== $dir ($(df -h --output=source "$dir" | tail -1))"
  fi
  file="$dir/.io-benchmark.$$"
  TEST_FILES+=("$file")

  i=0
  for test in "${TESTS[@]}"; do
    name="${test%%|*}"
    opts="${test#*|}"
    echo "   running: $name"
    # shellcheck disable=SC2086
    fio --name=bench --filename="$file" --size="$SIZE" \
      --ioengine=libaio --direct=1 --time_based --runtime="$RUNTIME" \
      --ramp_time=3 --group_reporting --output-format=json $opts \
      >"$RESULTS_DIR/$(printf '%02d__%02d' "$d" "$i").json"
    i=$((i + 1))
  done
  rm -f "$file"
  teardown_loops
  echo
done

python3 - "$RESULTS_DIR" "${DIRS[@]}" <<'EOF'
import json, os, sys

results_dir, dirs = sys.argv[1], sys.argv[2:]
names = [
    "Random read 8k (QD16)",
    "Random write 8k (QD16)",
    "Commit 8k + fdatasync (QD1)",
    "Sequential read 1M",
    "Sequential write 1M",
]

def summarize(path):
    job = json.load(open(path))["jobs"][0]
    side = job["read"] if job["read"]["io_bytes"] else job["write"]
    lat = side["clat_ns"]
    p99 = lat.get("percentile", {}).get("99.000000", 0)
    sync = job.get("sync", {}).get("lat_ns", {})
    if sync.get("mean"):
        # Commit latency = write + fdatasync
        p99 += sync.get("percentile", {}).get("99.000000", 0)
        mean = lat["mean"] + sync["mean"]
    else:
        mean = lat["mean"]
    return side["iops"], side["bw"] / 1024, mean / 1000, p99 / 1000

rows = {}
for n, d in enumerate(dirs, start=1):
    for i, name in enumerate(names):
        path = os.path.join(results_dir, f"{n:02d}__{i:02d}.json")
        if os.path.exists(path):
            rows.setdefault(name, []).append((d, *summarize(path)))

w = max(len("Location"), *(len(d) for d in dirs))
print("== Results (higher IOPS/MB/s is better, lower latency is better)\n")
print(f"{'Test':<30} {'Location':<{w}} {'IOPS':>9} {'MB/s':>8} {'avg ms':>8} {'p99 ms':>8}")
for name in names:
    for d, iops, mbs, mean_us, p99_us in rows.get(name, []):
        print(f"{name:<30} {d:<{w}} {iops:>9.0f} {mbs:>8.1f} {mean_us/1000:>8.2f} {p99_us/1000:>8.2f}")
    print()

if len(dirs) >= 2:
    print(f"== Relative to {dirs[0]}\n")
    for name in names:
        r = rows.get(name, [])
        if len(r) < 2 or not r[0][1]:
            continue
        base = r[0][1]
        cmp = ", ".join(f"{d}: {iops / base * 100:.0f}%" for d, iops, *_ in r[1:])
        print(f"{name:<30} {cmp}")
EOF
