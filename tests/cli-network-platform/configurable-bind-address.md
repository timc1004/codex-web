### Configurable bind address and environment password
Prerequisites: build the app, install the official Codex CLI, and use an isolated CODEX_HOME. Choose a free test port.
Actions:
1. Start `node dist-cli/index.js --port 4198 --no-open`; inspect the socket with `lsof -nP -iTCP:4198 -sTCP:LISTEN`.
2. Restart with `--host 0.0.0.0` and confirm all-interface binding. Open the LAN URL from another device and sign in with the generated password.
3. Set `CODEXUI_HOST=127.0.0.1` and pass `--host 0.0.0.0`; confirm the flag wins.
4. Supply `CODEXUI_PASSWORD` through the environment; confirm remote login requires that password. Do not put it in screenshots or shell history.
5. Test an intentional provider request with a specific LAN bind address; internal proxy authentication must succeed.
Expected: default is loopback, requested addresses are respected, startup output matches the listener, and credentials are not embedded in source or browser builds.
Cleanup: stop the test process and remove the isolated CODEX_HOME and temporary environment file.
Performance: binding and proxy authentication add constant-time startup/header work, no extra requests, caches, payload growth, blocking filesystem reads, or fanout. Live browser timings were not measured.
