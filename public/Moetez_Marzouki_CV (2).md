# Moetez Marzouki
**Cloud & Platform Engineer · Backend / Infrastructure**

📧 marzouki.taz@gmail.com · 📱 +216 27 038 750 · 📍 Bizerte, Tunisia  
🔗 [github.com/MoetezMarzouki](https://github.com/MoetezMarzouki) · 🌐 [newpres.vercel.app](https://newpres.vercel.app)

---

## Professional Summary

Platform engineer and cloud-native specialist with hands-on experience designing and shipping production-grade distributed systems from scratch. Architected and built a full Kubernetes-native Internal Developer Platform — 4 Go microservices with GraphQL APIs, Istio service mesh, Keycloak OAuth2/OIDC, custom CRDs & operator-pattern controllers, Helm umbrella charts, and a React 19 admin dashboard — zero boilerplate, zero generators. Strong background in .NET middleware optimisation, LDAP identity management, async workflows, and multi-tenant Kubernetes infrastructure. Combines production-engineering rigour (HPA, PDB, Prometheus, graceful shutdown, exponential backoff) with rapid full-stack delivery.

---

## Core Skills

| Domain | Technologies |
|---|---|
| **Languages** | Go · Rust · TypeScript · Python · Bash / PowerShell |
| **Backend** | Go microservices · gRPC · GraphQL · REST · .NET middleware |
| **Frontend** | React 19 · TypeScript strict · Vite · Tailwind CSS · Jotai |
| **Kubernetes** | K8s / K3s · Helm 3 · Istio · Traefik · CRDs · Operators · RBAC |
| **DevOps / CI-CD** | Docker · ArgoCD · Jenkins · GitOps · Gitea · Multi-stage builds |
| **Cloud** | AWS (Lambda, S3, serverless) · Azure · OpenStack · Knative |
| **Observability** | Prometheus · Structured JSON logging (logrus) · Health probes |
| **Auth / Identity** | Keycloak OAuth2/OIDC · OpenLDAP · JWT (HS256 / RS256) · LDAP federation |
| **Data** | PostgreSQL · Memcached · Redis |
| **Other** | Ansible · Terraform · Vagrant · Qiskit (beginner) |

---

## Featured Projects

### KYMA-FLOW — Kubernetes-Native Internal Developer Platform
*Self-directed · Aug 2024 – Present*

Designed and built entirely from scratch an enterprise-grade IDP running on Kubernetes. The platform lets engineering teams self-service LDAP identity management, spin up browser-based VS Code workspaces on demand, and manage Git repositories — all behind a single Keycloak SSO login.

- **4 Go microservices** (LDAP Manager, Gitea Service, Gitea Sync Controller, CodeServer Service) + React 19 admin dashboard — all hand-written, no boilerplate.
- **LDAP Manager:** connection pool via buffered Go channels, thread-safe UID/GID counters, 15+ GraphQL queries / 12+ mutations, Prometheus metrics, graceful shutdown.
- **Gitea Service:** full REST→GraphQL wrapper (25+ queries, 30+ mutations), async repo migration, HMAC-SHA256 webhook verification, LDAP-based access control.
- **Gitea Sync Controller:** operator-pattern reconciliation loop, exponential backoff retry queue (5s→5min, 5 retries), crash-recovery state persistence, 2 custom CRDs (`KymaRepoSync` · `KymaRepoTimeout`).
- **CodeServer Service:** on-demand VS Code pod provisioning (Pod + PVC + Service + IngressRoute), warm-pool pre-allocation for sub-second spin-up, repo pre-cloning.
- **Auth:** Keycloak OAuth2/OIDC + PostgreSQL + Memcached + LDAP federation; Istio JWT validation at gateway (RS256/JWKS); 7-tier RBAC (Viewer → Director).
- **Infrastructure:** Helm umbrella chart with 7 sub-charts (100+ templates), Istio mTLS STRICT, HPA (2–5 replicas), PDB, non-root / read-only containers, 100+ Prometheus metrics.
- **Scale:** 50+ Go files · 60+ TypeScript files · 100+ Helm templates · 40+ GQL queries · 42+ GQL mutations · 2 CRDs · 7 Docker images.

**Stack:** Go 1.21 · React 19 · TypeScript · GraphQL · Kubernetes · Helm · Istio · Keycloak · OpenLDAP · Gitea · Prometheus · Docker · PostgreSQL · Memcached · Traefik

---

### DBaaS Platform — Database-as-a-Service
*NEXTSTEP Incubator · Aug 2025 – Nov 2026*

Full Kubernetes-native self-service database provisioning platform. Developers request database instances via a React UI; the platform handles Kubernetes deployment, LDAP-based authentication, ArgoCD GitOps delivery, and Traefik ingress routing end-to-end.

- Go microservices backend with gRPC inter-service communication and REST/GraphQL external APIs.
- LDAP authentication integration for multi-tenant user management.
- ArgoCD + Jenkins CI/CD pipeline with GitOps workflows for automated database lifecycle management.
- K3s cluster deployment with Traefik IngressRoute automation and LoadBalancer configuration.
- React frontend with GitHub Projects-based sprint management and detailed ticket tracking.

**Stack:** Go · gRPC · GraphQL · REST · React · Kubernetes · K3s · ArgoCD · Jenkins · Traefik · OpenLDAP · Docker · Helm

---

## Professional Experience

### .NET Middleware Benchmarking & Optimisation — ODDO BHF
*Aug 2024 – Oct 2024*

- Benchmarked and profiled a production .NET middleware job-management service; identified throughput bottlenecks through systematic load testing.
- Replaced synchronous inter-service calls with a gRPC + protobuf layer, achieving measurable latency reduction on high-volume jobs.
- Implemented Rust-based performance-critical modules to offload hot-path computation from the .NET runtime.

**Stack:** .NET · Rust · gRPC · protobuf

---

### Backend Developer Intern — ARABSOFT
*May 2023 – Jul 2023*

- Designed and delivered an HR management application with Django and Node.js backend, covering employee records, leave management, and reporting.
- Delivered working product within a 3-month internship cycle with full REST API coverage.

**Stack:** Django · Node.js · REST API

---

### ERP Developer Intern — AGIL Tunis
*Jun 2019 – May 2021*

- Built and deployed an ODOO community ERP integrated with an Angular frontend for AGIL GAZ's internal operations.
- Deployed on CentOS 7 with a DAS storage architecture; automated provisioning with Bash scripts.
- Covered HR, procurement, and inventory modules; onboarded internal staff on the new system.

**Stack:** ODOO · Angular · Bash · Node.js · XML · RAID/DAS · CentOS 7

---

## Education

### Cloud Engineering Degree *(Ongoing)* — ESPRIT University, Tunis
*Sep 2022 – Jul 2025*

- Specialisation: Cloud Computing, Kubernetes, OpenStack, DevOps/MLOps.
- Capstone project: KYMA-FLOW (enterprise Kubernetes IDP — see Projects above).

### Bachelor of Computer Science — ESEN Manouba
*Sep 2018 – Aug 2021*

- Specialisation: Information Systems, Management Fundamentals, ERP.
- Senior project: ERP prototype for AGIL GAZ using ODOO Community Edition.

---

## Languages

Arabic — Native · French — C1 · English — C1 · Bahasa Indonesian — Basic

---

## References

| Name | Role | Company | Email |
|---|---|---|---|
| Mohamed Amine Ben Ameur | Confirmed Fullstack Developer | Taland Tunis | mohamedaminbnamer@gmail.com |
| Hamza Jouini | Senior Fullstack Developer | Docapost | hamzajouini52@gmail.com |
| Mohamed Amine Bejaoui | Tech Lead | Intuitive Tunisie | medaminebejaoui.personal@gmail.com |
