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

it('uses bcrypt instead of plaintext for login and rejects hash-as-password', async () => {
  const { hashSync } = await import('bcryptjs')
  const { EventEmitter } = await import('node:events')
  const home = mkdtempSync(join(tmpdir(), 'codex-bcrypt-test-'))
  vi.stubEnv('CODEX_HOME', home)
  const hash = hashSync('bcrypt-test-password', 4)
  try {
    const session = createAuthSession('ignored-plaintext', hash)
    for (const [password, expected] of [['bcrypt-test-password', 200], ['ignored-plaintext', 401], ['incorrect', 401], [hash, 401], ['x'.repeat(73), 401]] as const) {
      const req = Object.assign(new EventEmitter(), {
        path: '/auth/login', method: 'POST', headers: { host: '192.168.1.10' },
        socket: { remoteAddress: '192.168.1.20' }, setEncoding: vi.fn(),
      })
      let status = 200
      const response = { setHeader: vi.fn(), status: vi.fn((code: number) => { status = code; return response }), json: vi.fn() }
      const finished = new Promise<void>(resolve => response.json.mockImplementation(() => resolve()))
      session.middleware(req as unknown as Request, response as unknown as Response, vi.fn())
      req.emit('data', JSON.stringify({ password }))
      req.emit('end')
      await finished
      expect(status).toBe(expected)
      expect(response.setHeader.mock.calls.length).toBe(expected === 200 ? 1 : 0)
    }
  } finally { rmSync(home, { recursive: true, force: true }) }
})

it('fails closed for malformed bcrypt configuration', () => {
  expect(() => createAuthSession('plaintext', 'not-a-hash')).toThrow('valid bcrypt hash')
  expect(() => createAuthSession('plaintext', '')).toThrow('valid bcrypt hash')
})

it('does not accept plaintext password URLs when bcrypt is configured', async () => {
  const { hashSync } = await import('bcryptjs')
  const home = mkdtempSync(join(tmpdir(), 'codex-bcrypt-url-test-'))
  vi.stubEnv('CODEX_HOME', home)
  try {
    const session = createAuthSession('ignored-plaintext', hashSync('test-password', 4))
    const response = { setHeader: vi.fn(), status: vi.fn().mockReturnThis(), send: vi.fn(), redirect: vi.fn() }
    const next = vi.fn()
    session.middleware({ path: '/password=ignored-plaintext', method: 'GET', headers: { host: '192.168.1.10' }, socket: { remoteAddress: '192.168.1.20' } } as Request, response as unknown as Response, next)
    expect(next).not.toHaveBeenCalled()
    expect(response.redirect).not.toHaveBeenCalled()
    expect(response.setHeader).not.toHaveBeenCalledWith('Set-Cookie', expect.anything())
    expect(response.send).toHaveBeenCalled()
  } finally { rmSync(home, { recursive: true, force: true }) }
})
