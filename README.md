# 🎨 Pixora AI — Next-Gen AI Photo Studio & Transformation Platform

[![Next.js](https://img.shields.io/badge/Next.js-15_App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![InsForge](https://img.shields.io/badge/InsForge-Postgres_BaaS-6366f1?style=for-the-badge)](https://insforge.dev)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments_Integrated-0c2340?style=for-the-badge&logo=razorpay)](https://razorpay.com/)

> **Pixora** is a state-of-the-art AI-powered photo editing suite and studio web application. Featuring ultra-realistic makeup transfer, virtual try-ons, eye color transformations, and facial enhancements, built with Next.js 15 App Router, InsForge PostgreSQL backend, and Razorpay subscription billing.

---

## ✨ Features & Capabilities

### 🌟 1. Studio & AI Transformation Engine
- **AI Makeup Transfer**: Transfer intricate makeup styles from reference portraits to any user photo seamlessly.
- **AI Makeup Virtual Try-On**: Try pre-crafted makeup looks (Everyday Natural, Glam Night, Rose Romance, Bold Lip) with precision facial alignment.
- **AI Eye Color & Lens Try-On**: Experiment with realistic iris colors and contact lens patterns (Crystal Blue, Honey Hazel, Emerald Green, Amethyst Purple).
- **Interactive Before/After Canvas**:
  - **Slider Mode**: Drag-and-slide interactive comparison with dynamic clip-path rendering.
  - **Split View**: Side-by-side comparative inspection.
  - **Full Result Mode**: Unobstructed, high-definition preview with direct image download (`.jpg`).
- **Live AI Processing Simulation**: Engaging branded laser scanning beam and multi-stage status indicators.

### 🔐 2. Authentication & User Management
- **Email & Password Authentication** with secure session handling.
- **6-Digit OTP Email Verification** workflow.
- **Google OAuth 2.0 Integration** with automatic user profile provisioning.
- **Guest Access**: Explore the studio with guest preview credits without forced sign-in walls.

### 💳 3. 3-Tier Subscription & Credit Billing
- **Flexible Subscription Plans**:
  - **Free Tier**: 25 credits/month, standard studio access.
  - **Basic Tier (₹999 / mo)**: 350 credits/month, Ultra-HD exports, priority generation queue.
  - **Pro Tier (₹2,799 / mo)**: 1,000 credits/month, 4K resolution, instant turbo engine, commercial license.
- **Integrated Razorpay Checkout**: Seamless UPI, Credit/Debit Cards, NetBanking payment processing.
- **HMAC-SHA256 Payment Verification**: Cryptographic verification on server-side API routes.
- **Transaction History & Plan Management**: Instant downgrade to Free, cancel recurring renewal, and full audit logs.

### 📁 4. Projects Dashboard
- **Generations History**: Grid of all user creations sorted chronologically.
- **Tool & Preset Badges**: Filter generations by tool type (Makeup Transfer, Virtual Try-on, Eye Color, etc.).
- **Interactive Inspection Modal**: Re-open the before/after comparison tool anytime for past projects.
- **Server-Side Pagination**: Efficient pagination handling with credit audit data.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions, API Routes)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Lucide Icons](https://lucide.dev/)
- **Backend & Database**: [InsForge](https://insforge.dev) (Serverless PostgreSQL, Auth, S3-compatible Object Storage)
- **Payments**: [Razorpay](https://razorpay.com/) (Standard Checkout & Orders API)
- **AI Processing**: Perfect Corp / YouCam AI Engine REST APIs
- **Typography**: Google Geist Sans & Geist Mono

---

## 📂 Project Structure

```bash
ai-editor/
├── app/
│   ├── api/
│   │   ├── payments/
│   │   │   ├── create-subscription-order/ # Razorpay order creation
│   │   │   ├── verify-subscription/      # HMAC-SHA256 verification & credit grant
│   │   │   ├── manage-subscription/      # Downgrade / cancel logic
│   │   │   └── subscription-history/     # User transaction records
│   │   └── studio/
│   │       ├── beauty/generate/          # Beauty AI generation pipeline
│   │       └── projects/                 # Paginated project retrieval
│   ├── auth/
│   │   └── callback/                     # OAuth redirect callback handler
│   ├── login/                            # Sign In page
│   ├── signup/                           # Sign Up + 6-digit OTP verification
│   ├── studio/
│   │   ├── page.tsx                      # Studio Dashboard & Tool Grid
│   │   ├── layout.tsx                    # Studio layout with Sidebar + Header
│   │   ├── beauty/                       # Beauty Studio tool interface
│   │   ├── billing/                      # Subscription plans & billing portal
│   │   ├── projects/                     # Past generations gallery
│   │   └── [sub-tools]/                  # Skin, Fashion, Hair, Extras sub-pages
│   ├── globals.css                       # Global styles & Tailwind v4 theme
│   ├── layout.tsx                        # Root layout with AuthProvider
│   └── page.tsx                          # Landing page with hero & features
├── components/
│   ├── landing/                          # Landing page modular components
│   ├── studio/                           # Studio header, sidebar, canvas
│   └── ui/                               # Radix & shadcn/ui components
├── lib/
│   ├── auth-context.tsx                  # User authentication React Context
│   ├── insforge.ts                       # InsForge BaaS client initialization
│   └── utils.ts                          # Class variance and styling helpers
├── migrations/                           # SQL schema migrations for PostgreSQL
├── public/                               # Static assets, models, presets, test images
├── .env.example                          # Environment variables template
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.18.0 or later
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### 1. Clone the Repository

```bash
git clone https://github.com/DarkModeTony/Pixora.git
cd Pixora
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy `.env.example` to create your local `.env.local` file:

```bash
cp .env.example .env.local
```

Fill in your actual API keys in `.env.local`:

```env
# InsForge Backend (PostgreSQL, Auth, Storage)
NEXT_PUBLIC_INSFORGE_URL=https://your-project.insforge.app
NEXT_PUBLIC_INSFORGE_ANON_KEY=your_insforge_anon_key
INSFORGE_API_KEY=your_insforge_service_role_key

# Perfect Corp / YouCam AI Engine
YOUCAM_API_KEY=your_youcam_api_key

# Razorpay Payment Gateway
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

### 4. Database Setup

Apply the SQL migrations located in the `migrations/` folder to your PostgreSQL database (or InsForge project):
- `20260907150626_create-users-table.sql`: Users profile table, credit tracking, and auth triggers.
- `20260907201530_subscription-billing.sql`: Subscription plans, billing history, and webhook handlers.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view Pixora.

---

## 🔒 Security & Privacy

- **API Keys Protected**: All secret API keys (`RAZORPAY_KEY_SECRET`, `INSFORGE_API_KEY`, `YOUCAM_API_KEY`) are kept on server-side endpoints and never exposed to client-side bundles.
- **Row Level Security (RLS)**: PostgreSQL tables are protected with strict RLS policies ensuring users can only read and mutate their own generations and billing history.
- **Git Ignore**: `.env*`, build files, and temporary test assets are strictly excluded from version control.

---

## 📄 License

This project is licensed under the MIT License — feel free to use it for personal or commercial projects.
