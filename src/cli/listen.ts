import type { Server } from 'node:http'

export function listenWithFallback(server: Server, startPort: number, host: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const attempt = (port: number) => {
      const onError = (error: NodeJS.ErrnoException) => {
        server.off('listening', onListening)
        if (error.code === 'EADDRINUSE' || error.code === 'EACCES') {
          attempt(port + 1)
          return
        }
        reject(error)
      }
      const onListening = () => {
        server.off('error', onError)
        const address = server.address()
        resolve(address && typeof address === 'object' ? address.port : port)
      }

      server.once('error', onError)
      server.once('listening', onListening)
      server.listen(port, host)
    }

    attempt(startPort)
  })
}

