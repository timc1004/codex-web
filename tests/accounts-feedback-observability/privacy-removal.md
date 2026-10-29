### Privacy: diagnostic collection and bundled credentials removed

Setup: build this checkout with Node and the project dependencies installed.
Actions: trigger a failed request, then click a feedback link. Inspect the email draft. Open provider settings without supplying an OpenRouter key.
Expected: feedback opens an empty email with no page text, storage, errors, URLs, or credentials attached. No bundled OpenRouter credential is available.
Cleanup: close the draft without sending.

Static performance audit: feedback no longer wraps fetch or installs global error listeners, reads browser storage, or copies page text. Bundled key decoding is removed. No extra requests or cache are introduced. Runtime performance was not measured.

### Outbound integration restrictions
Setup: start the newly built CLI with an existing Codex installation.
Actions: request `/codex-api/skills-hub` and `/codex-api/telegram/status`; open the local text editor; inspect the listener address; try starting with `--tunnel`.
Expected: external integration routes return 403; the editor uses a local textarea; the listener binds to 127.0.0.1; tunnel startup is rejected. Intentional provider chat and local API calls remain available. Browser CSP limits connections and assets to the same origin.
Cleanup: stop only the test server. No credentials should be entered for disabled integrations.
Performance audit: removed automatic installation, tunnel startup, Telegram polling, and remote editor scripts reduce startup work and outbound requests; CSP adds a fixed header with no fanout or cache. Browser timings and Docker provider scenarios were not measured.
