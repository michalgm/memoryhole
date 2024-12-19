#!/bin/bash
# shellcheck disable=all
usermod -a -G sudo gmichalec
passwd gmichalec
adduser memoryhole
usermod -a -G docker memoryhole
sudo mkdir -p /var/www/memoryhole
sudo chown memoryhole:memoryhole /var/www/memoryhole

sudo mkdir -p /var/www/memoryhole_stage
sudo chown memoryhole:memoryhole /var/www/memoryhole_stage

mkdir /home/memoryhole/.ssh
cp /home/gmichalec/.ssh/authorized_keys /home/memoryhole/.ssh/
chown -R memoryhole:memoryhole /home/memoryhole/.ssh/

# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources:
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" |
  sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
sudo apt-get update
sudo apt install nginx certbot \
  docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

ufw allow "WWW Full"

dd if=/dev/zero of=/swapfile.img bs=2048 count=1M
mkswap /swapfile.img
echo /swapfile.img swap swap sw 0 0 >>/etc/fstab
chmod 600 /swapfile.img
swapon /swapfile.img

sudo cp /etc/nginx/sites-enabled/memoryhole.conf /etc/nginx/sites-enabled/memoryhole-stage.conf
sudo sed -i -e "s/memoryhole/memoryhole-stage/g" /etc/nginx/sites-enabled/memoryhole-stage.conf
sudo sed -i -e "s/redwood_server/redwood_server_stage/g" /etc/nginx/sites-enabled/memoryhole-stage.conf
