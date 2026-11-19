#!/usr/bin/env bash
#
# Compare real Postgres performance across directories with pgbench. For each
# directory, starts a throwaway postgres:16 container with its data directory
# there, loads pgbench's test database and runs read/write and read-only
# workloads. Companion to io-benchmark.sh (raw disk I/O). Run on the server
# as root, with Docker running (i.e. after unlocking the encrypted volume):
#
#   sudo bash pgbench-benchmark.sh                     # root disk vs encrypted volume
#   sudo bash pgbench-benchmark.sh /var/tmp /mnt/encrypted /mnt/volume-test
#
# Run it on a test server (it competes with any running instances for CPU and
# disk), while otherwise idle, and 2-3 times: Linode plans share hardware.
#
# Environment overrides:
#   SCALE=100     pgbench scale factor; ~15 MB per unit (100 = ~1.5 GB). Keep
#                 the database larger than RAM so reads actually hit the disk
#   CLIENTS=8     concurrent pgbench clients
#   RUNTIME=60    seconds per workload
#   IMAGE=postgres:16
#
set -euo pipefail

SCALE="${SCALE:-100}"
CLIENTS="${CLIENTS:-8}"
RUNTIME="${RUNTIME:-60}"
IMAGE="${IMAGE:-postgres:16}"
DIRS=("$@")
if [[ ${#DIRS[@]} -eq 0 ]]; then
  DIRS=(/var/tmp /mnt/encrypted)
fi

if ! docker info >/dev/null 2>&1; then
  echo "Docker isn't running. Unlock the encrypted volume first (unlock_data unlock)." >&2
  exit 1
fi

CONTAINER="pgbench-benchmark-$$"
DATA_DIRS=()
RESULTS=()
# Postgres data is owned by the container's postgres user, so delete it from
# inside a container (works whether or not this script runs as root)
remove_data() {
  docker run --rm -v "$(dirname "$1"):/parent" "$IMAGE" \
    rm -rf "/parent/$(basename "$1")" >/dev/null 2>&1 || true
}
cleanup() {
  docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
  for data in "${DATA_DIRS[@]}"; do remove_data "$data"; done
}
trap cleanup EXIT

# name | pgbench options
WORKLOADS=(
  "Read/write (TPC-B-like)|"
  "Read-only (SELECT)|--select-only"
)

docker pull -q "$IMAGE" >/dev/null
echo "Scale: $SCALE (~$((SCALE * 15)) MB), clients: $CLIENTS, runtime: ${RUNTIME}s per workload"
echo "RAM: $(free -h | awk '/^Mem:/ {print $2}')"
echo

for dir in "${DIRS[@]}"; do
  if [[ ! -d "$dir" ]]; then
    echo "Skipping $dir: not a directory" >&2
    continue
  fi
  data="$dir/.pgbench-benchmark.$$"
  mkdir -p "$data"
  DATA_DIRS+=("$data")
  echo "== $dir ($(df -h --output=source "$dir" | tail -1))"

  docker run -d --name "$CONTAINER" \
    -e POSTGRES_PASSWORD=bench -e POSTGRES_DB=bench \
    -v "$data:/var/lib/postgresql/data" \
    "$IMAGE" >/dev/null
  for _ in $(seq 1 60); do
    docker exec "$CONTAINER" pg_isready -U postgres -d bench >/dev/null 2>&1 && break
    sleep 1
  done
  # The entrypoint restarts Postgres once after initdb; wait for that too
  sleep 3
  until docker exec "$CONTAINER" pg_isready -U postgres -d bench >/dev/null 2>&1; do sleep 1; done

  echo "   loading test data (scale $SCALE)..."
  docker exec "$CONTAINER" pgbench -U postgres -i -q -s "$SCALE" bench >/dev/null 2>&1
  # Start each run with a cold cache, so reads come from disk
  docker restart "$CONTAINER" >/dev/null
  sync
  if ! echo 3 2>/dev/null >/proc/sys/vm/drop_caches; then
    echo "   (not root: couldn't drop the page cache; read results may be inflated)"
  fi
  until docker exec "$CONTAINER" pg_isready -U postgres -d bench >/dev/null 2>&1; do sleep 1; done

  for workload in "${WORKLOADS[@]}"; do
    name="${workload%%|*}"
    opts="${workload#*|}"
    echo "   running: $name"
    # shellcheck disable=SC2086
    out=$(docker exec "$CONTAINER" pgbench -U postgres -c "$CLIENTS" -j 2 \
      -T "$RUNTIME" $opts bench 2>&1)
    tps=$(awk '/^tps = / {print $3; exit}' <<<"$out")
    lat=$(awk '/^latency average = / {print $4; exit}' <<<"$out")
    RESULTS+=("$name|$dir|${tps:-?}|${lat:-?}")
  done

  docker rm -f "$CONTAINER" >/dev/null
  remove_data "$data"
  echo
done

w=8
for dir in "${DIRS[@]}"; do ((${#dir} > w)) && w=${#dir}; done

echo "== Results (higher TPS is better, lower latency is better)"
echo
printf "%-26s %-${w}s %10s %12s\n" "Workload" "Location" "TPS" "Latency ms"
for workload in "${WORKLOADS[@]}"; do
  name="${workload%%|*}"
  for r in "${RESULTS[@]}"; do
    IFS='|' read -r rname rdir rtps rlat <<<"$r"
    [[ "$rname" == "$name" ]] && printf "%-26s %-${w}s %10.0f %12.2f\n" "$rname" "$rdir" "$rtps" "$rlat"
  done
  echo
done

if [[ ${#DIRS[@]} -ge 2 ]]; then
  echo "== Relative to ${DIRS[0]}"
  echo
  for workload in "${WORKLOADS[@]}"; do
    name="${workload%%|*}"
    base=""
    line=""
    for r in "${RESULTS[@]}"; do
      IFS='|' read -r rname rdir rtps _ <<<"$r"
      [[ "$rname" == "$name" ]] || continue
      if [[ -z "$base" ]]; then
        base=$rtps
      else
        line+="$rdir: $(awk -v a="$rtps" -v b="$base" 'BEGIN {printf "%.0f%%", a / b * 100}')  "
      fi
    done
    [[ -n "$line" ]] && printf "%-26s %s\n" "$name" "$line"
  done
fi
