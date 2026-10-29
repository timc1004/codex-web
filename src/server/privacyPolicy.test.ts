import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'
import { getFreeKeyCount, getRandomFreeKey } from './freeMode'
it('ships no shared provider credentials', () => {
  expect(getFreeKeyCount()).toBe(0)
  expect(getRandomFreeKey()).toBeNull()
})
it('keeps the local editor independent of external scripts', () => {
  const source = readFileSync(new URL('./localBrowseUi.ts', import.meta.url), 'utf8')
  expect(source).not.toContain('cdnjs.cloudflare.com')
  expect(source).not.toContain('ace.edit(')
})
