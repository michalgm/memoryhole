#!/bin/bash
# =============================================================================
# EMERGENCY SHUTDOWN SCRIPT
# =============================================================================
# This script performs an emergency shutdown to protect data in case of:
# - Suspected security breach
# - Legal/subpoena concerns
# - System compromise
#
# Actions performed:
# 1. Stops all application services
# 2. Flushes filesystem caches
# 3. Unmounts encrypted volume
# 4. Locks LUKS encrypted device
# 5. Optionally powers down the system
#
# Usage:
#   sudo /usr/local/bin/emergency-shutdown.sh [--poweroff]
#
# IMPORTANT: After running this script, the encrypted volume must be manually
# unlocked before services can restart.
# =============================================================================

set -e

# Configuration (these should match your Ansible variables)
ENCRYPTED_VOLUME_NAME="memoryhole_data"
ENCRYPTED_VOLUME_MOUNT="/mnt/memoryhole_data"
LOG_FILE="/var/log/emergency-shutdown.log"

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}ERROR: This script must be run as root${NC}"
  exit 1
fi

# Logging function
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

echo -e "${RED}"
cat << 'EOF'
╔═══════════════════════════════════════════════════════════════╗
║                   ⚠️  EMERGENCY SHUTDOWN  ⚠️                  ║
╠═══════════════════════════════════════════════════════════════╣
║  This will IMMEDIATELY stop all services and lock encrypted  ║
║  volumes. Manual intervention will be required to restart.   ║
║                                                               ║
║  Press Ctrl+C to abort within 10 seconds...                  ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Countdown
for i in {10..1}; do
  echo -ne "${YELLOW}Proceeding in $i seconds...\r${NC}"
  sleep 1
done
echo ""

log "=========================================="
log "EMERGENCY SHUTDOWN INITIATED"
log "Initiated by: $(whoami)"
log "Reason: ${1:-Manual trigger}"
log "=========================================="

# =============================================================================
# STEP 1: Stop Application Services
# =============================================================================
echo -e "${YELLOW}[1/6] Stopping application services...${NC}"
log "Stopping application services"

# Stop docker containers gracefully
if systemctl is-active --quiet memoryhole; then
  systemctl stop memoryhole
  log "Stopped memoryhole systemd service"
fi

if command -v docker &> /dev/null; then
  # Give containers 30 seconds to stop gracefully
  docker compose down --timeout 30 || true
  docker stop $(docker ps -q) --time 30 2>/dev/null || true
  log "Stopped Docker containers"
fi

# Stop PostgreSQL if running standalone
if systemctl is-active --quiet postgresql; then
  systemctl stop postgresql
  log "Stopped PostgreSQL service"
fi

echo -e "${GREEN}✓ Services stopped${NC}"

# =============================================================================
# STEP 2: Kill Any Remaining Processes Using Encrypted Volume
# =============================================================================
echo -e "${YELLOW}[2/6] Terminating processes using encrypted volume...${NC}"
log "Checking for processes using encrypted volume"

# Find and kill processes using the mount point
PROCS=$(lsof +D "$ENCRYPTED_VOLUME_MOUNT" 2>/dev/null | tail -n +2 | awk '{print $2}' | sort -u || true)

if [ -n "$PROCS" ]; then
  echo "Terminating processes: $PROCS"
  log "Killing processes: $PROCS"
  echo "$PROCS" | xargs kill -TERM 2>/dev/null || true
  sleep 3
  # Force kill if still running
  echo "$PROCS" | xargs kill -KILL 2>/dev/null || true
else
  log "No processes found using encrypted volume"
fi

echo -e "${GREEN}✓ Processes terminated${NC}"

# =============================================================================
# STEP 3: Sync and Flush Filesystem Caches
# =============================================================================
echo -e "${YELLOW}[3/6] Flushing filesystem caches...${NC}"
log "Syncing filesystems"

sync
sync
sync

# Drop caches (optional, for security)
echo 3 > /proc/sys/vm/drop_caches

log "Filesystem caches flushed"
echo -e "${GREEN}✓ Caches flushed${NC}"

# =============================================================================
# STEP 4: Unmount Encrypted Volume
# =============================================================================
echo -e "${YELLOW}[4/6] Unmounting encrypted volume...${NC}"
log "Unmounting $ENCRYPTED_VOLUME_MOUNT"

if mountpoint -q "$ENCRYPTED_VOLUME_MOUNT"; then
  umount "$ENCRYPTED_VOLUME_MOUNT"
  log "Successfully unmounted $ENCRYPTED_VOLUME_MOUNT"
  echo -e "${GREEN}✓ Volume unmounted${NC}"
else
  log "WARNING: Volume was not mounted"
  echo -e "${YELLOW}⚠ Volume was not mounted${NC}"
fi

# =============================================================================
# STEP 5: Close LUKS Device
# =============================================================================
echo -e "${YELLOW}[5/6] Locking LUKS encrypted device...${NC}"
log "Closing LUKS device $ENCRYPTED_VOLUME_NAME"

if cryptsetup status "$ENCRYPTED_VOLUME_NAME" &>/dev/null; then
  cryptsetup luksClose "$ENCRYPTED_VOLUME_NAME"
  log "Successfully closed LUKS device $ENCRYPTED_VOLUME_NAME"
  echo -e "${GREEN}✓ LUKS device locked${NC}"
else
  log "WARNING: LUKS device was not open"
  echo -e "${YELLOW}⚠ LUKS device was not open${NC}"
fi

# =============================================================================
# STEP 6: Optional System Poweroff
# =============================================================================
if [ "$1" == "--poweroff" ]; then
  echo -e "${YELLOW}[6/6] Powering down system...${NC}"
  log "System poweroff requested"
  
  # Send notification if configured
  if command -v mail &> /dev/null; then
    echo "Emergency shutdown executed on $(hostname) at $(date)" | \
      mail -s "Emergency Shutdown: $(hostname)" root || true
  fi
  
  log "Initiating system poweroff in 5 seconds"
  echo -e "${RED}System will power off in 5 seconds...${NC}"
  sleep 5
  
  systemctl poweroff
else
  echo -e "${GREEN}[6/6] System remains online${NC}"
  log "System remains online, encrypted volume locked"
fi

# =============================================================================
# COMPLETION
# =============================================================================
echo ""
echo -e "${GREEN}"
cat << 'EOF'
╔═══════════════════════════════════════════════════════════════╗
║             ✓ EMERGENCY SHUTDOWN COMPLETE                    ║
╠═══════════════════════════════════════════════════════════════╣
║  Encrypted volume is now LOCKED                              ║
║  All data is secure at rest                                  ║
║                                                               ║
║  To restore service:                                         ║
║  1. Unlock volume: cryptsetup luksOpen <device> <name>       ║
║  2. Mount volume: mount /dev/mapper/<name> <mountpoint>      ║
║  3. Restart services: systemctl start memoryhole             ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

log "Emergency shutdown completed successfully"
log "=========================================="

exit 0
