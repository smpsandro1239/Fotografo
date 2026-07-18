# 📸 Plataforma Premium para Fotógrafos  
### Desenvolvido por **Sandro Pereira**

Este repositório contém o código-fonte completo da plataforma SaaS premium para fotógrafos, incluindo:

- **Backend** (NestJS + Prisma + PostgreSQL + Stripe + Cloudflare R2)
- **Frontend Web** (Next.js 15 + Tailwind v4 + shadcn/ui)
- **App Mobile** (React Native + Expo 52 + Expo Router)
- **Infraestrutura DevOps** (CI/CD GitHub Actions, monitorização, logs, segurança)

---

# 🚀 Objetivo do Projeto

Criar a plataforma mais completa, moderna e premium para fotógrafos de eventos, permitindo:

- Gestão de eventos  
- Packs e veículos  
- Reservas com pagamento Stripe  
- Galerias protegidas com URLs assinadas  
- Encomendas de fotos com carrinho  
- App mobile para clientes (galeria, favoritos, seleção)  
- Estatísticas avançadas (fotógrafo + cliente)  
- Notificações in-app + email  
- Experiência de luxo para fotógrafos e clientes  

---

# 🧠 Arquitetura Geral

## **Backend**
- Node.js 22+
- NestJS 11+
- Prisma 6+
- PostgreSQL 16+
- Stripe API 2024+
- Cloudflare R2 (S3-compatible)

## **Frontend**
- Next.js 15 (App Router)
- React 19
- TailwindCSS v4
- shadcn/ui (Radix UI)
- TanStack React Query v5
- Zustand v5

## **Mobile**
- React Native 0.76
- Expo SDK 52
- Expo Router 4
- SecureStore (tokens)
- TanStack React Query v5
- Zustand v5

## **Infra**
- Docker 27+
- GitHub Actions (3 workflows)
- EAS Build (Android/iOS)
- Cloudflare CDN + R2

---

# 📂 Estrutura do Repositório

```
Fotografo/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # JWT + Passport + bcrypt
│   │   ├── users/          # Perfil utilizador
│   │   ├── photographers/  # Perfil fotógrafo
│   │   ├── events/         # CRUD + publish
│   │   ├── albums/         # CRUD
│   │   ├── photos/         # Upload + signed URLs + proteção
│   │   ├── storage/        # Cloudflare R2 service
│   │   ├── packs/          # Packs fotográficos
│   │   ├── vehicles/       # Veículos + disponibilidade
│   │   ├── reservations/   # CRUD + status + payment
│   │   ├── payments/       # Stripe PaymentIntents + Webhooks
│   │   ├── orders/         # Carrinho + encomendas + status
│   │   ├── stats/          # Views, favoritos, relatórios
│   │   ├── notifications/  # In-app + conveniência
│   │   ├── common/         # Guards, decorators, pipes
│   │   └── prisma/         # PrismaService global
│   ├── prisma/schema.prisma # 14 models + enums + indexes
│   └── test/               # Jest unit tests (4 modules)
├── frontend/               # Next.js 15 App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/login, register
│   │   │   ├── dashboard/  # Fotógrafo dashboard
│   │   │   ├── auth/       # Auth pages
│   │   │   └── page.tsx    # Landing page completa
│   │   ├── components/ui/  # shadcn/ui components
│   │   ├── lib/            # api.ts, auth-context, utils, types
│   │   └── providers.tsx   # React Query + Theme + Toaster
│   └── tailwind.config.ts  # Design system
├── mobile/                 # Expo 52 + React Native 0.76
│   ├── app/                # Expo Router (Stack + Tabs)
│   │   ├── (auth)/login, register
│   │   ├── (tabs)/events, gallery, profile
│   │   └── _layout.tsx
│   ├── src/
│   │   ├── screens/        # Auth, Events, Gallery
│   │   ├── lib/            # api.ts, auth-context, types
│   │   └── store/auth.ts   # Zustand + SecureStore
│   └── app.json
├── .github/workflows/      # CI/CD (backend, frontend, mobile)
├── docs/prints/            # Screenshots
├── sandro.md               # Fonte de verdade + ToDo
├── ANALISE_EXAUSTIVA.md    # Análise técnica completa
└── README.md
```

---

# 🧭 Fluxo de Desenvolvimento

O desenvolvimento segue as instruções definidas no ficheiro `sandro.md`, que contém:

- Prompt geral do projeto  
- Regras de trabalho  
- ToDo List completa (100% ✅)  
- Prioridades  
- Estrutura de documentação  

---

# 🖼️ PRINTS & DEMONSTRAÇÕES  

---

# 🟦 **BACKEND — PRINTS**

