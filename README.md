# Frontend CI/CD Demo

A React + TypeScript application demonstrating how to build a CI/CD pipeline using GitHub Actions, automate quality checks, manage environment variables and secrets, and deploy to GitHub Pages.

**Live Demo:** https://tarasseman.github.io/frontend-cicd-demo/

## Tech Stack

- React
- TypeScript
- Vite
- Yarn 4
- ESLint
- Vitest
- GitHub Actions
- GitHub Pages

## CI/CD Pipeline

The project uses two GitHub Actions workflows:

### 1. Continuous Integration (`ci.yml`)

The CI workflow validates code changes using automated checks:

- Install dependencies with Yarn
- Run ESLint
- Run TypeScript type checking
- Run unit tests
- Verify the production build

The goal is to catch problems before changes are merged into the main branch.

### 2. Continuous Deployment (`deploy.yml`)

The deployment workflow runs when changes are pushed or merged into `main`. It can also be triggered manually.

**Deployment process:**

1. Checkout repository
2. Set up Node.js and Yarn
3. Install dependencies
4. Run linting, type checking, and tests
5. Validate the configured GitHub Secret
6. Build the application with production environment variables
7. Upload the build artifacts
8. Deploy to GitHub Pages

**Pipeline overview:**

```text
Feature Branch
      |
      v
Pull Request
      |
      v
GitHub Actions CI
      |
      +-- Lint
      +-- Typecheck
      +-- Unit Tests
      |
      v
Merge into main
      |
      v
GitHub Actions Deploy
      |
      +-- Validate
      +-- Verify Secret
      +-- Build
      +-- Upload Artifacts
      |
      v
GitHub Pages
```

## Environment Variables

Production configuration is managed through GitHub Environments.

**Environment:** `production`

| Variable | Description |
|---|---|
| `VITE_APP_ENV` | Application environment |
| `VITE_API_URL` | Public API endpoint configuration |
| `VITE_APP_VERSION` | Git commit SHA provided during deployment |
| `GITHUB_PAGES_BASE` | Base path used for GitHub Pages |

The deployment workflow injects these values during the Vite build:

```yaml
- name: Build for GitHub Pages
  run: yarn build
  env:
    GITHUB_PAGES_BASE: /${{ github.event.repository.name }}/
    VITE_APP_ENV: ${{ vars.VITE_APP_ENV }}
    VITE_API_URL: ${{ vars.VITE_API_URL }}
    VITE_APP_VERSION: ${{ github.sha }}
```

The React application accesses public configuration through `import.meta.env`.

```ts
const environment = import.meta.env.VITE_APP_ENV;
const apiUrl = import.meta.env.VITE_API_URL;
const version = import.meta.env.VITE_APP_VERSION;
```

Vite injects these values at build time. Updating an environment variable requires rebuilding and redeploying the application.

**Security:** Variables prefixed with `VITE_` can be included in the browser JavaScript bundle and must never contain sensitive information.

## GitHub Secrets

The project uses a GitHub Environment secret:

`DEPLOY_VERIFICATION_TOKEN`

This secret demonstrates how sensitive values can be made available securely to GitHub Actions without hardcoding them in the repository.

```yaml
- name: Verify deployment secret
  env:
    DEPLOY_VERIFICATION_TOKEN: ${{ secrets.DEPLOY_VERIFICATION_TOKEN }}
  run: |
    if [ -z "$DEPLOY_VERIFICATION_TOKEN" ]; then
      echo "::error::Missing deployment secret"
      exit 1
    fi
    echo "Deployment secret is configured successfully"
```

The secret is only used during the workflow and is not exposed to the frontend application.

This is an educational validation step. GitHub Pages deployment itself uses GitHub Actions permissions and OIDC authentication, not this custom token.

## Deployment Version Tracking

Each production build receives the Git commit SHA through `VITE_APP_VERSION`.

This makes it possible to identify which commit produced the currently deployed application.

For example:

```text
Environment: production
App Version: 65338844c176
API Endpoint: https://example.com/api
```

The API endpoint above is a demonstration value, not a functional backend.

## Run Locally

### Prerequisites

- Node.js 24
- Corepack
- Yarn 4

### Installation

```bash
git clone https://github.com/TarasSeman/frontend-cicd-demo.git
cd frontend-cicd-demo

corepack enable
yarn install
```

### Start Development Server

```bash
yarn dev
```

### Run Quality Checks

```bash
yarn lint
yarn typecheck
yarn test
yarn build
```

## GitHub Pages Deployment

The application is automatically deployed when changes are merged into `main`.

Deployment URL:

https://tarasseman.github.io/frontend-cicd-demo/

GitHub Pages is configured to use **GitHub Actions** as the deployment source.

## Project Goals

This project was created to gain practical experience with:

- Configuring CI/CD pipelines using GitHub Actions
- Automating frontend code quality checks
- Building and deploying a React application
- Managing GitHub Environment variables
- Handling secrets securely in CI workflows
- Tracking deployed application versions using Git commit SHAs
- Working with build artifacts and GitHub Pages

## Author

[Taras Seman](https://github.com/TarasSeman)