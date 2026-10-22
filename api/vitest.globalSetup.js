import { execFileSync } from 'node:child_process'
import path from 'node:path'

import 'dotenv-defaults/config.js'

import { getPaths } from '@cedarjs/project-config'

// Cedar's api test environment resets the test database before *every* test
// file. Reset it once per run here instead, then set SKIP_DB_PUSH so the
// per-file setup skips its own reset. Workers inherit this process's env.
export default function setup() {
  const cedarPaths = getPaths()

  process.env.DATABASE_URL =
    process.env.TEST_DATABASE_URL ||
    `file:${path.join(cedarPaths.generated.base, 'test.db')}`

  if (process.env.SKIP_DB_PUSH !== '1') {
    const command =
      process.env.TEST_DATABASE_STRATEGY === 'reset'
        ? ['prisma', 'migrate', 'reset', '--force']
        : ['prisma', 'db', 'push', '--force-reset', '--accept-data-loss']

    execFileSync('yarn', ['cedar', ...command], {
      cwd: cedarPaths.api.base,
      stdio: 'inherit',
      env: process.env,
    })
  }

  process.env.SKIP_DB_PUSH = '1'
}
