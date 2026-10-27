// Runs on every `pnpm install` (the "prepare" script) to point git at the
// committed hooks in .githooks/. Must never fail an install: environments
// without a .git directory (tarball deploys, some CI) just skip it.
import { execSync } from "node:child_process"

try {
  execSync("git config core.hooksPath .githooks", { stdio: "ignore" })
} catch {
  // Not a git checkout; nothing to configure.
}
