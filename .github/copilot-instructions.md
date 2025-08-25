---
applyTo: '**'
---
## Development Workflow
- Build: bun run build
- Test: bun run test, bun run test:unit, bun run test:integration
- Lint: bun run lint (auto-fix: bun run fix-lint)
- Docs: bun run docs

## Code Standards and Guidelines

 ##Required Before Each Commit
- Run bun run lint and fix all errors and warnings
- Run relevant unit or integration tests
- Update documentation if public APIs or complex logic change

## TypeScript and Project Conventions
1. Use underscore prefix for private or non-exported elements (e.g., _privateMethod)
2. Always specify visibility modifiers (private, protected, public), plus readonly, override, etc. when applicable
3. Naming conventions: camelCase for variables/functions/methods; PascalCase for classes/interfaces/types; SCREAMING_CASE for constants
4. Explicit typing: Always specify types for variables, parameters, and return values; never use any; prefer unknown if type cannot be determined; prefer interface over type alias for extendable objects
5. Documentation: Use TSDoc style; explain purpose, parameters, return values, and behavior; only document code when requested; for @throws, use format "@throws ({@link Type}) – description"; for object/interface properties, write comment above each property instead of @param
6. Control structures: Omit curly braces for single-statement bodies
7. Path Aliases: Use #/ for internal imports; do not import barrel files except as entry points
8. Export Pattern: Each directory has index.ts re-exporting public items; types exported in types/index.ts
9. Testing: Write unit tests for new features; tests mirror source/ structure; use Bun's test runner; integration tests for DB/external systems; prefer table-driven tests
10. Architecture: Maintain modular structure; use dependency injection when appropriate; document public APIs and complex logic
11. Function style: Class methods use standard method syntax; helpers/callbacks/HOFs prefer arrow functions unless function syntax is required

## Contribution Principles
1. Follow TypeScript best practices and idiomatic patterns
2. Maintain existing code structure and modular organization
3. Keep developer experience in mind
4. Keep pull requests focused and well-documented (with TsDoc if asked)
5. Commit different types of changes separately; avoid mixing tests and features in one commit

## Commit Message Convention (Conventional Commits + Emoji)
Format: <type>(<emoji>): [summary up to 72 chars]
(blank line, then context or description)

Types:
feat 🚀 – New features
fix 🔧 – Bug fixes
perf ⚡ – Performance improvements
refactor 🧹 – Refactoring
build 📦 – Build tools / dependency changes
types 🌊 – Type definitions
chore 🦉 – Maintenance, non-code/test changes
examples 🏀 – Example updates
docs 📖 – Documentation changes
test 🧪 – Test code updates
style 🎨 – Style/formatting only
ci 🤖 – CI/CD configuration

Example:
feat(🚀): add advanced repository filtering operators

Features:
- Added $eq, $like, $between filtering operators to repository

Description:
Allows advanced querying and filtering of database records using the repository pattern.
