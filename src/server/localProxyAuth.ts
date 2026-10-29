import { randomBytes } from 'node:crypto'

// One process-local credential for Codex-to-app requests, never a bundled secret.
export const localProxyToken = randomBytes(32).toString('hex')

export function localProxyOrigin(port: number): string {
  const host = process.env.CODEXUI_SERVER_HOST || '127.0.0.1'
  const target = host === '0.0.0.0' ? '127.0.0.1' : host === '::' ? '::1' : host
  return `http://${target.includes(':') ? `[${target}]` : target}:${port}`
}
