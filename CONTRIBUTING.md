# Contributing to Esdora

Thank you for your interest in contributing to Esdora! This guide will help you get started.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 22.16.0
- pnpm >= 10.13.1

### Setup

1. Clone the repository:

```bash
git clone https://github.com/esdora-js/esdora.git
cd esdora
```

2. Install dependencies:

```bash
pnpm install
```

3. Start development:

```bash
pnpm dev
```

## 📁 Project Structure

```
esdora/
├── packages/
│   └── kit/                 # Main library package
├── docs/                    # Documentation site
├── .github/                 # GitHub workflows and templates
├── .vscode/                 # VS Code configuration
└── scripts/                 # Build and utility scripts
```

## 🛠️ Development Workflow

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in UI mode
pnpm test:ui

# Run tests for specific package
pnpm test:kit
```

### Code Quality

```bash
# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Type checking
pnpm typecheck
```

### Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build:kit
```

## 📝 Commit Convention

We use [Conventional Commits](https://conventionalcommits.org/) for commit messages:

```bash
# Use the interactive commit tool
pnpm commit

# Or manually follow the format:
# type(scope): description
#
# Examples:
# feat(kit): add new validation function
# fix(web): resolve browser detection issue
# docs: update contributing guide
```

### Commit Types

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes

## 🧪 Testing Guidelines

- Write tests for all new features and bug fixes
- Maintain test coverage above 80%
- Use descriptive test names
- Follow the existing test patterns

### Test Structure

```typescript
import { describe, expect, it } from 'vitest'
import { yourFunction } from '.'

describe('yourFunction', () => {
  it('should handle normal cases', () => {
    expect(yourFunction('input')).toBe('expected')
  })

  it('should handle edge cases', () => {
    expect(yourFunction('')).toBe('')
  })
})
```

## 📚 Documentation

- Update documentation for any API changes
- Include JSDoc comments for public APIs
- Add examples for new features

## 🔄 Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Add tests for your changes
5. Ensure all tests pass: `pnpm test`
6. Ensure code quality: `pnpm lint`
7. Commit your changes: `pnpm commit`
8. Push to your fork: `git push origin feat/your-feature`
9. Create a Pull Request

### PR Guidelines

- Provide a clear description of the changes
- Reference any related issues
- Ensure CI passes
- Request review from maintainers

## 🐛 Reporting Issues

When reporting issues, please include:

- Node.js and pnpm versions
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Relevant code snippets or error messages

## 💡 Feature Requests

We welcome feature requests! Please:

- Check if the feature already exists
- Provide a clear use case
- Consider the impact on existing users
- Be open to discussion and feedback

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

For more information, visit: https://github.com/esdora-js/esdora
