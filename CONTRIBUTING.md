# Contributing to Package Template

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions! 🎉

> And if you like the project, but just don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation, which we would also be very happy about:
> - ⭐ Star the project
> - 🐦 Tweet about it
> - 📖 Refer this project in your project's readme
> - 💬 Mention the project at local meetups and tell your friends/colleagues

Please note we have a [Code of Conduct](./CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

## Table of Contents

- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Improving The Documentation](#improving-the-documentation)
- [Development Setup](#development-setup)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)

## I Have a Question

> If you want to ask a question, we assume that you have read the available [documentation](./README.md).

Before asking a question, please:
- Search for existing [issues](https://github.com/Komiriko/template-package-npm/issues) that might help you
- Check if someone already asked the same question

**How to ask:**
- [Create a new help & question issue](https://github.com/Komiriko/template-package-npm/issues/new/choose) using our template
- Or send an email to [komiriko@pm.me](mailto:komiriko@pm.me) for quick questions

We'll do our best to help you as soon as possible! 💬

## I Want To Contribute

> ### Legal Notice
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project license.

### Reporting Bugs

Found a bug? We'd love to hear about it! 🐞

**Before submitting:**
- Make sure you're using the latest version
- Check if the bug has already been reported in our [issues](https://github.com/Komiriko/template-package-npm/issues?q=label%3Abug)

**How to report:**
Simply [create a new bug report](https://github.com/Komiriko/template-package-npm/issues/new/choose) using our bug report template. The template will guide you through providing all the necessary information we need to investigate and fix the issue quickly.

### Suggesting Enhancements

Have an idea to make the project better? We'd love to hear it! ✨

**Before submitting:**
- Make sure you're using the latest version
- Check the [documentation](./README.md) to see if the feature already exists
- Search [existing enhancement requests](https://github.com/Komiriko/template-package-npm/issues?q=label%3Aenhancement) to avoid duplicates

**How to suggest:**
[Create a new feature request](https://github.com/Komiriko/template-package-npm/issues/new/choose) using our feature request template. It will help you structure your idea and provide all the context we need to evaluate and potentially implement it.

### Your First Code Contribution

Unsure where to begin contributing? You can start by looking through these `good-first-issue` and `help-wanted` issues:

- [Good first issues](https://github.com/Komiriko/template-package-npm/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) - issues which should only require a few lines of code, and a test or two.
- [Help wanted issues](https://github.com/Komiriko/template-package-npm/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) - issues which should be a bit more involved than `good first issue` issues.

### Improving The Documentation

Documentation improvements are always welcome! Whether it's fixing typos, clarifying existing content, or adding new sections, your contributions help make the project more accessible to everyone.

## Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/template-package-npm.git
   cd template-package-npm
   ```

3. **Install dependencies**:
   ```bash
   bun install
   ```

4. **Create a new branch** for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-fix-name
   ```

5. **Make your changes** and ensure they follow our style guidelines

6. **Run the tests** to make sure everything works:
   ```bash
   bun run test
   ```

7. **Run the linter** and fix any issues:
   ```bash
   bun run lint
   # Auto-fix issues with:
   bun run fix-lint
   ```

8. **Build the project** to ensure it compiles correctly:
   ```bash
   bun run build
   ```

9. **Commit your changes** following our commit message convention

10. **Push to your fork** and create a pull request

## Style Guidelines

We follow strict TypeScript and coding conventions. Please review our [Copilot Instructions](./.github/copilot-instructions.md) for detailed guidelines, including:

- TypeScript best practices
- Naming conventions
- Documentation standards
- Testing patterns
- Code organization

### Before Each Commit

- ✅ Run `bun run lint` and fix all errors and warnings
- ✅ Run relevant unit or integration tests
- ✅ Update documentation if public APIs or complex logic change

## Commit Messages

We use the Conventional Commits specification with emojis. Format your commits like this:

```
<type>(<emoji>): [summary up to 72 chars]

[Optional longer description]
```

**Types:**
- `feat 🚀` – New features
- `fix 🔧` – Bug fixes
- `perf ⚡` – Performance improvements
- `refactor 🧹` – Refactoring
- `build 📦` – Build tools / dependency changes
- `types 🌊` – Type definitions
- `chore 🦉` – Maintenance, non-code/test changes
- `docs 📖` – Documentation changes
- `test 🧪` – Test code updates
- `style 🎨` – Style/formatting only
- `ci 🤖` – CI/CD configuration

**Example:**
```
feat(🚀): add advanced repository filtering operators

Added $eq, $like, $between filtering operators to repository pattern
for advanced querying and filtering of database records.
```

---

Thank you for contributing! 🎉
