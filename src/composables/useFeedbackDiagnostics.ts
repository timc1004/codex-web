import { computed, ref } from 'vue'

export type FeedbackDiagnosticKind = 'window-error' | 'unhandled-rejection' | 'fetch-error' | 'api-response' | 'visible-error'
export type FeedbackDiagnostic = {
  kind: FeedbackDiagnosticKind
  message: string
  atIso: string
  url?: string
  method?: string
  status?: number
  statusText?: string
}
const diagnostics = ref<FeedbackDiagnostic[]>([])
export function feedbackMailtoBase(): string { return 'mailto:' }
export function buildFeedbackMailto(_entries?: FeedbackDiagnostic[]): string { return feedbackMailtoBase() }
export function recordFeedbackDiagnostic(_input: Omit<FeedbackDiagnostic, 'atIso'> & { atIso?: string }): void {}
export function installFeedbackDiagnostics(): void {}
export function openFeedbackMail(): void {
  if (typeof window !== 'undefined') window.location.href = feedbackMailtoBase()
}
export function useFeedbackDiagnostics() {
  return {
    diagnostics,
    hasFeedbackDiagnostics: computed(() => false),
    recordVisibleFailure(_message: string, _url?: string): void {},
    openFeedbackMail,
    buildFeedbackMailto,
    feedbackMailtoBase,
  }
}
