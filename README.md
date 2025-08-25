# Prepare your package :

## 1. Add in your repository environment variables and deploy keys:

### 1.1 Prerequisites

#### 1.1.1 SSH
Generated SSH key with `ssh-keygen -t ed25519 -C "your_mail@domain.ext" -f your_package_name`

- Get the public key with:
	```bash
	cat your_package_name.pub
	```
	You will get an output like this:
	```
	ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIC ...
	```

- Get the private key with:
	```bash
	cat your_package_name
	```
	You will get an output like this:
	```
	-----BEGIN OPENSSH PRIVATE KEY-----
	...
	-----END OPENSSH PRIVATE KEY-----
	```

#### 1.1.2 GPG **(You can reuse your existing GPG key if you have one for you account)**

- Generate a GPG key with `gpg --full-generate-key` and follow the prompts to create a key suitable for signing commits and tags **whithout passphrase**.

- Get the public key with:
	```bash
		gpg --armor --export your_email@domain.ext
	```
	
	You will get an output like this:
	```
	-----BEGIN PGP PUBLIC KEY BLOCK-----
	...
	-----END PGP PUBLIC KEY BLOCK-----
	```
	And then copy the output and put in yourh github account settings -> SSH and GPG keys -> New GPG key.

- Get the private key (for github-action) with:
	```bash
	gpg --armor --export-secret-keys your_email@domain.ext
	```
	You will get an output like this:
	```
	-----BEGIN PGP PRIVATE KEY BLOCK-----
	...
	-----END PGP PRIVATE KEY BLOCK-----
	```

### 1.2 Deploy keys
Create a deploy key in your repository example `SSH_KEY` and put the public key generated in step [1.1.1](#111-ssh).

### 1.3 Environment variables

All environment variables are used in the workflow!

Add the following environment variables to your repository settings:

- `KEY_SSH`: The private SSH key for accessing the repository. (Generated in step [1.1.1](#111-ssh))
- `KEY_GPG`: The GPG private key for signing commits and tags for git (Generated in step [1.1.2](#112-gpg))
- `GIT_EMAIL`: Your email address associated with the GPG key.
- `NPM_TOKEN`: Your npm token for publishing packages.

## 2 Configure your repository
- Add Ruleset for `main` and `develop` branches.
- Add tag `need-triage` for issues.
- Add your settings..

## 3 Configure your package.json

Run the interactive setup script to configure your package:

```bash
./npm-template-setup
```

This script will prompt you for:
- **Package name**: e.g., `@your-scope/your-package-name` or `your-package-name`
- **Description**: A brief description of your package
- **Author name**: Your name
- **License holder**: Usually the same as author name
- **Contact email**: Your contact email (updates README, CODE_OF_CONDUCT, etc.)
- **Keywords**: Comma-separated keywords to help others find your package

The script automatically updates:
- `package.json` with your package information
- `LICENSE` file with current year and license holder
- `CODE_OF_CONDUCT.md` with your contact email
- `CONTRIBUTING.md` with your contact email
- `README.md` template placeholders
- GitHub issue templates

After running the script, manually configure the `exports` field in `package.json` to define your package entry points:

```json
"exports": {
	".": "./dist/index.js",
	"./types": "./dist/types/index.js"
}
```

## 4 Configure your builder
Just change `entrypoints` in `builder.ts` to your entry point file. (e.g., `source/index.ts`).

## 5 Update README.md
Update the README.md file with relevant information about your package.

---
---
<!-- You Can Remove all content above this line -->

# 📦 Package Template

## 📌 Table of Contents

- [📦 Package Template](#-package-template)
	- [📌 Table of Contents](#-table-of-contents)
	- [📝 Description](#-description)
	- [🔧 Installation](#-installation)
	- [⚙️ Usage](#-usage)
	- [📚 API Reference](#-api-reference)
	- [⚖️ License](#-license)
	- [📧 Contact](#-contact)

## 📝 Description

> Template for creating new npm packages with Bun.

**Package Template** provides a starting point for building and publishing npm packages. Customize this section with a description of your package's purpose and features.

## 🔧 Installation

```bash
bun add @your-scope/your-package-name
```

## ⚙️ Usage

```ts
import { YourExportedFunction } from '@your-scope/your-package-name'

// Example usage
YourExportedFunction()
```

## 📚 API Reference

You can find the complete API reference documentation for `YourPackageName` at:

- [Reference Documentation](https://your-package-docs.com)

## ⚖️ License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

## 📧 Contact

- Mail: [your-email@domain.com](mailto:your-email@domain.com)
- Github: [Project link](https://github.com/your-username/your-repo)

