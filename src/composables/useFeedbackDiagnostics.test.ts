import { expect, it } from 'vitest'
import { buildFeedbackMailto, recordFeedbackDiagnostic, useFeedbackDiagnostics } from './useFeedbackDiagnostics'
it('never collects or attaches diagnostics to feedback', () => {
  recordFeedbackDiagnostic({ kind: 'visible-error', message: 'private-token' })
  expect(useFeedbackDiagnostics().diagnostics.value).toEqual([])
  expect(buildFeedbackMailto([{ kind: 'window-error', message: 'private-token', atIso: '' }])).toBe('mailto:')
})