## 📌 Swagger / OpenAPI (`/api`)
- [✅] Print 1 — Lista de endpoints  
- [✅] Print 2 — Autenticação (`docs/prints/swagger_auth.png`)  
- [✅] Print 2.1 — Fotógrafos (`docs/prints/swagger_photographers.png`)  
- [✅] Print 3 — Upload fotos (`docs/prints/swagger_photos.png`)  
- [✅] Print 4 — Reservas  
- [✅] Print 5 — **Pagamentos Stripe**  
- [✅] Print 6 — **Estatísticas**  
- [✅] Print 7 — **Encomendas**  
- [✅] Print 8 — **Notificações**  

## 📌 Base de Dados (Prisma Studio)
- [✅] Print 7 — Users (`docs/prints/swagger_users.png`)  
- [✅] Print 8 — Events (`docs/prints/swagger_events.png`)  
- [✅] Print 9 — Albums (`docs/prints/swagger_albums.png`)  
- [✅] Print 10 — **Reservations**  
- [✅] Print 11 — **Orders + OrderItems**  
- [✅] Print 12 — **Payments**  
- [✅] Print 13 — **Stats + Notifications**  

## 📌 Logs & Monitorização
- [ ] Print 11 — Logs de requests  
- [ ] Print 12 — Dashboard Grafana  

---

# 🟩 **FRONTEND — PRINTS**

## 📌 Landing Page
- [✅] Print 1 — Hero + CTA  
- [✅] Print 2 — Secção Funcionalidades  
- [✅] Print 3 — Secção App Mobile  
- [✅] Print 4 — Stats + Testemunhos  
- [✅] Print 5 — CTA Final + Footer  

## 📌 Autenticação
- [✅] Print 6 — Login (react-hook-form + validação)  
- [✅] Print 7 — Registo (nome, email, password, confirm)  

## 📌 Dashboard do Fotógrafo
- [✅] Print 8 — Overview (stats cards + ações rápidas)  
- [✅] Print 9 — Eventos (lista + criar + publish)  
- [✅] Print 10 — Packs + Veículos  
- [✅] Print 11 — Reservas (pendentes/confirmadas)  
- [✅] Print 12 — Encomendas  
- [✅] Print 13 — Estatísticas (período: semana/mês/ano)  
- [✅] Print 14 — Notificações (sineta + lista)  
- [✅] Print 15 — Definições / Perfil  

## 📌 Galeria Premium (Cliente)
- [✅] Print 16 — Grid responsivo + lazy load  
- [✅] Print 17 — Fullscreen (zoom, navegação teclado)  
- [✅] Print 18 — Favoritos (coração + sincronização)  
- [✅] Print 19 — Seleção para encomenda (checkbox + carrinho)  
- [✅] Print 20 — Checkout Stripe  

---

# 🟧 **APP MOBILE — PRINTS**

## 📌 Autenticação
- [✅] Print 1 — Login (SecureStore + auto-login)  
- [✅] Print 2 — Registo  

## 📌 Eventos
- [✅] Print 3 — Lista eventos (pull-to-refresh + FAB criar)  
- [✅] Print 4 — Detalhe evento (info + álbuns + reservas)  

## 📌 Galeria
- [✅] Print 5 — Grid 3 colunas (thumbnails otimizados)  
- [✅] Print 6 — Fullscreen (swipe, zoom, favorito)  
- [✅] Print 7 — **Anti-screenshot** (FLAG_SECURE Android)  
- [✅] Print 8 — Favoritos (coração + sync backend)  
- [✅] Print 9 — Seleção múltipla (modo seleção + contador)  

## 📌 Notificações
- [✅] Print 10 — Lista notificações (marcar lidas + unread count)  

---

# 🔗 LINKS ONLINE  
*(Serão adicionados assim que existirem deploys.)*

- Produção: `https://fotografo.pt` *(aguarda deploy)*  
- Staging: `https://staging.fotografo.pt` *(aguarda deploy)*  
- Documentação API (Swagger): `https://api.fotografo.pt/api` *(aguarda deploy)*  

---

# 🛠️ Setup Local

## **Pré-requisitos**
- Node.js 22+
- Docker 27+ (ou PostgreSQL 16+ local)
- pnpm / yarn / npm
- Expo CLI (`npm i -g @expo/cli`)
- EAS CLI (`npm i -g eas-cli`)

---

## **Backend**
```bash
cd backend
cp .env.example .env
# Editar .env com DATABASE_URL, JWT_SECRET, STRIPE_*, CLOUDFLARE_*
pnpm install
pnpm prisma generate
pnpm prisma migrate dev
pnpm start:dev
```
Servidor: `http://localhost:3001` | Swagger: `http://localhost:3001/api`

---

## **Frontend**
```bash
cd frontend
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3001
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
pnpm install
pnpm dev
```
App: `http://localhost:3000`

---

## **Mobile**
```bash
cd mobile
cp .env.example .env
# EXPO_PUBLIC_API_URL=http://localhost:3001
pnpm install
pnpm start
# Ou: pnpm android / pnpm ios
```

---

## **Docker (opcional - stack completa)**
```bash
docker-compose up -d
# Inclui: postgres, backend, frontend, (mobile via EAS)
```

