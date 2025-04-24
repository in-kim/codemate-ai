# CodeMate.AI 🧠

> LLM 기반 실시간 코드 리뷰 및 협업이 가능한 웹 IDE

---

## ✨ 프로젝트 소개

**CodeMate.AI**는 개발자들이 실시간으로 코드를 공유하고,  
AI(Large Language Model)를 활용해 코드 리뷰, 스타일 교정, 성능 개선 제안을 받을 수 있는 협업형 웹 플랫폼입니다.

Monaco Editor 기반의 UI, Socket.IO 기반 협업, Vertex AI 기반 코드 리뷰가 핵심입니다.

---

## 🧱 기술 스택

### 📦 Frontend
- **Framework**: Next.js (TypeScript)
- **UI**: Tailwind CSS
- **Code Editor**: Monaco Editor
- **Realtime**: Socket.IO Client
- **State Management**: Zustand
- **Auth**: NextAuth (GitHub OAuth)
- **Syntax Highlight**: Prism.js

### 🔧 Backend
- **Framework**: Nest.js
- **Realtime Server**: Socket.IO Server
- **Database**: MongoDB (with Mongoose)
- **AI Integration**: Google Vertex AI (text generation)
- **Execution Engine**: child_process + Docker CLI
- **Test**: Jest

### ☁ Infra
- **Container**: Docker, Docker Compose
- **Cloud**: AWS EC2 / MongoDB Atlas
- **Dev Tooling**: ESLint, Prettier, GitHub Actions

---

## 📂 폴더 구조

```bash
codemate-ai/
├── frontend/          # Next.js App with FSD 구조
├── backend/           # Nest.js API + Vertex AI
├── socket-server/     # Express + Socket.IO
├── docker-compose.yml
├── .env
└── README.md
