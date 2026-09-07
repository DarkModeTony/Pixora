<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- INSFORGE:START -->
## InsForge backend

This project uses [InsForge](https://insforge.dev): an all-in-one, open-source Postgres-based backend (BaaS) that gives this app a database, authentication, file storage, edge functions, realtime, an AI model gateway, and payments through one platform.

- **Project:** **my-ai-editor** (API base `https://uji68esc.us-east.insforge.app`)
- **Skills:** these InsForge skills are installed for supported coding agents. Reach for them before implementing any InsForge feature instead of guessing the API:
  - `insforge`: app code with the `@insforge/sdk` client (database CRUD, auth, storage, edge functions, realtime, AI, email, and Stripe payments).
  - `insforge-cli`: backend and infrastructure via the `insforge` CLI (projects, SQL, migrations, RLS policies, storage buckets, functions, secrets, payment setup, schedules, deploys).
  - `insforge-debug`: diagnosing failures (SDK/HTTP errors, RLS denials, auth and OAuth issues) and running security or performance audits.
  - `insforge-integrations`: wiring external auth providers (Clerk, Auth0, WorkOS, Better Auth, etc.) for JWT-based RLS, or the OKX x402 payment facilitator.
  - `find-skills`: discovering additional skills on demand.
- **Credentials:** app code reads keys from `.env.local`; the CLI reads `.insforge/project.json`. Never hardcode or commit keys.

Key patterns:

- Database inserts take an array: `insert([{ ... }])`.
- Reference users with `auth.users(id)`; use `auth.uid()` in RLS policies.
- For storage uploads, persist both the returned `url` and `key`.
<!-- INSFORGE:END -->

## Mandatory Agent Session Rule: Keep AGENTS.md Synchronized
> **CRITICAL RULE FOR ALL AI AGENTS**:
> At the end of every task or whenever new features, routes, components, database tables, storage buckets, or architectural changes are introduced, **you MUST update this `AGENTS.md` file**.
> Document any newly created files, endpoints, database schema changes, env vars, and current architecture state so subsequent agents do not need to scan the entire project directory.

## Project Architecture & Overview
- **Framework**: Next.js (App Router, Tailwind CSS v4, TypeScript, React 19)
- **UI System**: shadcn/ui components in `@/components/ui/` (61 components installed)
- **Backend / BaaS**: InsForge (`my-ai-editor`, ID: `2283e1d7-7f05-43fa-94ed-951f58593e5a`, host: `https://uji68esc.us-east.insforge.app`)
- **CLI Commands**: Backend tasks run via `npx -y @insforge/cli <command>`
- **Installed Agent Skills**: `.agents/skills/` (`insforge`, `insforge-cli`, `insforge-debug`, `insforge-integrations`, `find-skills`)

### Key Directories & Files
  - `app/studio/`: Main dashboard/studio route (formerly /dashboard)
    - `app/studio/layout.tsx`: Studio layout with sidebar + header
    - `app/studio/page.tsx`: Studio home with welcome banner + AI tool cards
    - `app/studio/skin-face/`, `beauty/`, `fashion/`, `hair-beard/`, `extras/`, `projects/`, `templates/`, `billing/`: Tool sub-pages
  - `app/login/page.tsx`: Sign In page (Email/password + Google OAuth)
  - `app/signup/page.tsx`: Sign Up page (Email/password + OTP verification + Google OAuth)
  - `app/auth/callback/page.tsx`: OAuth callback handler page
  - `app/globals.css`: Tailwind styling
- `components/landing/`: Modular landing page components
  - `Navbar.tsx`, `HeroSection.tsx`, `FeatureCategories.tsx`, `HowItWorksSection.tsx`, `TransformBanner.tsx`, `TestimonialsSection.tsx`, `CtaSection.tsx`, `Footer.tsx`
  - `shared/`: `SectionBadge.tsx`, `StarRating.tsx`
- `components/ui/`: Comprehensive shadcn UI component library
- `lib/`:
  - `insforge.ts`: Initialized InsForge client using `@insforge/sdk`
  - `auth-context.tsx`: React Context for current user state & sign out
  - `utils.ts`: Shared utilities
- `migrations/`:
  - `20260907150626_create-users-table.sql`: Creates `public.users` table with RLS and trigger `on_auth_user_created`
- `.insforge/project.json`: Linked InsForge project configuration
- `.agents/skills/`: Agent skills directory for backend actions

### Recent Changes & Current State
- **Session 2026-09-07**:
  - Linked backend project `my-ai-editor` via InsForge CLI.
  - Copied and activated InsForge agent skills in `.agents/skills/`.
  - Added session synchronization mandate in `AGENTS.md` and `.agents/rules/session-sync.md`.
  - Implemented pixel-accurate Pixora AI photo editor landing page with 8 reusable components.
  - Generated visual assets for features and mockups in `public/images/`.
  - Installed `@insforge/sdk@latest` and configured `.env.local` (`NEXT_PUBLIC_INSFORGE_URL`, `NEXT_PUBLIC_INSFORGE_ANON_KEY`, `INSFORGE_API_KEY`).
  - Created database migration `20260907150626_create-users-table.sql` creating `public.users` with RLS policies and `handle_new_user()` trigger on `auth.users` insert. Applied migration via `insforge db migrations up --all`.
  - Built complete authentication system with matching design:
    - `/login`: Email + Password login with optional Name field (syncs to profile and `public.users`) and Google OAuth.
    - `/signup`: Email + Password registration, automatic 6-digit OTP code verification flow, and Google OAuth.
    - `/auth/callback`: OAuth callback handler that saves Google users to `public.users`.
    - Integrated `AuthProvider` in `RootLayout` and updated `Navbar` with dynamic user profile & Sign Out action.
    - Updated navigation & CTA buttons (`Navbar`, `CtaSection`) to automatically transform from "Sign In" / "Get Started" into a vibrant gradient "**Studio**" button when the user is logged in.

- **Session 2026-09-07 (continued)**:
  - Renamed route `/dashboard` → `/studio` across all files.
  - Updated all internal links in `DashboardSidebar`, `DashboardHeader`, `GenericToolPage`, studio sub-pages, and all landing components (`Navbar`, `HeroSection`, `TransformBanner`, `CtaSection`) to point to `/studio`.
  - Studio button in Navbar now correctly routes to `/studio`.
  - Added "Dashboard" navigation button to the top of `DashboardSidebar` linking to `/studio` with active state highlighting.
  - Redesigned `/studio` page (`app/studio/page.tsx`):
    - Full-width hero banner with text "AI Photo Editing redefine for you" on the left and floating image preview montage on the right.
    - AI Tools grid with exactly 6 cards (3 per row on desktop): AI Skin & Face Analysis, Beauty Studio, Fashion & Wardrobe, Hair & Beard Styling, AI Extras & Magic Tools, Face Swap & Relighting.
    - Each tool card features a thumbnail image on the left, tool title, and a 2-line description on the right.
    - All images sourced directly from `public/ai-photo-editing-images/`.
    - Recent Projects section below the tools featuring an empty state card with folder icon, informative prompt, and direct "+ Start Your First Project" CTA.
    - Permitted guest browsing in `app/studio/layout.tsx` with fallback credits and profile state.
  - Configured YouCam MCP servers (`youcam-beauty`, `youcam-fashion`, `youcam-creators`) via `mcp-remote` in global `~/.gemini/config/mcp_config.json`.
  - Implemented Beauty Studio UI (`app/studio/beauty/page.tsx`):
    - Two-column Studio layout matching Pixora theme (`from-pink-500 via-purple-600 to-indigo-600`).
    - Left Column (Controls & Customization):
      - Section 1: 3 Beauty AI tools (AI Makeup Transfer, AI Makeup Virtual Try-On, AI Eye Color Try-On) with thumbnails, tags, and active state indicators.
      - Section 2: Source Image panel with Upload tab (drag-and-drop / file browser) and Test Images tab (4 sample portraits).
      - Section 3: Choose Look grid with dynamic look presets per tool (lip, blush, foundation, natural, dramatic).
      - Bottom: Gradient "Generate Result" CTA with reactive state management.
    - Right Column (Interactive Canvas):
      - Interactive Before & After comparison slider with smooth mouse and touch drag, dynamic clip-path masking, and center handle.
      - 3 View Modes: Slider (interactive before/after), Split (side-by-side comparison), and Result (unobstructed full view).
      - Compact, responsive image container height (`max-w-[400px] aspect-[4/5]`) preventing vertical scrolling on standard desktop viewports (e.g. 730px height).
      - Direct download options on canvas top-bar and primary result action bar (`pixora-[tool]-[timestamp].jpg`).
      - Branded AI processing animation with source portrait laser scanning beam, multi-step progress indicators ("Facial Contours" → "AI Styling" → "HD Polish"), and clean loading state free of external provider mentions.
  - Integrated YouCam AI Beauty generation pipeline (`/api/studio/beauty/generate`):
    - Implemented live generation for AI Makeup Transfer (`/task/mu-transfer`), AI Makeup Virtual Try-On (`/task/look-vto`), and AI Eye Color Lens Virtual Try-On (`/task/eye-color-vto`).
    - Connected user-provided asset folders:
      - `public/normal-headshot/`: Sample model headshots (`girl1.png`, `girl2.png`, `boy1.png`, `girl3.png`, `girl4.png`) selectable in the Test Images tab.
      - `public/makeup-transfer/`: Reference makeup styles (`webp_makeup_transfer_01.png` through `04`) for AI Makeup Transfer.
      - `public/eye-lens/`: Contact lens textures (`webp_eye_len_01.png` through `06`) for AI Eye Color Lens Try-On.
    - Two-step presigned YouCam upload flow with dynamic content type and file extension matching.
    - Fast polling supporting `task_status: "success"`.
    - Automatic persistence to InsForge Storage (`generations` bucket in `outputs/${userId}/...`).
    - Credit system: Deducts 5 credits per generation from `public.users` and records generation metadata in `public.generations`.
    - Both direct API and UI integration verified end-to-end.
  - Implemented My Projects Dashboard (`/studio/projects` & `/api/studio/projects`):
    - Top matching gradient hero banner (`from-purple-700 via-pink-600 to-indigo-700`) with live generation statistics and quick "+ New Generation" CTA.
    - AI Tool filter bar with dedicated icons (All, Makeup Transfer, Virtual Try-On, Eye Color, Skin & Face, Fashion, Hair & Beard) and search filtering.
    - Generation cards grid displaying recent creations first with tool badges, preset names, timestamps, and credits used.
    - Hover quick actions: interactive comparison, direct image download, and delete confirmation.
    - Interactive Before & After comparison modal with draggable slider, view mode switchers (Slider, Split, Full Result), and download actions.
    - Server-side pagination with max 20 items per page (`/api/studio/projects?userId=...&page=...&limit=20`), total count, and navigation controls.
    - Empty state for new users and guest welcome state prompting registration to claim 50 free credits.

- **Session 2026-09-08**:
  - Integrated Razorpay Standard Checkout for credit top-ups and subscriptions.
  - Implemented 3-Tier Monthly Subscription Billing System with InsForge & Razorpay:
    - **Subscription Tiers**:
      - **Free Plan**: ₹0 / month, 25 free credits per month.
      - **Basic Plan**: ₹999 / month, 350 credits per month, Ultra-HD exports, priority queue.
      - **Pro Plan**: ₹2,799 / month, 1,000 credits per month, 4K resolution, instant turbo engine, commercial license, 24/7 VIP support.
    - **Database Migration (`migrations/20260907201530_subscription-billing.sql`)**:
      - Added subscription fields to `public.users`: `plan` ('free' | 'basic' | 'pro'), `plan_expires_at` (TIMESTAMPTZ), `plan_credits_per_month` (INTEGER), `subscription_razorpay_order_id` (TEXT).
      - Created `public.subscription_history` audit table with RLS (`user_id`, `plan`, `amount_paise`, `razorpay_order_id`, `razorpay_payment_id`, `status`, `created_at`, `paid_at`).
      - Created webhook fulfillment trigger `fulfill_subscription_from_webhook()` on `payments.webhook_events` for automatic background fulfillment upon Razorpay webhook events (`order.paid`, `payment.captured`).
    - **Backend API Endpoints**:
      - `POST /api/payments/create-subscription-order`: Validates user and plan, creates Razorpay Order with custom notes and receipt, creates pending record in `public.subscription_history`, and returns `checkoutOptions` for Razorpay Checkout.js.
      - `POST /api/payments/verify-subscription`: Verifies HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET`, atomically credits `public.users` with plan credits, updates `plan`, `plan_expires_at` (30 days from purchase), and marks `subscription_history` as paid.
      - `POST /api/payments/manage-subscription`: Handles actions: `"downgrade-free"` (switches user to Free Plan with 25 credits/mo while preserving purchased credits) and `"cancel"` (cancels recurring renewal with benefits retained until cycle end).
      - `GET /api/payments/subscription-history`: Returns user's past subscription and top-up transactions with plan name, amount in INR, order ID, and status badge.
    - **Frontend Revamp (`app/studio/billing/page.tsx`)**:
      - 3 Account Overview Cards: Available Credits (with plan allowance), Current Subscription Plan (with dynamic status badge and monthly price), Billing Period & Status (renewal date, Cancel Subscription, Change Plan).
      - 3 Interactive Subscription Cards with distinct badges ("Popular Value", "Best for Creators"), feature checklists, and reactive action buttons ("Active Plan", "Upgrade to...", "Downgrade to Free").
      - Manage Subscription & Payment Methods section with Payment Details dialog (UPI, Cards, NetBanking), Cancel Confirmation modal, and live Payment History table with status badges.
      - Dynamic plan badge display across Dashboard Header and Sidebar.