---

# 🧪 Testes

| Camada | Ferramenta | Cobertura |
|--------|------------|-----------|
| **Unitários (Backend)** | Jest | Payments, Orders, Stats, Notifications ✅ |
| **Integração** | Prisma + Testcontainers | Pendente |
| **E2E API** | Supertest | Pendente |
| **E2E Frontend** | Playwright | Pendente |
| **E2E Mobile** | Detox | Pendente |

```bash
# Backend
cd backend && pnpm test           # Unit
cd backend && pnpm test:cov       # Coverage
cd backend && pnpm test:e2e       # E2E

# Frontend
cd frontend && pnpm test          # Quando configurado

# Mobile
cd mobile && pnpm test            # Quando configurado
```

---

# 🚀 CI/CD — GitHub Actions

| Workflow | Ficheiro | Triggers |
|----------|----------|----------|
| **Backend CI** | `.github/workflows/backend-ci.yml` | Push `backend/**` |
| **Frontend CI** | `.github/workflows/frontend-ci.yml` | Push `frontend/**` |
| **Mobile CI** | `.github/workflows/mobile-ci.yml` | Push `mobile/**` |

**Backend**: lint → type-check → prisma migrate → unit tests → e2e → Docker build → push GHCR  
**Frontend**: lint → type-check → build → Vercel deploy (main)  
**Mobile**: lint → type-check → EAS Build (Android APK + iOS IPA) → Expo upload  

### Secrets necessários (GitHub → Settings → Secrets → Actions)
| Secret | Descrição |
|--------|-----------|
| `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | Deploy Frontend |
| `EXPO_TOKEN` | EAS Build Mobile |
| `DATABASE_URL` | PostgreSQL (tests + deploy) |
| `JWT_SECRET`, `JWT_REFRESH_SECRET` | Auth |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Pagamentos |
| `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_ACCESS_KEY_ID`, `CLOUDFLARE_SECRET_ACCESS_KEY`, `CLOUDFLARE_R2_BUCKET_NAME` | Storage R2 |
| `FRONTEND_URL`, `NEXT_PUBLIC_API_URL`, `EXPO_PUBLIC_API_URL` | URLs |

---

# 📌 Estado do Projeto  
*(Atualizado: 18/07/2026)*

| Componente | Estado | Detalhes |
|------------|--------|----------|
| **Estrutura inicial** | ✅ | Repo organizado, 3 apps + docs |
| **Backend — Módulos core** | ✅ | 14 módulos (Auth→Notifications) |
| **Backend — Stripe Payments** | ✅ | PaymentIntents, Webhooks, Refunds |
| **Backend — Orders** | ✅ | Carrinho, OrderItems, Status flow |
| **Backend — Stats** | ✅ | Photographer/Event/Photo/Client |
| **Backend — Notifications** | ✅ | CRUD + bulk + conveniência |
| **Backend — Swagger/OpenAPI** | ✅ | Tags, BearerAuth, DTOs decorados |
| **Backend — Testes unitários** | ✅ | 4 suites (Payments, Orders, Stats, Notif) |
| **Prisma Schema** | ✅ | 14 models, enums, indexes, cascades |
| **Frontend — Landing** | ✅ | Hero, features, stats, testimonials, CTA |
| **Frontend — Auth** | ✅ | Login/Register + Zustand + React Query |
| **Frontend — Dashboard** | ✅ | Sidebar, stats, eventos recentes, ações |
| **Frontend — UI Kit** | ✅ | Button, Input, Card, Toast, Avatar |
| **Mobile — Navigation** | ✅ | Stack (auth) + Tabs (main) |
| **Mobile — Auth** | ✅ | SecureStore + auto-login + refresh |
| **Mobile — Events** | ✅ | Lista + detalhe + pull-to-refresh |
| **Mobile — Gallery** | ✅ | Grid 3col, fullscreen, favoritos, seleção |
| **Mobile — Anti-screenshot** | ✅ | FLAG_SECURE Android |
| **CI/CD — Backend** | ✅ | Lint, test, build, Docker, GHCR |
| **CI/CD — Frontend** | ✅ | Lint, type-check, build, Vercel |
| **CI/CD — Mobile** | ✅ | Lint, type-check, EAS Build |
| **Documentação** | ✅ | `sandro.md`, `ANALISE_EXAUSTIVA.md`, `README.md` |

---

# 👤 Autor

**Sandro Pereira**  
Criador e proprietário do projeto.  
GitHub: [@smpsandro1239](https://github.com/smpsandro1239)  
Repositório: [Fotografo](https://github.com/smpsandro1239/Fotografo)

---

> **Nota**: Este README reflete o estado real do código no branch `main`.  
> Para detalhes técnicos profundos, consulte `ANALISE_EXAUSTIVA.md`.  
> Para histórico de decisões e ToDo, consulte `sandro.md`.