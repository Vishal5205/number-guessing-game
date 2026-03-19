# 🚀 Deep Space — Number Guessing Game | Full Cloud DevOps Pipeline

> A complete end-to-end **CI/CD + GitOps + Monitoring** project built on AWS EC2, Jenkins, Docker, Kubernetes (K3s), ArgoCD, Prometheus, and Grafana.

[![Jenkins](https://img.shields.io/badge/Jenkins-2.541.3-D24939?style=flat&logo=jenkins&logoColor=white)](http://54.163.20.147:8080)
[![Docker](https://img.shields.io/badge/Docker-28.2.2-2496ED?style=flat&logo=docker&logoColor=white)](https://hub.docker.com/r/vishal1326/guessing-game)
[![Kubernetes](https://img.shields.io/badge/K3s-v1.34.5-326CE5?style=flat&logo=kubernetes&logoColor=white)]()
[![ArgoCD](https://img.shields.io/badge/ArgoCD-v3.3.4-EF7B4D?style=flat&logo=argo&logoColor=white)]()
[![Grafana](https://img.shields.io/badge/Grafana-v12.4.1-F46800?style=flat&logo=grafana&logoColor=white)]()
[![Prometheus](https://img.shields.io/badge/Prometheus-Active-E6522C?style=flat&logo=prometheus&logoColor=white)]()

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Infrastructure](#infrastructure)
5. [CI Pipeline — Jenkins](#ci-pipeline--jenkins)
6. [CD Pipeline — ArgoCD + Kubernetes](#cd-pipeline--argocd--kubernetes)
7. [Monitoring — Prometheus + Grafana](#monitoring--prometheus--grafana)
8. [Kubernetes Services & Ports](#kubernetes-services--ports)
9. [AWS Security Group Rules](#aws-security-group-rules)
10. [Application](#application)
11. [Repository Structure](#repository-structure)
12. [How to Reproduce](#how-to-reproduce)

---

## 🎯 Project Overview

This project demonstrates a **production-grade DevOps pipeline** for a containerized web application called **Deep Space — Coordinate Lock Protocol**, a space-themed number guessing game (v2.4.1).

The pipeline covers the complete software delivery lifecycle:

- **Source** → GitHub
- **Build & Test** → Jenkins (SonarQube analysis + Docker build)
- **Registry** → DockerHub (`vishal1326/guessing-game`)
- **Deploy** → Kubernetes (K3s) via ArgoCD GitOps
- **Monitor** → Prometheus + Grafana (kube-prometheus-stack)

---

## 🏗️ Architecture

```
Developer
    │
    ▼
GitHub (main branch)
    │
    ├──► Jenkins CI Pipeline (CI-JENKINS-SERVER)
    │        │
    │        ├── 1. Checkout SCM      (0.25s)
    │        ├── 2. SonarCloud Analysis (33s)
    │        ├── 3. Docker Build       (1s)
    │        └── 4. Docker Push        (5s)
    │                │
    │                ▼
    │         DockerHub Registry
    │         vishal1326/guessing-game:latest
    │
    └──► ArgoCD watches GitHub repo
             │
             ▼
        K3s Kubernetes (CD-KUBERNETES-SERVER)
             │
             ├── Deployment: guessing-game
             ├── Service: guessing-game (NodePort 30007) ◄── App
             ├── ArgoCD Server        (NodePort 32729) ◄── GitOps UI
             ├── Grafana              (NodePort 30332) ◄── Dashboards
             └── Prometheus           (NodePort 32443) ◄── Metrics
```

---

## 🛠️ Tech Stack

| Category | Tool | Version |
|---|---|---|
| Cloud Provider | AWS EC2 | us-east-1b |
| Instance Type | c7i.flex.large | — |
| OS | Ubuntu 24.04 (Noble) | — |
| CI Server | Jenkins | 2.541.3 |
| Container Runtime | Docker | 28.2.2 |
| Container Registry | DockerHub | — |
| Kubernetes | K3s | v1.34.5+k3s1 |
| GitOps | ArgoCD | v3.3.4 |
| Code Quality | SonarCloud | Scanner 8.0.1.6346 |
| Package Manager (K8s) | Helm | v3.20.1 |
| Monitoring Stack | kube-prometheus-stack | — |
| Metrics | Prometheus | Active |
| Dashboards | Grafana | v12.4.1 |
| Java (Jenkins) | OpenJDK | 21 |

---

## 🖥️ Infrastructure

### AWS EC2 Instances

Two dedicated EC2 instances — both `c7i.flex.large`, `us-east-1b`, running simultaneously:

| Instance Name | Instance ID | Role | IP |
|---|---|---|---|
| **CI-JENKINS-SERVER** | i-0adbbf5fae0771b4e | Jenkins CI | 54.163.20.147 |
| **CD-KUBERNETES-SERVER** | i-0ce5af51b511204d2 | K3s + ArgoCD + Monitoring | 18.206.245.80 |

Both instances pass **3/3 status checks** ✅

---

## ⚙️ CI Pipeline — Jenkins

Jenkins `2.541.3` runs on the **CI-JENKINS-SERVER** at `54.163.20.147:8080`.

### Jenkins Credentials Configured

| Credential ID | Type | Purpose |
|---|---|---|
| `dockerhub-creds` | Username/Password | Push image to DockerHub |
| `github-creds` | Username/Password | Checkout source code |
| `sonar-token` | Secret Text | SonarCloud code analysis |

### Jenkins Plugins Installed

- **Docker Pipeline** `634.vedc7242b_eda_7`
- **SonarQube Scanner** `2.18.2`

### Pipeline Stages (Build #3 — 44 sec total)

```
Start → Checkout SCM (0.25s) → SonarCloud Analysis (33s) → Docker Build (1s) → Docker Push (5s) → End
```

All stages pass ✅ — **Finished: SUCCESS**

- Git Revision: `47f32583c6160e91c19a898b3c938c01d5b88b4c`
- Repository: `https://github.com/Vishal5205/number-guessing-game`
- Branch: `refs/remotes/origin/main`
- Pipeline triggered by user: **Devops**

### DockerHub Image

`vishal1326/guessing-game` — 4 tags pushed, 91 total pulls:

| Tag | Pushed |
|---|---|
| `latest` | ~9 min ago |
| `3` | ~9 min ago |
| `7` | ~2 hours ago |
| `10` | ~8 hours ago |

---

## 🔄 CD Pipeline — ArgoCD + Kubernetes

### K3s Setup on CD-KUBERNETES-SERVER

```bash
# Install K3s
curl -sfL https://get.k3s.io | sh -

# Fix kubeconfig permissions
sudo chmod 644 /etc/rancher/k3s/k3s.yaml

# Verify node
kubectl get nodes
# NAME                  STATUS   ROLES           VERSION
# cdkubernetiesserver   Ready    control-plane   v1.34.5+k3s1
```

### Initial Deployment

```bash
# Deploy application
kubectl create deployment guessing-game --image=vishal1326/guessing-game:latest

# Expose as NodePort
kubectl expose deployment guessing-game --type=NodePort --port=80
```

### ArgoCD Setup

```bash
# Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Expose ArgoCD server
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'

# Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d
```

### ArgoCD Application Status

| Field | Value |
|---|---|
| App Health | ✅ **Healthy** |
| Sync Status | ✅ **Synced** to `main (47f3258)` |
| Auto-Sync | **Enabled** |
| Last Sync | Wed Mar 18 2026, 22:43:35 GMT+0530 |
| Commit Author | Vishal S |
| Commit Message | Create service.yaml |

**Resource Tree:** `guessing-game (app)` → `svc + deployment` → `ReplicaSets` → `Pod (1/1 Running)`

---

## 📊 Monitoring — Prometheus + Grafana

### Installation via Helm

```bash
# Install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Add Prometheus community chart
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install kube-prometheus-stack
kubectl create namespace monitoring
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring
```

### Expose Services

```bash
# Expose Grafana
kubectl patch svc monitoring-grafana -n monitoring -p '{"spec": {"type": "NodePort"}}'

# Expose Prometheus
kubectl patch svc monitoring-kube-prometheus-prometheus -n monitoring \
  -p '{"spec": {"type": "NodePort"}}'

# Retrieve Grafana admin password
kubectl get secret --namespace monitoring monitoring-grafana \
  -o jsonpath="{.data.admin-password}" | base64 --decode
```

### Prometheus Targets (`up` query — 13 series, all = 1 ✅)

All 13 scraped targets are healthy, including:
- `kubelet` (cadvisor + probes + metrics)
- `kube-state-metrics`
- `coredns`
- `grafana`
- `node-exporter` (9100)
- `kube-prometheus-operator`
- `prometheus` (9090)
- `alertmanager` (9093)

### Grafana Dashboard

- **Dashboard:** Kubernetes / Compute Resources / Pod
- **Namespace:** `default`
- **Pod:** `guessing-game-84f4d8c486-l8vsv`
- **Metric:** CPU Usage (`node_namespace_pod_container:container_cpu_usage_seconds_total:sum_rate5m`)
- **Data source:** prometheus-1
- **Grafana Version:** v12.4.1 (46a02dc12a)

---

## 🔌 Kubernetes Services & Ports

### `default` Namespace

| Service | Type | Cluster-IP | NodePort | Purpose |
|---|---|---|---|---|
| `guessing-game` | **NodePort** | 10.43.32.59 | **`► 30007`** | 🎮 **App — Public Access** |
| `kubernetes` | ClusterIP | 10.43.0.1 | 443 | Internal API |

### `argocd` Namespace

| Service | Type | Cluster-IP | Port(s) | NodePort |
|---|---|---|---|---|
| `argocd-server` | **NodePort** | 10.43.78.31 | 80, 443 | **`► 32729`** |
| `argocd-applicationset-controller` | ClusterIP | 10.43.110.217 | 7000, 8080 | — |
| `argocd-dex-server` | ClusterIP | 10.43.50.118 | 5556, 5557, 5558 | — |
| `argocd-metrics` | ClusterIP | 10.43.163.155 | 8082 | — |
| `argocd-notifications-controller-metrics` | ClusterIP | 10.43.35.249 | 9001 | — |
| `argocd-redis` | ClusterIP | 10.43.163.99 | 6379 | — |
| `argocd-repo-server` | ClusterIP | 10.43.28.40 | 8081, 8084 | — |
| `argocd-server-metrics` | ClusterIP | 10.43.18.149 | 8083 | — |

### `monitoring` Namespace

| Service | Type | Cluster-IP | Port(s) | NodePort |
|---|---|---|---|---|
| `monitoring-grafana` | **NodePort** | 10.43.133.51 | 80 | **`► 30332`** |
| `monitoring-kube-prometheus-prometheus` | **NodePort** | 10.43.184.130 | 9090, 8080 | **`► 32443`** |
| `monitoring-kube-prometheus-alertmanager` | ClusterIP | 10.43.187.166 | 9093, 8080 | — |
| `monitoring-kube-prometheus-operator` | ClusterIP | 10.43.77.199 | 443 | — |
| `monitoring-kube-state-metrics` | ClusterIP | 10.43.184.56 | 8080 | — |
| `monitoring-prometheus-node-exporter` | ClusterIP | 10.43.236.56 | 9100 | — |
| `alertmanager-operated` | ClusterIP | None | 9093, 9094 | — |
| `prometheus-operated` | ClusterIP | None | 9090 | — |

---

## 🔐 AWS Security Group Rules

Security Group: `sg-0196aa0e7398713e5` (`launch-wizard-7`) — Final state with **6 inbound rules**:

| Port | Protocol | Purpose | Access |
|---|---|---|---|
| **`22`** | SSH | Remote access to EC2 instances | 0.0.0.0/0 |
| **`30007`** | Custom TCP | 🎮 **Guessing Game App** (NodePort) | 0.0.0.0/0 |
| **`30332`** | Custom TCP | 📊 **Grafana Dashboard** (NodePort) | 0.0.0.0/0 |
| **`31260`** | Custom TCP | Jenkins/App initial NodePort | 0.0.0.0/0 |
| **`32443`** | Custom TCP | 🔍 **Prometheus** (NodePort) | 0.0.0.0/0 |
| **`32729`** | Custom TCP | 🔄 **ArgoCD UI** (NodePort) | 0.0.0.0/0 |

> **Note:** Ports were opened incrementally as each service was set up — the security group evolved from 2 rules (SSH + app) to the final 6 rules covering the full monitoring + GitOps stack.

---

## 🎮 Application

**Deep Space — Coordinate Lock Protocol** (`v2.4.1`)

A space-themed number guessing game served via Kubernetes:

- **URL:** `http://18.206.245.80:30007`
- **Gameplay:** Guess the target coordinate between MIN (001) and MAX (100) within 5 reactor cores (attempts)
- **Status:** `TRANSMISSION LIVE` ✅

---

## 📁 Repository Structure

```
number-guessing-game/
├── index.html          # Game frontend
├── Dockerfile          # Container definition
├── Jenkinsfile         # CI pipeline (Checkout → Sonar → Build → Push)
├── deployment.yaml     # Kubernetes Deployment manifest
└── service.yaml        # Kubernetes Service manifest (NodePort 30007)
```

---

## 🔁 How to Reproduce

### 1. Launch EC2 Instances

- 2x `c7i.flex.large`, Ubuntu 24.04, `us-east-1b`
- Assign security group with ports: `22, 8080, 30007, 30332, 31260, 32443, 32729`

### 2. Set Up Jenkins (CI Server)

```bash
sudo apt update
sudo apt install fontconfig openjdk-21-jre -y
# Install Jenkins (via apt)
sudo apt install jenkins -y
sudo systemctl start jenkins
# Install Docker
sudo apt install docker.io -y
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### 3. Configure Jenkins

- Install plugins: **Docker Pipeline**, **SonarQube Scanner**
- Add credentials: `dockerhub-creds`, `github-creds`, `sonar-token`
- Configure SonarQube Scanner tool (`sonar-token`, version `8.0.1.6346`)
- Create pipeline job pointing to GitHub repo

### 4. Set Up K3s (CD Server)

```bash
curl -sfL https://get.k3s.io | sh -
sudo chmod 644 /etc/rancher/k3s/k3s.yaml
```

### 5. Install ArgoCD

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'
```

### 6. Install Monitoring Stack

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
kubectl create namespace monitoring
helm install monitoring prometheus-community/kube-prometheus-stack --namespace monitoring
kubectl patch svc monitoring-grafana -n monitoring -p '{"spec": {"type": "NodePort"}}'
kubectl patch svc monitoring-kube-prometheus-prometheus -n monitoring -p '{"spec": {"type": "NodePort"}}'
```

### 7. Connect ArgoCD to GitHub Repo

- Open ArgoCD UI at `http://<CD-SERVER-IP>:32729`
- Create app pointing to `https://github.com/Vishal5205/number-guessing-game`
- Enable **Auto-Sync**
- ArgoCD will deploy and keep the app in sync with `main` branch

---

## 👤 Author

**Vishal S** — Cloud DevOps Engineer  
GitHub: [@Vishal5205](https://github.com/Vishal5205)  
DockerHub: [vishal1326](https://hub.docker.com/u/vishal1326)

---

*Built on AWS EC2 | Jenkins | Docker | Kubernetes (K3s) | ArgoCD | Prometheus | Grafana | SonarCloud*
