### Bcrypt password configuration
Prerequisites: install dependencies and build; use an isolated CODEX_HOME and a free port. Generate a bcrypt hash with the README command.
Actions:
1. Set CODEXUI_PASSWORD_BCRYPT to the complete hash and CODEXUI_PASSWORD to a different password. Start the CLI with --host 0.0.0.0 --no-open.
2. Sign in from a remote browser with the bcrypt password; repeat with the plaintext password and an incorrect password.
3. Restart with --password set to another password, then with --no-password. The hash must still control authentication.
4. Try empty and malformed hashes; confirm startup fails rather than disabling authentication or falling back to plaintext.
5. Inspect the isolated CODEX_HOME: no codexui-password file should have been generated. A pre-existing file is not removed automatically.
6. Unset the hash and confirm plaintext, generated password, and explicit --no-password behavior remains available.
Expected: only the password matching the hash succeeds; the hash itself does not log in. Password-in-URL links are disabled in bcrypt mode. Passwords over 72 UTF-8 bytes are rejected. Existing authenticated sessions retain their normal lifetime.
Cleanup: stop the test process, unset test environment variables, and remove the isolated CODEX_HOME.
Performance: bcrypt verification runs only on submitted login attempts; authenticated requests retain the existing session check and incur no hashing. Async bcrypt yields between CPU work chunks. No additional requests, caches, filesystem reads, payload growth, or fanout are introduced. Hash cost controls login CPU/latency; browser and Docker flows were not measured.
Local measurement: bcrypt cost 12 verification took 265, 264, and 268 ms across three sequential attempts on the development host. Higher configured costs will be slower.
