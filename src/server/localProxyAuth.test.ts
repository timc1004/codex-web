import { expect, it, vi, afterEach } from 'vitest'
import { localProxyOrigin, localProxyToken } from './localProxyAuth'
afterEach(() => vi.unstubAllEnvs())
it.each([
  ['127.0.0.1', '127.0.0.1'], ['0.0.0.0', '127.0.0.1'],
  ['192.168.1.10', '192.168.1.10'], ['::', '[::1]'], ['::1', '[::1]'],
])('routes the internal proxy for bind host %s', (host, target) => {
  vi.stubEnv('CODEXUI_SERVER_HOST', host)
  expect(localProxyOrigin(5900)).toBe(`http://${target}:5900`)
})
it('generates a process credential instead of a bundled password', () => {
  expect(localProxyToken).toMatch(/^[a-f0-9]{64}$/)
})
