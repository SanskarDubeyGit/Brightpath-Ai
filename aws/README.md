# AWS Deployment Guide

## Infrastructure Overview

| Component | Service | Configuration |
|-----------|---------|---------------|
| Frontend | Vercel | Next.js, edge network, automatic SSL |
| Backend | AWS ECS Fargate | 2 tasks, 512 CPU / 1024 MB each |
| Database | AWS RDS PostgreSQL 16 | db.t3.micro, 20GB storage, encrypted |
| Cache | Redis (ElastiCache or external) | Session store, rate limiting |
| Load Balancer | AWS ALB | Internet-facing, health checks |
| Container Registry | Amazon ECR | Docker image storage |
| CI/CD | GitHub Actions | Build, test, deploy on tag |

## Prerequisites

1. AWS CLI configured with appropriate permissions
2. Docker installed locally
3. Vercel CLI installed (`npm i -g vercel`)
4. GitHub Secrets configured:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION` (e.g., `ap-south-1` for India)
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

## Deployment Flow

```
git tag v1.0.0
git push origin v1.0.0
```

This triggers the `deploy.yml` workflow which:

1. **Frontend**: Builds Next.js and deploys to Vercel production
2. **Backend**: Builds Docker image, pushes to ECR, updates ECS service
3. **Notification**: Reports deployment status

## Manual Deployment

### Frontend (Vercel)

```bash
cd apps/web
vercel login
vercel --prod
```

### Backend (AWS ECS)

```bash
# Build and push to ECR
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

cd apps/api
./mvnw package -DskipTests
docker build -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/brightpath-api:latest .
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/brightpath-api:latest

# Force new deployment
aws ecs update-service \
  --cluster brightpath-cluster \
  --service brightpath-api-service \
  --force-new-deployment
```

### Infrastructure (CloudFormation)

```bash
aws cloudformation create-stack \
  --stack-name brightpath-infrastructure \
  --template-body file://aws/infrastructure.yaml \
  --parameters ParameterKey=DBUsername,ParameterValue=brightpathadmin \
               ParameterKey=DBPassword,ParameterValue=your-secure-password \
               ParameterKey=JWTSecretValue,ParameterValue=your-jwt-secret \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM
```

## Region Selection

| Target Market | AWS Region | Vercel Region |
|---------------|------------|---------------|
| India (Launch) | ap-south-1 (Mumbai) | bom1 |
| USA | us-east-1 (N. Virginia) | iad1 |
| Europe | eu-west-1 (Ireland) | lhr1 |

## Environment Variables

### Backend (AWS ECS)

| Variable | Source | Required |
|----------|--------|----------|
| SPRING_DATASOURCE_URL | RDS endpoint | Yes |
| SPRING_DATASOURCE_USERNAME | RDS master user | Yes |
| SPRING_DATASOURCE_PASSWORD | Secrets Manager | Yes |
| SPRING_DATA_REDIS_HOST | Redis endpoint | Yes |
| JWT_SECRET | Secrets Manager | Yes |
| SERVER_PORT | 8080 | No |

### Frontend (Vercel)

| Variable | Production Value |
|----------|-----------------|
| NEXT_PUBLIC_API_URL | https://api.brightpath.example.com/api/v1 |
| NEXT_PUBLIC_APP_URL | https://brightpath.example.com |

## Monitoring

- **Logs**: CloudWatch Logs (`/ecs/brightpath-api`)
- **Metrics**: CloudWatch (CPU, memory, request count)
- **Health**: ALB target group health checks (`/actuator/health`)
- **Errors**: Sentry (configured in Phase 9)

## Rollback

```bash
# ECS rollback to previous version
aws ecs update-service \
  --cluster brightpath-cluster \
  --service brightpath-api-service \
  --deployment-configuration deploymentCircuitBreaker={enable=true,rollback=true}

# Vercel rollback
vercel rollback --prod
```
