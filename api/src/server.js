import { createServer } from '@cedarjs/api-server'

import { startCollabServer } from 'src/collab-server/collab-server'
import { logger } from 'src/lib/logger'

async function main() {
  const server = await createServer({ logger })

  await server.start()
  startCollabServer().catch((err) =>
    logger.error('Collab server error: ' + err)
  )
}

main()
