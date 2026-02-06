# MemoryHole

MemoryHole is a database application for tracking arrestees arrested at political actions. It is built using the [CedarJS framework](https://cedarjs.com/)

## Dev Setup

Note - the dev setup is not secure and should not be used with actual arrestee data

### Prerequisites

1. Install [`docker` + `docker compose`](https://docs.docker.com/engine/install/)
2. Install [nvm](https://github.com/nvm-sh/nvm)

### Database setup

1. cd deployment
2. `echo "POSTGRES_PASSWORD=memoryhole" > .env.db`
3. `docker compose up -dV`
   - this will fetch the docker image, create a persistent data volume, and launch the database container
4. `cd ../`

### App setup

1. `nvm install $(cat .nvmrc)`
2. `corepack enable`
   - sets up yarn
3. `yarn install`
   - install nodejs dependencies
4. `cp .env.dev .env`
5. edit .env and replace `SEED_USER_NAME`, `SEED_USER_PASSWORD`, and `SEED_USER_EMAIL` with actual values
6. `echo SESSION_SECRET=$(yarn cedar g secret --raw) >> .env`
7. `yarn cedar prisma migrate dev`
   - initializes the database
8. `yarn cedar prisma db seed`
   - seed the db with the user/password set in the .env file
9. `yarn cedar dev`

The app will start on `http://localhost:8910/`, and you can log in using the email and password you set in `.env`

### Deployment

make sure you have a `deploy.toml` file in the root directory with info about the deploy targets.

Deployments will deploy the code from github in the `main` brach, so make sure to push and commit your changes

- to deploy to staging, run `yarn cedar deploy baremetal staging`
- to deploy to production, run `yarn cedar deploy baremetal production`

### managing deploys

- you can restart deploys by ssh-ing to the server and running `pm2 restart [prod|stage]` (depending on which instance you want to restart)
- you can see the current status with `pm2 status`
- you can view logs view `pm2 logs [prod|stage]`
