import { randomInt } from 'node:crypto'

const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'

function randomGroup(length: number): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += CHARS[randomInt(CHARS.length)]
  }
  return result
}

export function generatePassword(): string {
  return `${randomGroup(3)}-${randomGroup(3)}-${randomGroup(3)}`
}

export function resolvePassword(input: string | boolean, passwordBcrypt?: string): { password: string | undefined; generated: boolean } {
  if (passwordBcrypt !== undefined || input === false) return { password: undefined, generated: false }
  if (typeof input === 'string') return { password: input, generated: false }
  return { password: generatePassword(), generated: true }
}
