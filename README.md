# Frontend CI/CD Demo

A small React + TypeScript dashboard showing how to build and optimize frontend CI/CD with GitHub Actions, and manage configuration with GitHub Environments.

## Features
- React 19, TypeScript, Vite
- ESLint, TypeScript checking, Vitest + Testing Library
- CI: parallel lint, test/typecheck, build jobs; npm dependency cache; cancellation of obsolete CI runs
- CD: validate -> build once -> upload artifact -> deploy artifact to GitHub Pages
- Environment variables scoped to `production`, GitHub Pages deployment via short-lived OIDC token (no personal access token required)

## Run locally
Requires Node.js 22+ and npm. **Before your first push, run `npm install` and commit the generated `package-lock.json`**. The GitHub Actions workflows use `npm ci` and npm caching, which require that lockfile.

```bash
npm install # first run generates package-lock.json; commit it to GitHub
cp .env.example .env
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

## Publish to GitHub
1. Create a **public** GitHub repository called `frontend-cicd-demo` (or another name).
2. In this folder run:

```bash
git init
git branch -M main
git add .
git commit -m "feat: initial frontend CI/CD demo"
git remote add origin https://github.com/YOUR_USERNAME/frontend-cicd-demo.git
git push -u origin main
```

3. Go to **Settings -> Pages -> Build and deployment -> Source** and select **GitHub Actions**.
4. Go to **Settings -> Environments -> New environment** and create `production`.
5. Under `production` -> **Environment variables**, add:
   - `VITE_APP_ENV` = `production`
   - `VITE_API_URL` = `https://example.com/api` (placeholder only; no API is called)
6. Optionally create a `staging` environment with `VITE_APP_ENV=staging` and a different public API URL. The demo deploys only production; staging is a configuration example, not a second live deployment.
7. Push another commit or run **Actions -> Deploy GitHub Pages -> Run workflow**.
8. Wait for the deploy job. The URL will be `https://YOUR_USERNAME.github.io/REPOSITORY_NAME/`.

> If you rename the repo, the workflow automatically sets the correct Vite base path for GitHub Pages project sites.

## Secrets vs variables
- **Environment variables**: `VITE_APP_ENV` and `VITE_API_URL` are public build-time configuration.
- **Secrets**: for a real private deployment credential, add it under `Settings -> Environments -> production -> Environment secrets` and reference it in a deployment step with `${{ secrets.MY_DEPLOY_TOKEN }}`. Never prefix private secrets with `VITE_` or embed them in a frontend bundle. This GitHub Pages workflow needs **no custom secret**: GitHub provides an ephemeral OIDC token for deployment.
- The workflow uses `${{ github.sha }}` as public version metadata.
- Environment variables are read during the `build` job; changing them requires a new build/deploy.
- Avoid printing secret values in logs, and don't use secrets for untrusted pull request code.

## Verify CI/CD
1. Create a branch and open a PR into `main`.
2. Check the `CI` workflow: `lint`, `test`, and `build` jobs run independently.
3. Intentionally break a test on a branch and verify the PR check fails. Restore it.
4. Merge the PR. `Deploy GitHub Pages` validates the source, builds, and deploys the built artifact.
5. Open the published site and confirm the environment is `production` and the version matches the latest commit SHA.
6. Change the `production` environment variable and rerun the deploy workflow to confirm the change appears.

## Optional branch protection
In **Settings -> Rules -> Rulesets**, create a branch ruleset targeting `main`, require PRs and the CI checks. Availability of enforcement depends on repository visibility and GitHub plan.

## CI optimization details
- `setup-node` uses `cache: npm`, keyed by the lockfile.
- Independent checks run in parallel for quicker feedback.
- `concurrency` cancels superseded CI runs on the same branch.
- CD builds the site **once** and passes `dist/` as an artifact to the deploy job (no duplicate build in deploy).
- Jobs use least-privilege permissions; only the deploy job receives `pages: write` and `id-token: write`.

## Security note
GitHub Actions third-party actions are version-tagged for readability in this demo. For stricter supply-chain security, pin them to audited full commit SHAs and keep them updated using Dependabot.

## Learning goals
1. Build and optimize a frontend CI/CD pipeline using GitHub Actions.
2. Implement secrets and environment variables management in a frontend CI/CD pipeline using GitHub Actions.
