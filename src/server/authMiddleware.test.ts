import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, expect, it, vi } from 'vitest'
import type { Request, Response } from 'express'
import { createAuthSession } from './authMiddleware'
import { localProxyToken } from './localProxyAuth'
afterEach(() => vi.unstubAllEnvs())
it('limits the process credential to provider proxy routes', () => {
  const home = mkdtempSync(join(tmpdir(), 'codex-auth-test-'))
  vi.stubEnv('CODEX_HOME', home)
  try {
    const session = createAuthSession('test-only-password')
    for (const [path, token, allowed] of [
      ['/codex-api/zen-proxy/v1/responses', localProxyToken, true],
      ['/codex-api/custom-proxy/v1/responses', localProxyToken, true],
      ['/codex-api/openrouter-proxy/v1/responses', localProxyToken, true],
      ['/codex-api/zen-proxy/v1/responses', 'zen-proxy-token', false],
      ['/codex-api/accounts', localProxyToken, false],
    ] as const) {
      const next = vi.fn()
      const response = { setHeader: vi.fn(), status: vi.fn().mockReturnThis(), send: vi.fn() }
      session.middleware({ path, method: 'POST', headers: { authorization: `Bearer ${token}`, host: '192.168.1.10' }, socket: { remoteAddress: '192.168.1.20' } } as Request, response as unknown as Response, next)
      expect(next.mock.calls.length, path).toBe(allowed ? 1 : 0)
    }
  } finally {
    rmSync(home, { recursive: true, force: true })
  }
})
