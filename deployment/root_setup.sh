#!/bin/bash

usermod -a -G sudo gmichalec
passwd gmichalec
adduser memoryhole
usermod -a -G docker memoryhole
sudo mkdir -p /var/www/memoryhole
sudo chown memoryhole:memoryhole /var/www/memoryhole
mkdir /home/memoryhole/.ssh
cp /home/gmichalec/.ssh/authorized_keys  /home/memoryhole/.ssh/
chown -R memoryhole:memoryhole /home/memoryhole/.ssh/
sudo apt install docker-compose nginx certbot  python3-certbot-nginx
ufw allow "WWW Full"

dd if=/dev/zero of=/swapfile.img bs=2048 count=1M
mkswap /swapfile.img
echo /swapfile.img swap swap sw 0 0 >> /etc/fstab
chmod 600 /swapfile.img
swapon /swapfile.img
