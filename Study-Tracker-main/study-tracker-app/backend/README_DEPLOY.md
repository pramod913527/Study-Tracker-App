# Deployment & Scalability

## Docker
- Build: `docker build -t study-tracker-backend .`
- Run: `docker run -p 3001:3001 study-tracker-backend`

## CI/CD
- See `.github/workflows/ci-cd.yml` for pipeline steps.
- Includes build, test, Docker image, and smoke test.

## DB Migration
- Use `scripts/db-migrate.sh` for migration steps.

## Blue/Green or Canary Deploy
- For blue/green or canary, deploy new container alongside old, switch traffic, and roll back if needed.
- Use health checks and `scripts/smoke-test.sh` for validation.

## Rollback
- To rollback, redeploy previous Docker image/tag.
