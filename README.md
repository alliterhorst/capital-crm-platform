# Capital CRM - Nx Monorepo

<p align="center">
  <img src="https://img.shields.io/badge/Nx-Monorepo-blueviolet" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-informational" />
  <img src="https://img.shields.io/badge/NestJS-API-red" />
  <img src="https://img.shields.io/badge/React-Vite-blue" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED" />
  <img src="https://img.shields.io/badge/CI-CD-success" />
</p>

---

## 📌 Table of Contents

- [Capital CRM - Nx Monorepo](#capital-crm---nx-monorepo)
  - [📌 Table of Contents](#-table-of-contents)
  - [🧭 Executive Summary](#-executive-summary)
    - [Key Objectives](#key-objectives)
  - [☁️ Cloud-Native Architecture](#️-cloud-native-architecture)
  - [🧰 Technology Stack](#-technology-stack)
  - [🧩 Development Workflow](#-development-workflow)
    - [Requirements](#requirements)
    - [Quick Start](#quick-start)
    - [Default Services](#default-services)
  - [🐳 Docker Orchestration](#-docker-orchestration)
  - [🧩 Nx Targets](#-nx-targets)
  - [🔍 Observability](#-observability)
  - [⚙️ CI/CD](#️-cicd)
  - [📁 Project Structure](#-project-structure)

---

## 🧭 Executive Summary

Capital CRM is a high-performance platform built to support enterprise client intelligence, valuation tracking, and secure audit history. This project demonstrates a production-ready application implemented using an **Nx Monorepo**, enabling consistent, scalable, and automated full‑stack development.

### Key Objectives

- Unified frontend and backend dependency graph with Nx
- Strict linting and formatting rules enforced on commit and CI
- Consistent containerized execution with Docker Compose
- Structured metrics, logs, and health endpoints
- Segmented CI/CD pipelines based on changed scopes

---

## ☁️ Cloud-Native Architecture

```mermaid
graph TD
    %% Estilos
    classDef future stroke-dasharray: 5 5, fill:#f9f9f9, stroke:#999;
    classDef security fill:#ffe6cc, stroke:#d79b00;
    classDef ci fill:#e1f5fe, stroke:#01579b;
    classDef aws fill:#FF9900, stroke:#232F3E, color:white;

    subgraph User_Space [Public Internet]
        User((User / Browser))
    end

    subgraph CI_CD_Pipeline [CI/CD & Deploy Flow]
        Pipeline[Build Pipeline]:::ci
    end

    subgraph AWS_Cloud [AWS Cloud Environment]

        %% Front-End Layer
        subgraph Frontend_Architecture [Front-End Layer]
            WAF_CF[AWS WAF]:::security
            CF(CloudFront CDN):::aws
            S3(S3 Bucket <br/> Static Hosting):::aws
        end

        %% Back-End VPC
        subgraph VPC [VPC]

            subgraph Public_Subnet [Public Subnet]
                WAF_ALB[AWS WAF]:::security
                ALB(Application Load Balancer):::aws
            end

            subgraph Private_Subnet_Compute [Private Subnet - Compute]
                Ingress[K8s Ingress Controller]
                API[NestJS API Pods]
            end

            subgraph Data_Layer [Private Subnet - Data]
                RDS[(RDS PostgreSQL)]:::aws

                %% Redis marcado como futuro
                Redis[(ElastiCache Redis<br/>*Token Store*)]:::future
            end
        end
    end

    %% Fluxos do Front-End
    User -->|1. HTTPS Request Static Assets| WAF_CF
    WAF_CF --> CF
    CF -->|Origin Read| S3

    %% Fluxo de Invalidação de Cache
    Pipeline -->|2. Upload Assets| S3
    Pipeline -.->|3. Invalidate Cache| CF

    %% Fluxos do Back-End (API)
    User -->|4. API Calls HTTPS/JSON| WAF_ALB
    WAF_ALB --> ALB
    ALB --> Ingress
    Ingress --> API
    API -->|Read/Write| RDS

    %% Fluxo Futuro
    API -.->|Future: Validate/Store Tokens| Redis

    %% Observabilidade
    subgraph Observability [Observability Plane]
        CW[CloudWatch]
        Xray[X-Ray Traces]
    end

    API -.-> CW
    API -.-> Xray
```

**Notes**

- **Frontend (React SPA)**
  - Built as a static bundle and deployed to an **S3 bucket**.
  - Served globally through **CloudFront**, improving latency and enabling HTTP caching.
  - A future CI/CD pipeline can trigger **CloudFront invalidation** after each deploy (e.g. `/*` or at least `index.html`) to ensure users always receive the latest version.

- **Backend (NestJS API on EKS)**
  - Exposed via **Ingress Controller** within EKS and published externally through an **ALB**.
  - All `/api/*` calls from the SPA are proxied by CloudFront to the ALB over HTTPS.

- **Data layer**
  - **PostgreSQL (Amazon RDS)** stores system of record data.
  - **ElastiCache Redis (`TokenCache`)** is documented as a **planned/optional enhancement** for:
    - storing active JWTs / refresh tokens
    - supporting token blacklisting and forced logout flows
    - reducing database hits for session-related checks

- **Observability**
  - API logs and custom metrics are centralized in **CloudWatch**.
  - Distributed tracing is handled via **AWS X-Ray**, allowing correlation between API calls and downstream database/cache operations.

> ⚠️ **Implementation status**
>
> - The core **API + RDS** flow and **frontend application** are implemented.
> - **CloudFront + S3 hosting model** and **ElastiCache Redis token cache** are described here as the **target architecture** and may still be **pending implementation** in the current environment.

---

## 🧰 Technology Stack

| Domain   | Technology       | Purpose                                     |
| -------- | ---------------- | ------------------------------------------- |
| Monorepo | Nx               | Caching, computation graph, affected builds |
| Backend  | NestJS           | Modular architecture, DI, TypeScript safety |
| Frontend | React + Vite     | High‑performance SPA with Tailwind/ShadCN   |
| ORM      | TypeORM          | Migrations, schema typing, domain models    |
| Database | PostgreSQL       | Financial integrity and reporting accuracy  |
| Runtime  | Docker + Compose | Dev, CI, and production parity              |

---

## 🧩 Development Workflow

### Requirements

- Docker
- Docker Compose

### Quick Start

```bash
docker compose up --build
```

> The first run seeds the database and provisions the initial admin user.

### Default Services

- Frontend: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:3000/docs](http://localhost:3000/docs)
- Metrics: [http://localhost:3000/api/metrics](http://localhost:3000/api/metrics)

---

## 🐳 Docker Orchestration

Each application defines its own docker‑compose workflow, allowing isolated development and Nx‑controlled execution.

Example: `apps/back-end/docker-compose.yml`

---

## 🧩 Nx Targets

> Nx targets enable isolated orchestration of Docker services via CLI.

```bash
nx run back-end:docker-up
nx run back-end:docker-down
nx run back-end:docker-logs
```

Common scripts include database bootstrapping, rebuild, logs, migrations, and seed operations.

---

## 🔍 Observability

- JSON structured logging using `nestjs-pino`
- `/healthz` probe endpoint (Kubernetes‑compatible)
- `/metrics` exposure in Prometheus format

---

## ⚙️ CI/CD

- Affected‑based pipelines (Frontend / Backend) triggered independently
- Unit tests required prior to merge
- Docker multi‑stage build validation
- Lint enforcement rejecting `any` usage

---

## 📁 Project Structure

```
capital-crm/
├─ apps/
│  ├─ back-end/
│  ├─ front-end/
└─ nx.json
```

---
