#!/bin/sh
set -e
node_modules/.bin/cedar prisma migrate deploy
exec "$@"
