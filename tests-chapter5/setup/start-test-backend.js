import { spawn } from 'node:child_process'
import path from 'node:path'

import { MongoMemoryServer } from 'mongodb-memory-server'

const start = async () => {
  const mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()

  const backendDir = path.resolve(import.meta.dirname, '../../library-backend')

  const serverProcess = spawn('tsx', ['src/main.ts'], {
    cwd: backendDir,
    env: {
      ...process.env,
      NODE_ENV: 'test',
      MONGODB_URI: uri,
      JWT_SECRET: 'test-secret-key',
      PORT: '4000',
    },
    stdio: ['pipe', 'pipe', 'pipe'],
  })

  serverProcess.stdout.on('data', (data) => {
    const output = data.toString()
    process.stdout.write(output)
  })

  serverProcess.stderr.on('data', (data) => {
    process.stderr.write(data.toString())
  })

  process.on('SIGTERM', () => {
    serverProcess.kill()
    mongoServer.stop()
  })

  process.on('SIGINT', () => {
    serverProcess.kill()
    mongoServer.stop()
  })
}

start()
