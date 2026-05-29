# Sentry

A modern full-stack monitoring and workflow orchestration platform combining a React frontend with a Node-RED automation backend.

## ✨ Overview

Sentry is designed to provide a flexible foundation for monitoring systems, automation workflows, and event-driven integrations. The project combines:

* ⚛️ A fast and modern React + Vite frontend
* 🔴 A Node-RED workflow engine
* 🐳 Docker support for deployment and portability
* 📦 Modular architecture for scalability

---

# 📁 Repository Structure

```bash
sentry/
├── frontend/      # React + Vite frontend application
├── node-red/      # Node-RED service and automation flows
└── README.md
```

---

# 🚀 Features

* Modern React frontend
* Lightning-fast Vite development environment
* Workflow automation with Node-RED
* Dockerized backend support
* ESLint integration
* Modular project organization
* Easy local development setup

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* JavaScript
* ESLint

## Backend / Automation

* Node-RED
* Docker

---

# ⚙️ Getting Started

## Prerequisites

Make sure you have installed:

* Node.js (v18+ recommended)
* npm
* Docker (optional)

---

# 📥 Clone the Repository

```bash
git clone https://github.com/M3XH4/sentry.git
cd sentry
```

---

# 🖥️ Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The frontend will be available at:

```bash
http://localhost:5173
```

---

# 🔴 Node-RED Setup

Navigate to the Node-RED directory:

```bash
cd node-red
```

Install dependencies:

```bash
npm install
```

Start Node-RED:

```bash
npm start
```

Node-RED dashboard:

```bash
http://localhost:1880
```

---

# 🐳 Docker Support

Build the Docker container:

```bash
docker build -t sentry-node-red .
```

Run the container:

```bash
docker run -p 1880:1880 sentry-node-red
```

---

# 📦 Available Scripts

## Frontend

```bash
npm run dev       # Start development server
npm run build     # Build production app
npm run preview   # Preview production build
```

## Node-RED

```bash
npm start         # Start Node-RED
```

---

# 🔧 Configuration

Node-RED configuration files:

```bash
node-red/settings.js
```

Node-RED workflows:

```bash
node-red/flows.json
```

---

# 📌 Roadmap

Future improvements may include:

* Authentication system
* Real-time monitoring dashboard
* Notifications and alerts
* API integration layer
* CI/CD pipelines
* Cloud deployment support
* Metrics visualization

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

# 📄 License

This project is licensed under the MIT License.