import { createServer } from 'node:http'
import { expect, it } from 'vitest'
import { listenWithFallback } from './listen'
it.each(['127.0.0.1', '0.0.0.0'])('binds to the requested address %s', async host => {
  const server = createServer()
  try {
    const port = await listenWithFallback(server, 0, host)
    const address = server.address()
    expect(address && typeof address === 'object' && address.address).toBe(host)
    expect(port).toBeGreaterThan(0)
  } finally {
    if (server.listening) await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
  }
})
