# Mini Full-Stack Web App (Firebase + Node.js + GCP)

This project is a mini full-stack application built as a coding challenge.  
It demonstrates connecting frontend, backend, authentication, realtime data, and GPU service compute.

## 🚀 Tech Stack
- **Frontend**: React + Firebase Auth + Firestore
- **Backend**: Node.js (Fastify) + WebSockets + Redis
- **GPU Service**: Python FastAPI on GCE
- **Hosting**: Firebase Hosting + Cloud Run + GCE

## 📂 Project Structure
- `/frontend` → React app with Firebase Auth & Firestore counter
- `/backend` → Node.js Fastify API + WebSockets + Redis Pub/Sub
- `/gpu-service` → FastAPI app simulating GPU compute
- `/infra` → Deployment configs (Firebase, Cloud Run, GCE setup)

## 🔐 Security Notes
- Firestore rules: Users can only read/write their own docs
- API verifies Firebase ID tokens
- Redis is private (not exposed publicly)
- GPU service secured with token or private IP

## 🛠 Setup Instructions
1. Clone repo
2. Setup Firebase project
3. Setup GCP project (Cloud Run, Memorystore, GCE VM)
4. Configure `.env` files (document variables)
5. Deploy services
