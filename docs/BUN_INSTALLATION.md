# Bun Package Manager Installation Guide

## Overview

Bun is a fast, all-in-one JavaScript runtime and package manager that is fully compatible with Node.js projects, including agno-client. It can be dropped into existing workflows to speed up dependency management by up to 25x without major changes.

## Installation

### Recommended: Official Installation Script

The official installation script provides simplicity and reliability on all supported platforms.

#### macOS/Linux

```bash
curl -fsSL https://bun.sh/install | bash
```

#### Windows

Requires Windows 10 version 1809 or later:

```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

#### Prerequisites

- **macOS**: 13.0 or later
- **Linux**: kernel 5.1+ (5.6+ recommended); ensure `unzip` is installed:
  ```bash
  sudo apt install unzip
  ```
- **Windows**: Windows 1809+ with WSL 2 support

### Alternative Installation Methods

#### Via npm (useful for bootstrapping)

```bash
npm install -g bun
```

#### Homebrew (macOS/Linux)

```bash
brew install bun
```

#### Docker

For containerized setups, CI/CD, or isolated environments:

```bash
docker pull oven/bun
docker run --rm -v "$(pwd)":/app -w /app oven/bun bun install
```

## Post-Installation Setup

### Verify Installation

```bash
bun --version
bun --revision
```

### Add to PATH (if not found)

If the `bun` command is not found, manually add it to your PATH:

**For bash/zsh:**

```bash
export PATH="$HOME/.bun/bin:$PATH"
```

Add this line to your `~/.bashrc`, `~/.zshrc`, or shell configuration file.

### Upgrade Bun

```bash
bun upgrade
```

For Homebrew users:

```bash
brew upgrade bun
```

## Using Bun with agno-client

### Install Dependencies

```bash
# Clone the repository
git clone https://github.com/rodrigocoliveira/agno-client.git
cd agno-client

# Install with Bun
bun install
```

### Common Commands

```bash
# Run development server
bun dev

# Run tests
bun test

# Build packages
bun run build

# Type checking
bun run typecheck
```

## Performance Comparison

| Task | npm | pnpm | Bun |
|------|-----|------|-----|
| Install dependencies | ~45s | ~25s | ~2-4s |
| TypeScript compilation | ~8s | ~8s | ~2s |
| Test execution | varies | varies | ~1-2s |

## Migration from npm/pnpm to Bun

### Step 1: Remove existing lock files and node_modules

```bash
rm -rf node_modules
rm package-lock.json  # or pnpm-lock.yaml
```

### Step 2: Install with Bun

```bash
bun install
```

Bun will automatically create a `bun.lockb` file for reproducible installs.

### Step 3: Verify everything works

```bash
bun test
bun dev
```

## Key Flags for Efficient Workflows

### Production Builds

```bash
# Skip devDependencies and optionalDependencies
bun install --production
```

### Reproducible Installs (CI/CD)

```bash
# Fail if lockfile needs changes
bun install --frozen-lockfile
```

### Exclude Specific Dependencies

```bash
# Skip dev dependencies
bun install --omit dev

# Skip optional dependencies
bun install --omit optional
```

### Security: Block Recent Packages

```bash
# Block packages published in last 3 days (259200 seconds)
bun install --minimum-release-age 259200
```

## Troubleshooting

### Command not found

If you see `command not found: bun`, ensure the binary is in your PATH:

```bash
echo $PATH | grep bun
# If not present, add ~/.bun/bin to your PATH
```

### Permission denied

If you encounter permission errors:

```bash
chmod +x ~/.bun/bin/bun
```

### Compatibility Issues

Bun is highly compatible with Node.js, but if you encounter issues:

1. Check your Node.js version with `bun --version`
2. Ensure all dependencies support Bun (check for native modules)
3. Report issues to https://github.com/oven-sh/bun

## Best Practices

1. **Use stable releases** - Avoid canary builds in production
2. **Test thoroughly** - Run your test suite with Bun: `bun test`
3. **Lock files** - Always commit `bun.lockb` to version control
4. **Monorepos** - Use `--filter` for workspace-specific installs:
   ```bash
   bun install --filter './packages/core'
   ```
5. **CI/CD** - Use `--frozen-lockfile` for reproducible builds

## Additional Resources

- [Bun Official Documentation](https://bun.sh/docs)
- [Bun GitHub Repository](https://github.com/oven-sh/bun)
- [Bun Discord Community](https://discord.gg/bun)
- [agno-client Repository](https://github.com/rodrigocoliveira/agno-client)

## Notes

- Bun is still under active development but is production-ready
- Full Node.js API compatibility ensures seamless integration
- Performance improvements are especially noticeable in monorepo setups
- For security-critical applications, use release versions (not canary builds)
