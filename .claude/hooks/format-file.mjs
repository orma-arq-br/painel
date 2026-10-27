// Claude Code PostToolUse hook: formats the file Claude just wrote or edited.
// Written in Node instead of shell so it behaves the same on macOS and Windows.
import { execSync } from "node:child_process"

let raw = ""
for await (const chunk of process.stdin) raw += chunk

let file
try {
  const input = JSON.parse(raw)
  file = input.tool_response?.filePath ?? input.tool_input?.file_path
} catch {
  process.exit(0)
}
if (!file) process.exit(0)

try {
  execSync(
    `pnpm exec prettier --write --ignore-unknown ${JSON.stringify(file)}`,
    {
      stdio: "ignore",
    },
  )
} catch {
  // Formatting must never block the edit itself.
}
