# Publishing this fork

Target: `timc1004/codex-web`. Package publishing is disabled with `private: true`.

Do not push the existing history: it contains previously tracked environment files, TLS private material, and bundled provider keys. Rotate any real exposed secrets. Prepare a fresh source snapshot that excludes `.git`, `.env*`, `.aws`, `.cert`, `.codex`, `node_modules`, build output, and local test output, then initialize a new repository in that snapshot. Preserve LICENSE.

Run `npm run build` and `npm run test:unit` before publishing. Add the new GitHub remote only to the clean snapshot. Review the complete staged file list before pushing.
