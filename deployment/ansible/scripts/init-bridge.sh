#!/bin/bash
set -e

INSTANCES_DIR="$(eval echo ~${SUDO_USER:-$USER})/instances"

# Detect instance directories
mapfile -t INSTANCE_DIRS < <(find "$INSTANCES_DIR" -maxdepth 2 -name docker-compose.yml -exec grep -l 'protonmail-bridge' {} \; | xargs -I{} dirname {} 2>/dev/null || true)

if [ ${#INSTANCE_DIRS[@]} -eq 0 ]; then
  echo "Error: No Memoryhole instances found in $INSTANCES_DIR"
  exit 1
elif [ ${#INSTANCE_DIRS[@]} -eq 1 ]; then
  INSTANCE_DIR="${INSTANCE_DIRS[0]}"
else
  echo "Multiple instances found:"
  for i in "${!INSTANCE_DIRS[@]}"; do
    echo "  $((i+1))) ${INSTANCE_DIRS[$i]}"
  done
  echo ""
  read -rp "Select instance [1-${#INSTANCE_DIRS[@]}]: " CHOICE
  idx=$((CHOICE - 1))
  if [ -z "${INSTANCE_DIRS[$idx]}" ]; then
    echo "Invalid selection."
    exit 1
  fi
  INSTANCE_DIR="${INSTANCE_DIRS[$idx]}"
fi

echo ""
echo "======================================================"
echo "  ProtonMail Bridge Setup: $(basename "$INSTANCE_DIR")"
echo "======================================================"
echo ""
echo "Stopping bridge service..."
docker compose -f "$INSTANCE_DIR/docker-compose.yml" stop protonmail-bridge

echo ""
echo "Inside the bridge shell, run:"
echo ""
echo "  login"
echo "  -> enter your ProtonMail email and password"
echo "  -> complete 2FA if prompted"
echo ""
echo "  info"
echo "  -> displays the generated SMTP credentials"
echo "  *** NOTE THESE DOWN — you will enter them in the app settings ***"
echo ""
echo "  exit"
echo ""
echo "Press ENTER to start the bridge init shell..."
read -r

docker compose -f "$INSTANCE_DIR/docker-compose.yml" run --rm -it protonmail-bridge init

echo ""
echo "Restarting instance stack..."
docker compose -f "$INSTANCE_DIR/docker-compose.yml" up -d

echo ""
echo "======================================================"
echo "  Next Steps"
echo "======================================================"
echo "Log in to your Memoryhole instance as admin and go to"
echo "Settings > Email to enter the bridge SMTP credentials."
echo ""
echo "  Host: protonmail-bridge"
echo "  Port: 1025"
echo "  User: (bridge-generated username)"
echo "  Pass: (bridge-generated password)"
echo ""
