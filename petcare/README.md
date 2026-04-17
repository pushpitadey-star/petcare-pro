# 🐾 PetCare Pro - Next-Gen Pet Care & AI Diagnostics

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://petcare-pro.pages.dev)
[![Stack](https://img.shields.io/badge/Stack-Next.js%2015%20|%20Turso%20|%20Cloudflare-blue)](https://petcare-pro.pages.dev)
[![AI](https://img.shields.io/badge/AI-Llama%203.1%20|%20Workers%20AI-orange)](https://petcare-pro.pages.dev)

PetCare Pro is a high-performance, production-ready pet management ecosystem that combines professional veterinary tools with state-of-the-art **Generative AI**. Built on the Cloudflare Edge network and powered by Turso, it offers zero-latency performance and specialized medical inference.

---

## 🌟 Major Highlights

### 🤖 AI Disease Predictor (New!)
A clinical-grade diagnostic assistant trained on the **Animal Disease Prediction (Kaggle)** dataset. 
- **Pattern Recognition:** Analyzes 22 clinical parameters across 8 animal species.
- **Neural Inference:** Uses Cloudflare Workers AI (Llama 3.1) to analyze symptoms, body temperature, and heart rate.
- **Smart Reports:** Generates structured diagnostic summaries with confidence scores and medical recommendations.

### 💬 Intelligent AI Chatbot
Not just a generic bot—a specialized Veterinary Guide.
- **Clinical Knowledge:** Injected with specialized knowledge for livestock and domestic pets.
- **Site Navigator:** Understands the entire PetCare Pro platform; can guide users to "My Pets", "Vaccinations", or "Appointments".
- **Token Optimized:** Specially tuned prompt engineering to stay within Cloudflare's free-tier AI Neuron limits (10,000/day) while providing professional, concise answers.

---

## ✨ Core Features

✅ **Health Dashboard** - Real-time statistics and quick actions for your pets.  
✅ **Pet Management** - Deep profile tracking for multiple animals.  
✅ **Vet Appointments** - Full-cycle booking and management system.  
✅ **Vaccination Log** - History tracking and future reminder system.  
✅ **Social Community** - Post updates, share tips, and connect with other pet owners.  
✅ **Multi-Role RBAC** - Optimized interfaces for Users, Veterinarians, and Admins.  
✅ **Premium Dark Mode** - Stunning, responsive UI designed for maximum readability.  

---

## 🛠️ Tech Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| **Meta-Framework** | Next.js 15 (App Router) | Active |
| **Logic** | TypeScript & React 19 | Active |
| **Database** | Turso (libSQL) | Edge-Optimized |
| **AI Engine** | Cloudflare Workers AI (Llama 3.1) | Production |
| **Styling** | TailwindCSS & Shadcn/UI | Responsive |
| **Edge Runtime** | Cloudflare Pages (Edge) | Deployed |

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- Node.js 18+
- Turso CLI (Optional for cloud mode)

### 2. Installation
```bash
git clone https://github.com/Imtiazul-Islam/petcare-pro-main.git
cd petcare-pro-main
npm install
```

### 3. Environment Config
Create a `.env.local` file:
```env
DATABASE_MODE=local
LOCAL_DB_PATH=./data/petcare.db
NODE_ENV=development
IMGBB_API_KEY=your_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database & Launch
```bash
npm run db:init   # Initialize & Seed Local SQLite
npm run dev       # Start Development Server
```

---

## ☁️ Cloud Deployment (Cloudflare + Turso)

This project is built for the **Edge**. Follow these steps for production deployment:

### 🗄️ Database Setup (Turso)
1. Create a DB: `turso db create petcare-pro`
2. Get URL: `turso db show petcare-pro --url`
3. Get Token: `turso db tokens create petcare-pro`
4. Update `.env.local` with `DATABASE_MODE=cloud` and your credentials.
5. Push schema: `npm run turso:push`

### ⚡ AI Setup (Cloudflare Workers AI)
1. In `wrangler.toml`, ensure the AI binding is present:
   ```toml
   [ai]
   binding = "AI"
   ```
2. On Cloudflare Dashboard, go to **Settings > Functions > Compatibility Flags** and add `nodejs_compat`.

### 🚀 Deploying to Pages
1. Connect your GitHub/GitLab repo to Cloudflare Pages.
2. Set the Environment Variables in the Pages dashboard:
   - `DATABASE_MODE`: `cloud`
   - `TURSO_CONNECTION_URL`: Your Turso URL
   - `TURSO_AUTH_TOKEN`: Your Turso Token
   - `IMGBB_API_KEY`: Your ImageBB key
3. Build Command: `npm run build`
4. Output Directory: `.next`

---

## 📋 Essential Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start local development |
| `npm run db:init` | Create & Seed local DB (Run this first!) |
| `npm run db:reset` | Wipe and restart local DB |
| `npm run turso:push` | Sync local schema to Turso Cloud |
| `npm run build` | Compile Edge-compatible production build |

---

## 🔒 Security & Performance
- **Edge Native:** All API routes run on the Edge Runtime for global low-latency.
- **Secure Auth:** Session management using HttpOnly cookies and bcrypt hashing.
- **Optimized AI:** Prompt engineering restricts responses to save on daily AI neurons.
- **Image handling:** Integrated with ImgBB for high-performance asset serving.

---

## 📝 License
Built with ❤️ for Pet Lovers. Distributed under the MIT License.