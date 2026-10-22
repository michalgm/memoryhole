import { createServer } from '@cedarjs/api-server'

import { startCollabServer } from 'src/collab-server/collab-server'
import { initDb } from 'src/lib/db'
import { logger } from 'src/lib/logger'

async function main() {
  await initDb()
  const server = await createServer({ logger })

  await server.start()
  startCollabServer().catch((err) =>
    logger.error('Collab server error: ' + err)
  )
}

main()
