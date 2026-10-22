module.exports = {
  apps: [
    {
      name: 'prod',
      cwd: '/var/www/memoryhole/current',
      script: 'api/dist/server.js',
      args: 'serve api',
      instances: 'max',
      exec_mode: 'cluster',
      wait_ready: true,
      listen_timeout: 10000,
    },
    {
      name: 'stage',
      cwd: '/var/www/memoryhole-stage/current',
      script: 'api/dist/server.js',
      args: 'serve api -p 8920',
      instances: 'max',
      exec_mode: 'cluster',
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],
}
