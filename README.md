# Capital CRM - Nx Monorepo

<div align="center">

  ![Nx](https://img.shields.io/badge/Nx-Monorepo-blueviolet)
  ![TypeScript](https://img.shields.io/badge/TypeScript-Strict-informational)
  ![NestJS](https://img.shields.io/badge/NestJS-API-red)
  ![React](https://img.shields.io/badge/React-Vite-blue)
  ![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)
  ![CI/CD](https://img.shields.io/badge/CI-CD-success)

  <br />

  [**🔗 Open Live Demo**](https://capital-crm-platform.pages.dev/)
https://capital-crm-platform.pages.dev/
</div>

---

## 📌 Table of Contents

- [Executive Summary](#-executive-summary)
- [📂 System Modules](#-system-modules)
- [☁️ Cloud-Native Architecture](#️-cloud-native-architecture)
- [🧰 Technology Stack](#-technology-stack)
- [🚀 How to Run (Docker-First)](#-how-to-run-docker-first)
- [📁 Project Structure](#-project-structure)
- [🔍 Observability](#-observability)

---

## 🧭 Executive Summary

**Capital CRM** is a high-performance platform designed for enterprise client intelligence, valuation tracking, and secure audit history.

This project demonstrates a **production-ready** application implemented within an **Nx Monorepo**, ensuring a unified full-stack development experience, scalability, and shared tooling.

### Key Objectives
- **Unified Monorepo:** Single dependency graph for both frontend and backend.
- **Code Quality:** Strict linting and automatic formatting (Prettier/ESLint).
- **Consistency:** Containerized execution via Docker Compose for dev/prod parity.
- **DevOps:** Segmented CI/CD pipelines based on change scope (Nx Affected).

---

## 📂 System Modules

Detailed documentation on implementation, endpoints, and visual components can be found in the specific READMEs for each application:

| Application | Description | Key Tech & Features | Documentation |
| :--- | :--- | :--- | :--- |
| **Frontend** | High-performance SPA with modern UI and state management. | **React, Vite, ShadCN, Orval**.<br>Includes **MSW (Mock Service Worker)** for full backend emulation directly in the browser. | [📖 Read Docs](./apps/front-end/README.md) |
| **Backend** | Scalable, secure, and domain-driven REST API. | **NestJS, TypeORM, PostgreSQL**.<br>Features comprehensive Swagger docs and metric instrumentation. | [📖 Read Docs](./apps/back-end/README.md) |

> **💡 Frontend Note:** The Frontend project is equipped with [MSW](https://mswjs.io/) to intercept requests at the network level. This allows developers to build and test features even if the backend services are offline. Check the [Frontend README](./apps/front-end/README.md#local-api-mocking-msw) for more details.

---

## ☁️ Cloud-Native Architecture

```mermaid
graph TD
    %% Styles
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

                %% Redis marked as future
                Redis[(ElastiCache Redis<br/>*Token Store*)]:::future
            end
        end
    end

    %% Frontend Flows
    User -->|1. HTTPS Request Static Assets| WAF_CF
    WAF_CF --> CF
    CF -->|Origin Read| S3

    %% Cache Invalidation Flow
    Pipeline -->|2. Upload Assets| S3
    Pipeline -.->|3. Invalidate Cache| CF

    %% Backend Flows (API)
    User -->|4. API Calls HTTPS/JSON| WAF_ALB
    WAF_ALB --> ALB
    ALB --> Ingress
    Ingress --> API
    API -->|Read/Write| RDS

    %% Future Flow
    API -.->|Future: Validate/Store Tokens| Redis

    %% Observability
    subgraph Observability [Observability Plane]
        CW[CloudWatch]
        Xray[X-Ray Traces]
    end

    API -.-> CW
    API -.-> Xray
````

**Architecture Notes**

  - **Frontend:** Static SPA served via S3 + CloudFront for low global latency.
  - **Backend:** NestJS running on EKS (Kubernetes), exposed via ALB.
  - **Data:** PostgreSQL (RDS) as the source of truth.
  - **Observability:** CloudWatch and X-Ray for logs and distributed tracing.

-----

## 🧰 Technology Stack

The project leverages the best of the modern JavaScript/TypeScript ecosystem.

| Domain | Technology | Details |
| :--- | :--- | :--- |
| **Monorepo** | **Nx** | Computation caching, task runner, dependency graph. |
| **Language** | **TypeScript** | Strict mode enabled across the entire repository. |
| **Frontend** | **React + Vite** | Optimized performance, instant Hot Module Replacement. |
| **Mocking** | **MSW** | **Mock Service Worker** for network-level API interception. |
| **UI Kit** | **Tailwind + ShadCN** | Consistent and customizable design system. |
| **API Client** | **Orval** | Auto-generated types and hooks from Backend Swagger. |
| **Backend** | **NestJS** | Modular architecture, Dependency Injection. |
| **Database** | **PostgreSQL** | Financial integrity and relational data. |
| **ORM** | **TypeORM** | Migrations, schema typing, and domain models. |
| **Infra** | **Docker** | Local orchestration via Docker Compose. |

-----

## 🚀 How to Run (Docker-First)

You can run the entire stack **without installing any node dependencies** locally. We utilize specific Nx targets that trigger Docker Compose configurations located inside each application folder.

### Prerequisites

  - Docker & Docker Compose
  - Nx CLI (optional, but recommended: `npm install -g nx`)

### Running the Full Stack

Execute the following commands in your terminal to spin up the Backend and Frontend environments independently using Docker:

#### 1\. Start the Backend (API + Database)

This command builds the API container, starts PostgreSQL, runs migrations, and seeds the database automatically.

```bash
npx nx run back-end:docker-up
```

> API will be available at: [http://localhost:3000/docs](https://www.google.com/search?q=http://localhost:3000/docs)

#### 2\. Start the Frontend

This command builds the frontend container and serves it via Nginx or a dev server.

```bash
npx nx run front-end:docker-up
```

> Application will be available at: [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)

### Why this approach?

  - **Zero Configuration:** No need to run `npm install` on the root if you just want to run the app.
  - **Isolation:** Each app manages its own container lifecycle.
  - **Consistency:** Ensures you are running exactly the same environment as production.

-----

## 📁 Project Structure

Below are the main directories of the Monorepo:

```text
capital-crm/
├── apps/
│   ├── back-end/          # NestJS API (Controllers, Services, Docker Compose)
│   │   ├── src/
│   │   ├── docker-compose.yml
│   │   └── README.md      # ⬅️ Backend Specific Docs
│   │
│   └── front-end/         # React SPA (Features, Pages, Docker Compose)
│       ├── src/
│       ├── docker-compose.yml
│       └── README.md      # ⬅️ Frontend Specific Docs
│
├── libs/                  # Shared libraries (DTOs, Utils - Optional)
├── tools/                 # Automation scripts and generators
├── nx.json                # Monorepo configuration
└── README.md              # This file
```

-----

## 🔍 Observability

The system is pre-configured with instrumentation for production environments:

  - **Logs:** Structured JSON (`nestjs-pino`) for easy ingestion into CloudWatch/Datadog.
  - **Health Checks:** `/healthz` endpoint compatible with Kubernetes Probes.
  - **Metrics:** `/metrics` endpoint exposing VM and application data in Prometheus format.

-----
