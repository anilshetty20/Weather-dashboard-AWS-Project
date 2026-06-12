<div align="center">

# ⬡ Weather Live
### Real-time Weather Dashboard on AWS

![AWS](https://img.shields.io/badge/AWS-Cloud-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Container-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-IaC-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI/CD-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

A full-stack weather dashboard built entirely on **AWS Free Tier** — from local development to production deployment with HTTPS, CI/CD, monitoring, and cost optimization.

[Live Demo](https://d3raltu0rxdu37.cloudfront.net/) · [Documentation](#documentation) · [Architecture](#architecture)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [CI/CD](#cicd)
- [Monitoring](#monitoring)
- [Cost Optimization](#cost-optimization)
- [Documentation](#documentation)
- [What Can Be Improved](#what-can-be-improved)

---

## Overview

Weather App is an AWS learning project that covers the full spectrum of cloud development — from writing React components and Node.js APIs to provisioning infrastructure with Terraform, containerizing with Docker, setting up CI/CD pipelines, and monitoring with CloudWatch.

Everything runs on **AWS Free Tier**.

---

## Features

- 🔍 **Search any city** — real-time weather from OpenWeatherMap API
- 🌡️ **Weather data** — temperature, humidity, wind speed, feels like, visibility
- 🕐 **Recent searches** — saved to DynamoDB, displayed as clickable tags
- 🔒 **Full HTTPS** — via CloudFront CDN (single URL for frontend + backend)
- 🚀 **Auto deploy** — push to GitHub triggers CI/CD pipeline
- 📊 **Monitoring** — CloudWatch alarms, logs, and dashboard
- 💰 **Cost optimized** — EC2 auto start/stop with EventBridge Scheduler

---

## Architecture

```
Browser
   │
   ▼
CloudFront (HTTPS: xxxx.cloudfront.net)
   │
   ├── /* ──────────────────────> S3 Bucket
   │                              (React app)
   │
   ├── /weather?city=X ─────────> EC2 :3000
   ├── /searches ───────────────> EC2 :3000  (Docker container)
   └── /health ─────────────────> EC2 :3000
                                       │
                              ┌────────┴────────┐
                              ▼                 ▼
                     OpenWeatherMap API      DynamoDB
                     (weather data)     (search history)
```

### AWS Services Used

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| **S3** | Host React frontend | 5GB, 20k GET/month |
| **CloudFront** | HTTPS CDN, routes frontend + backend | 1TB transfer/month |
| **EC2 t2.micro** | Run Node.js Docker container | 750 hrs/month |
| **ECR** | Store Docker images | 500MB/month |
| **DynamoDB** | Store search history | 25GB, 25 WCU/RCU |
| **IAM** | Roles and policies | Free |
| **EventBridge** | Cron scheduler for EC2 start/stop | Free |
| **Lambda** | Start/stop EC2, send notifications | 1M requests/month |
| **SNS** | Email notifications | 1M requests/month |
| **CloudWatch** | Metrics, alarms, logs, dashboard | Limited free tier |
| **Elastic IP** | Fixed IP that survives EC2 restart | Free when attached |

---

## Tech Stack

**Frontend**
- React 18 + Vite
- Inline styles (no CSS framework)
- Custom hooks for state management

**Backend**
- Node.js + Express
- AWS SDK v3 for DynamoDB
- Axios for OpenWeatherMap API
- Docker (multi-stage build)

**Infrastructure**
- Terraform (modular approach)
- Remote state in S3 + DynamoDB locking
- 6 Terraform modules

**CI/CD**
- GitHub Actions
- Two pipelines: frontend and backend
- Auto-triggered on push to `main`

---

## Project Structure

```
Weather-dashboard-AWS-Project/
│
├── frontend/                        # React + Vite app
│   ├── src/
│   │   ├── App.jsx                  # Root component
│   │   ├── index.css                # Global styles + CSS variables
│   │   ├── components/
│   │   │   ├── SearchBar.jsx        # Search input + button
│   │   │   ├── WeatherCard.jsx      # Weather data display
│   │   │   ├── RecentSearches.jsx   # Recent city tags
│   │   │   ├── ErrorMessage.jsx     # Error display
│   │   │   ├── Header.jsx           # Top navigation
│   │   │   └── BackgroundOrbs.jsx   # Animated background
│   │   ├── hooks/
│   │   │   └── useWeather.js        # All weather state + API calls
│   │   └── utils/
│   │       ├── api.js               # fetch helpers
│   │       └── weatherUtils.js      # Icons + condition tints
│   ├── index.html
│   ├── vite.config.js               # base: "./" for S3 compatibility
│   └── package.json
│
├── backend/                         # Node.js Express API
│   ├── server.js                    # Entry point + middleware
│   ├── routes.js                    # GET /health /weather /searches
│   ├── weatherService.js            # OpenWeatherMap API call
│   ├── searchesService.js           # DynamoDB read/write
│   ├── db.js                        # DynamoDB client (uses IAM role)
│   ├── Dockerfile                   # Multi-stage, non-root user
│   └── .env.example                 # Environment variable template
│
├── terraform/                       # Infrastructure as Code
│   ├── main.tf                      # Calls all modules
│   ├── provider.tf                  # AWS provider + S3 backend
│   ├── variables.tf                 # All input variables
│   ├── outputs.tf                   # EC2 IP, CloudFront URL, etc.
│   ├── terraform.tfvars.example     # Variable values template
│   └── modules/
│       ├── dynamodb/                # WeatherSearches table
│       ├── iam/                     # EC2 role + policies
│       ├── ecr/                     # Docker image registry
│       ├── ec2/                     # Ubuntu 24.04 + Elastic IP
│       ├── s3/                      # Static website bucket
│       └── cloudfront/              # HTTPS CDN (2 origins)
│
├── terraform-bootstrap/             # Remote state setup (run once)
│   └── main.tf                      # S3 bucket + DynamoDB lock table
│
└── .github/
    └── workflows/
        ├── frontend.yml             # Build + S3 deploy + CF invalidate
        └── backend.yml              # Docker build + ECR + EC2 deploy
```

---

## Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 18 |
| Docker | Latest |
| Terraform | >= 1.6 |
| AWS CLI | v2 |
| Git | Latest |

### Local Development

**1. Clone the repo**
```bash
git clone https://github.com/yourusername/Weather-dashboard-AWS-Project.git
cd Weather-dashboard-AWS-Project
```

**2. Get OpenWeatherMap API key**

Sign up free at [openweathermap.org](https://openweathermap.org/api) — keys activate in ~10 minutes.

**3. Run the backend**
```bash
cd backend
npm install
cp .env.example .env
# Fill in OWM_API_KEY, AWS_REGION, DYNAMO_TABLE, FRONTEND_URL, PORT
npm run dev
# Runs on http://localhost:3000
```

**4. Run the frontend**
```bash
cd frontend
npm install
cp .env.example .env.local
# Set VITE_API_BASE=http://localhost:3000
npm run dev
# Runs on http://localhost:5173
```

**5. Test the API**
```bash
curl http://localhost:3000/health
curl "http://localhost:3000/weather?city=Bengaluru"
curl http://localhost:3000/searches
```

---

## Deployment

### Step 1 — Bootstrap Terraform Remote State (run once)

```bash
cd terraform-bootstrap
terraform init
terraform apply
# Note the output: state_bucket_name and lock_table_name
# Copy these into terraform/provider.tf backend block
```

### Step 2 — Provision AWS Infrastructure

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Fill in: key_pair_name, bucket_name

terraform init
terraform plan
terraform apply
# Apply modules one at a time for learning:
# dynamodb -> iam -> ecr -> ec2 -> s3 -> cloudfront
```

### Step 3 — Deploy Backend

```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin YOUR_ECR_URL

# Build and push
cd backend
docker build -t weather-backend .
docker tag weather-backend:latest YOUR_ECR_URL:latest
docker push YOUR_ECR_URL:latest

# SSH into EC2 and run container
ssh -i key.pem ubuntu@YOUR_ELASTIC_IP
docker pull YOUR_ECR_URL:latest
docker run -d \
  --name weather \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file ~/backend.env \
  YOUR_ECR_URL:latest
```

### Step 4 — Deploy Frontend

```bash
cd frontend
echo "VITE_API_BASE=https://YOUR_CLOUDFRONT_URL" > .env.local
npm run build
aws s3 sync dist/ s3://YOUR_BUCKET/ --delete
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

---

## CI/CD

Two GitHub Actions pipelines handle automated deployment.

### Frontend Pipeline
Triggers on push to `main` when `frontend/**` files change:
```
npm install → npm run build → aws s3 sync → CloudFront invalidation
```

### Backend Pipeline
Triggers on push to `main` when `backend/**` files change:
```
docker build → push to ECR → SSH into EC2 → docker pull → restart container
```

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `AWS_REGION` | AWS region (e.g. us-east-1) |
| `ECR_REPO_URL` | Full ECR repository URL |
| `EC2_HOST` | Elastic IP address |
| `EC2_SSH_KEY` | Contents of .pem file |
| `S3_BUCKET` | S3 bucket name |
| `VITE_API_BASE` | https://xxxx.cloudfront.net |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID |
| `CLOUDFRONT_URL` | https://xxxx.cloudfront.net |

---

## Monitoring

CloudWatch monitoring set up manually in AWS Console:

| Component | Details |
|-----------|---------|
| **Alarm: High CPU** | CPUUtilization > 80% → SNS email |
| **Alarm: Status Check** | StatusCheckFailed >= 1 → SNS email |
| **Alarm: High Memory** | mem_used_percent > 80% → SNS email |
| **Alarm: High Disk** | disk_used_percent > 80% → SNS email |
| **CloudWatch Logs** | Docker container logs → `weather-backend` log group |
| **CloudWatch Agent** | Collects memory + disk metrics from EC2 |
| **Dashboard** | CPU, memory, disk, alarm status, logs in one view |
| **SNS Topic** | `weather-alerts` → email subscription |

---

## Cost Optimization

### EC2 Scheduler (Dev/UAT environments)

EventBridge Scheduler automatically stops EC2 at night and starts it in the morning.

```
09:00 IST → EC2 starts → email notification
21:00 IST → EC2 stops  → email notification
```

> **Note:** The scheduler is for Dev/UAT environments only. Production servers should run 24/7.

### Free Tier Cost Estimate

| Service | Free Tier Limit | Expected Usage | Cost |
|---------|----------------|----------------|------|
| EC2 t2.micro | 750 hrs/month | ~360 hrs (with scheduler) | $0 |
| DynamoDB | 25GB + 25 WCU/RCU | Minimal | $0 |
| S3 | 5GB + 20k GET | Minimal | $0 |
| CloudFront | 1TB transfer | Minimal | $0 |
| Lambda | 1M requests | Minimal | $0 |
| **Total** | | | **$0/month** |

---

## Documentation

Full project documentation is available in 4 PDF files:

| Document | Contents |
|----------|----------|
| `doc1_overview.pdf` | Architecture, AWS services, project status, repo structure |
| `doc2_deployment.pdf` | Step-by-step deployment guide, CI/CD setup |
| `doc3_errors_improvements.pdf` | Errors encountered + fixes, debug commands, improvements |
| `doc4_implementation.pdf` | Complete implementation story — every component explained |

---

## What Can Be Improved

| Priority | Improvement | Effort |
|----------|-------------|--------|
| 🔴 High | Enable DynamoDB Point-in-Time Recovery (PITR) | 2 min |
| 🔴 High | Restrict EC2 port 3000 to CloudFront IPs only | 15 min |
| 🔴 High | Use AWS Secrets Manager for OWM API key | 30 min |
| 🟡 Medium | CloudWatch Synthetics canary (uptime monitoring) | 20 min |
| 🟡 Medium | Add staging environment | 2 hrs |
| 🟡 Medium | WAF on CloudFront (DDoS protection) | 30 min |
| 🟢 Low | Auto Scaling Group + ALB (high availability) | 3 hrs |
| 🟢 Low | VPC + private subnet for EC2 | 2 hrs |
| 🟢 Low | Custom domain + Route53 | 1 hr + cost |

---

## Key Learnings

This project covers the following AWS concepts:

- **Compute** — EC2, Lambda, Docker, ECR
- **Storage** — S3, DynamoDB
- **Networking** — CloudFront, Elastic IP, Security Groups
- **Security** — IAM roles, no hardcoded credentials, OAC
- **IaC** — Terraform modular approach, remote state, bootstrap pattern
- **CI/CD** — GitHub Actions, path-based triggers, secrets management
- **Monitoring** — CloudWatch metrics, alarms, logs, custom agent
- **Cost optimization** — Scheduler, Free Tier awareness

---

## Environment Variables

### Frontend (`.env.local`)

```env
VITE_API_BASE=http://localhost:3000
```

### Backend (`.env`)

```env
OWM_API_KEY=your_openweathermap_api_key
AWS_REGION=us-east-1
DYNAMO_TABLE=WeatherSearches
FRONTEND_URL=http://localhost:5173
PORT=3000
```

---

<div align="center">

Built for AWS learning · React + Node.js + Docker + Terraform + GitHub Actions

</div>