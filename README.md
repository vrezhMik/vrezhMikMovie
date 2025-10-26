# 🎬 vrezhMikMovie

A responsive **Vue 3 + TypeScript** web application that lets users browse, search, and favorite movies using data from **The Movie Database (TMDB)** API.  
It includes a test suite with a visual **Vitest UI dashboard**, and is fully containerized for local development via Docker.

---

## 🚀 Live Demo

The app is deployed on **GitHub Pages** here:  
👉 [https://vrezhmik.github.io/vrezhMikMovie/](https://vrezhmik.github.io/vrezhMikMovie/)

---

## 🧠 Project Overview

**VrezhMik Movie Explorer** is designed to demonstrate:

- Modern front-end architecture using Vue 3 Composition API.
- TypeScript for strong typing and maintainability.
- Component-driven design with reusable carousels and layouts.
- Complete unit testing coverage using **Vitest** + **Happy DOM**.
- Docker-based environment for consistent local development.
- A clean CI/CD pipeline ready for GitHub Actions or Pages deployment.

---

## 🧰 Technologies Used

| Category         | Technology                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------ |
| Framework        | [Vue 3](https://vuejs.org/) with Composition API                                           |
| Language         | [TypeScript](https://www.typescriptlang.org/)                                              |
| Build Tool       | [Vite](https://vitejs.dev/)                                                                |
| Testing          | [Vitest](https://vitest.dev/) (with [Happy DOM](https://github.com/capricorn86/happy-dom)) |
| UI Styling       | [Tailwind CSS](https://tailwindcss.com/)                                                   |
| Containerization | [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)     |
| Deployment       | [GitHub Pages](https://pages.github.com/)                                                  |

---

## 🧩 Local Installation & Usage

### 1️⃣ Clone the repository

```bash
git clone https://github.com/vrezhmik/vrezhMikMovie.git
cd vrezhMikMovie
```

### 2️⃣ Make the startup script executable

```
chmod +x scripts/start-dev.sh
```

### 3️⃣ Run the project

This command will:

Create a .env.local file (if it doesn’t exist)

Prompt you for your TMDB credentials

Start both the Vite dev server and Vitest UI inside Docker containers

Automatically open both in your browser

```
./scripts/start-dev.sh
```

### 4️⃣ When prompted, enter your TMDB credentials:

You’ll need two keys from your TMDB account:

```
VITE_TMDB_ACCESS_TOKEN=<your_access_token>
VITE_TMDB_API_KEY=<your_api_key>
```

These will be stored securely in a local .env.local file (not committed to Git).

### 🧪 Testing

After the script runs, open the test dashboard:
👉 http://localhost:51204

Vitest UI provides a live view of running tests, coverage, and logs.

### 🐳 Docker Info

Service Description Port

app Vite dev server 5173

testui Vitest UI dashboard 51204

To manually rebuild and run:

```
docker compose up -d --build
```

### 🌐 Deployment

The app is automatically built and deployed to GitHub Pages via Vite’s static site output.
All components and assets are optimized for production, and API keys are securely injected at build time using GitHub secrets.

### 📄 License

MIT License © 2025 <a href="https://github.com/vrezhmik">Vrezh Mik</a>
