import { expect, it } from 'vitest'
import { resolvePassword } from './password'
it('never generates or retains plaintext when bcrypt is configured', () => {
  for (const input of [true, false, 'plaintext']) {
    expect(resolvePassword(input, 'configured-hash')).toEqual({ password: undefined, generated: false })
  }
})
it('preserves plaintext, generated and explicitly disabled modes without bcrypt', () => {
  expect(resolvePassword('plaintext')).toEqual({ password: 'plaintext', generated: false })
  expect(resolvePassword(false)).toEqual({ password: undefined, generated: false })
  expect(resolvePassword(true)).toEqual({ password: expect.any(String), generated: true })
})
