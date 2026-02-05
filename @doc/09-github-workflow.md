# GITHUB WORKFLOW & CI/CD

## 1. Repository Structure

```
.github/
├── workflows/
│   ├── ci.yml              # Continuous Integration
│   ├── deploy-staging.yml  # Staging deployment
│   ├── deploy-prod.yml     # Production deployment
│   └── docker-build.yml    # Docker image build
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   └── feature_request.md
├── PULL_REQUEST_TEMPLATE.md
└── CODEOWNERS
```

---

## 2. Branch Protection Rules

### 2.1 Main Branch
```yaml
# Settings > Branches > Branch protection rules
Branch: main
Rules:
  - Require pull request reviews: 1 approval
  - Require status checks: ci, test
  - Require branches to be up to date
  - Require signed commits: optional
  - Include administrators: true
```

### 2.2 Staging Branch
```yaml
Branch: staging
Rules:
  - Require pull request reviews: 1 approval
  - Require status checks: ci
```

---

## 3. GitHub Actions Workflows

### 3.1 CI Workflow (Lint, Test, Build)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, staging, develop]
  pull_request:
    branches: [main, staging, develop]

env:
  NODE_VERSION: '18'

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Run TypeScript check
        run: npm run type-check

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/lcov.info

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_APP_URL: https://app.thecliffresort.com.vn
          NEXT_PUBLIC_GA_ID: ${{ secrets.GA_ID }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: .next
          retention-days: 7

  e2e-test:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Download build
        uses: actions/download-artifact@v4
        with:
          name: build
          path: .next
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report
          retention-days: 7
```

### 3.2 Deploy to Staging (Vercel)

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging

on:
  push:
    branches: [staging]

jobs:
  deploy:
    name: Deploy to Vercel Staging
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}
          alias-domains: thecliff-staging.vercel.app
      
      - name: Notify on Slack
        uses: slackapi/slack-github-action@v1
        with:
          channel-id: ${{ secrets.SLACK_CHANNEL }}
          slack-message: "🚀 Deployed to staging: https://thecliff-staging.vercel.app"
        env:
          SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
```

### 3.3 Deploy to Production

```yaml
# .github/workflows/deploy-prod.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        default: 'production'

jobs:
  deploy-vercel:
    name: Deploy to Vercel Production
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}

  deploy-docker:
    name: Deploy to Docker/Arcane
    runs-on: ubuntu-latest
    environment: production
    needs: [deploy-vercel]
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:latest
            ghcr.io/${{ github.repository }}:${{ github.sha }}
          build-args: |
            NEXT_PUBLIC_APP_URL=https://app.thecliffresort.com.vn
            NEXT_PUBLIC_GA_ID=${{ secrets.GA_ID }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
      
      - name: Deploy to Arcane
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.ARCANE_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d '{"image": "ghcr.io/${{ github.repository }}:${{ github.sha }}"}' \
            ${{ secrets.ARCANE_WEBHOOK_URL }}
      
      - name: Notify on Slack
        uses: slackapi/slack-github-action@v1
        with:
          channel-id: ${{ secrets.SLACK_CHANNEL }}
          slack-message: "✅ Production deployment complete: https://app.thecliffresort.com.vn"
        env:
          SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
```

### 3.4 Docker Build Only

```yaml
# .github/workflows/docker-build.yml
name: Docker Build

on:
  workflow_dispatch:
  push:
    tags:
      - 'v*'

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4
      
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          build-args: |
            NEXT_PUBLIC_APP_URL=https://app.thecliffresort.com.vn
            NEXT_PUBLIC_GA_ID=${{ secrets.GA_ID }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

## 4. GitHub Secrets Configuration

### Required Secrets

| Secret | Description | Used In |
|--------|-------------|---------|
| `VERCEL_TOKEN` | Vercel API token | Deploy workflows |
| `VERCEL_ORG_ID` | Vercel organization ID | Deploy workflows |
| `VERCEL_PROJECT_ID` | Vercel project ID | Deploy workflows |
| `GA_ID` | Google Analytics ID | Build workflows |
| `ARCANE_TOKEN` | Arcane API token | Production deploy |
| `ARCANE_WEBHOOK_URL` | Arcane deploy webhook | Production deploy |
| `SLACK_BOT_TOKEN` | Slack notification token | All workflows |
| `SLACK_CHANNEL` | Slack channel ID | All workflows |
| `CODECOV_TOKEN` | Code coverage token | CI workflow |

### How to Add Secrets

1. Go to repository **Settings**
2. Navigate to **Secrets and variables > Actions**
3. Click **New repository secret**
4. Add name and value

---

## 5. Issue & PR Templates

### 5.1 Bug Report Template

```markdown
<!-- .github/ISSUE_TEMPLATE/bug_report.md -->
---
name: Bug Report
about: Report a bug to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

## Bug Description
A clear description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Screenshots
If applicable, add screenshots.

## Environment
- Device: [e.g. iPhone 14, Samsung S21]
- OS: [e.g. iOS 17, Android 13]
- Browser: [e.g. Safari, Chrome]
- Version: [e.g. 1.0.0]

## Additional Context
Any other context about the problem.
```

### 5.2 Feature Request Template

```markdown
<!-- .github/ISSUE_TEMPLATE/feature_request.md -->
---
name: Feature Request
about: Suggest a new feature
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## Feature Description
A clear description of the feature.

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other solutions you've considered.

## Additional Context
Any other context or screenshots.
```

### 5.3 Pull Request Template

```markdown
<!-- .github/PULL_REQUEST_TEMPLATE.md -->
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #(issue_number)

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added where needed
- [ ] Documentation updated
- [ ] No new warnings/errors

## Screenshots (if UI changes)
Before | After
------ | -----
[screenshot] | [screenshot]
```

---

## 6. CODEOWNERS

```
# .github/CODEOWNERS
# Default owners for everything
* @thecliffresort/developers

# Specific paths
/src/components/ @thecliffresort/frontend
/docker* @thecliffresort/devops
/.github/ @thecliffresort/devops
```

---

## 7. Release Process

### 7.1 Semantic Versioning
```
MAJOR.MINOR.PATCH
1.0.0 - Initial release
1.1.0 - New features
1.1.1 - Bug fixes
2.0.0 - Breaking changes
```

### 7.2 Release Workflow

```bash
# 1. Create release branch
git checkout develop
git pull origin develop
git checkout -b release/v1.1.0

# 2. Update version in package.json
npm version 1.1.0 --no-git-tag-version

# 3. Update CHANGELOG.md
# 4. Commit and push
git add .
git commit -m "chore: release v1.1.0"
git push origin release/v1.1.0

# 5. Create PR to main
# 6. After merge, create tag
git checkout main
git pull origin main
git tag v1.1.0
git push origin v1.1.0
```

### 7.3 Automated Release with GitHub Actions

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          generate_release_notes: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

**Document Version**: 1.0  
**Created**: 2026-02-04  
**Author**: Development Team
