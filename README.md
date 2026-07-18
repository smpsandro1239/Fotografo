# 📸 Plataforma Premium para Fotógrafos

SaaS completo para fotógrafos de eventos: gestão de eventos, packs, veículos, reservas com pagamento, galerias protegidas, encomendas de fotos, app mobile para clientes, estatísticas avançadas e notificações.

---

## 🏗️ Arquitetura

```
fotografo/
├── backend/          # NestJS 11 + Prisma 6 + PostgreSQL + Stripe + Cloudflare R2
├── frontend/         # Next.js 15 (App Router) + Tailwind v4 + shadcn/ui + Zustand + React Query
├── mobile/           # Expo 52 (expo-router) + React Native 0.76 + SecureStore
└── docs/             # Documentação adicional
```

---

## 🚀 Stack Tecnológica

| Camada | Tecnologias |
|--------|-------------|
| **Backend** | Node.js 22+, NestJS 11, Prisma 6, PostgreSQL 17, Stripe, Cloudflare R2 (S3), Swagger/OpenAPI |
| **Frontend** | Next.js 15 (App Router), React 19, Tailwind CSS v4, shadcn/ui, Zustand, TanStack Query, next-themes |
| **Mobile** | Expo 52 (expo-router), React Native 0.76, React 18, Zustand, TanStack Query, SecureStore |
| **DevOps** | GitHub Actions (CI/CD), Docker, Vercel (Frontend), EAS Build (Mobile), ESLint, Prettier, Jest |

---

## ✨ Funcionalidades Principais

### 🎯 Backend (12 Módulos)
- **Auth** – Registo, login, refresh tokens (JWT + bcrypt), Guards + Roles (ADMIN, PHOTOGRAPHER, CLIENT)
- **Users / Photographers** – Perfis, CRUD completo
- **Events / Albums / Photos** – Ciclo de vida completo + upload Cloudflare R2 (signed URLs, validação mime/size, public/private)
- **Packs / Vehicles** – Packs fotográficos com preços + veículos com disponibilidade
- **Reservations** – CRUD + estados (PENDING → CONFIRMED/CANCELLED) + pagamentos
- **Orders** – Carrinho multi-item (fotos/álbuns/packs/prints) + estados + pagamentos
- **Payments (Stripe)** – PaymentIntents, Checkout Sessions, Webhooks (succeeded/failed/refunded), Reembolsos
- **Stats** – Views, favoritos, downloads, revenue, conversão, top photos/events
- **Notifications** – In-app + email (Resend/Nodemailer), bulk create, mark read, unread count
- **Swagger/OpenAPI** – Documentação completa com tags, Bearer auth, validação

### 🌐 Frontend (Next.js 15)
- **Landing Page** – Hero, features, stats, testimonials, CTA, footer
- **Auth** – Login/Register com react-hook-form + validação, protected routes
- **Dashboard Fotógrafo** – Sidebar, stats cards, quick actions, eventos recentes
- **UI Components** – Button, Input, Card, Toast, Avatar, Dialog, etc. (shadcn/ui)
- **AuthContext (Zustand)** – Login/register/logout/refresh automático, persistência localStorage
- **API Client** – Axios/TanStack Query com endpoints tipados para todos os módulos
- **Tailwind v4** – Design system (cores, fonts, animações, dark mode via next-themes)

### 📱 Mobile (Expo 52 + expo-router)
- **Navigation** – Stack (auth) + Tabs (main: Events, Gallery, Profile) + modais
- **Auth** – Login/Register com SecureStore, auto-check auth on load
- **Events** – Lista + detalhe + pull-to-refresh + criar evento
- **Gallery** – Grid 3 colunas, fullscreen, favoritos, seleção multipla, anti-screenshot ready
- **AuthContext (Zustand + SecureStore)** – Login/register/logout/refresh, auto-restore
- **API Client** – Typed endpoints para todos os módulos backend
- **Types** – Tipos TypeScript sincronizados com backend (Prisma ↔ Mobile)

---

## 📦 Instalação Rápida

### Pré-requisitos
- Node.js 22+
- PostgreSQL 17+
- Docker (opcional)
- Expo CLI (`npm i -g expo-cli`)
- Stripe CLI (`stripe login`) para webhooks locais

### Backend
```bash
cd backend
cp .env.example .env        # Edite com suas credenciais
npm install
npx prisma migrate dev      # Cria tabelas + seed opcional
npm run start:dev           # http://localhost:3001/api (Swagger)
```

### Frontend
```bash
cd frontend
cp .env.example .env.local  # Edite NEXT_PUBLIC_API_URL
npm install
npm run dev                 # http://localhost:3000
```

### Mobile
```bash
cd mobile
cp .env.example .env        # Edite EXPO_PUBLIC_API_URL
npm install
npx expo start              # QR code no terminal → Expo Go no telemóvel
```

---

## 🗄️ Schema Prisma (Resumo)

```prisma
User (ADMIN | PHOTOGRAPHER | CLIENT)
  ↓ 1:1
Photographer
  ↓ 1:N
Event → Album → Photo (R2 signed URLs, stats)
  ↓ 1:N
Reservation (PENDING | CONFIRMED | CANCELLED)
  ↓ 1:1
Payment (Stripe PaymentIntent)
Pack → Vehicle
Order → OrderItem (PHOTO | ALBUM | PACK | PRINT | DIGITAL_DOWNLOAD)
  ↓ 1:1
Payment
Stat (VIEW | FAVORITE | DOWNLOAD | SHARE)
Notification (type, read, data JSON)
```

---

## 🔐 Variáveis de Ambiente Obrigatórias

| Serviço | Variáveis |
|---------|-----------|
| **Backend** | `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `FRONTEND_URL`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_ACCESS_KEY_ID`, `CLOUDFLARE_SECRET_ACCESS_KEY`, `CLOUDFLARE_R2_BUCKET_NAME`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| **Frontend** | `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |
| **Mobile** | `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` |

> Consulte `.env.example` em cada pasta para lista completa.

---

## 🧪 Testes

```bash
# Backend
cd backend
npm run test          # Unitários (Jest)
npm run test:e2e      # E2E (Supertest)
npm run test:cov      # Cobertura

# Frontend
cd frontend
npm run test          # Jest + React Testing Library
npm run test:e2e      # Playwright

# Mobile
cd mobile
npm run test          # Jest + React Native Testing Library
npm run test:e2e      # Detox
```

---

## 🚢 CI/CD (GitHub Actions)

| Workflow | Trigger | Jobs |
|----------|---------|------|
| **backend-ci.yml** | push `backend/**` | lint → test → prisma migrate → build Docker |
| **frontend-ci.yml** | push `frontend/**` | lint → type-check → build → deploy Vercel |
| **mobile-ci.yml** | push `mobile/**` | lint → type-check → EAS Build (Android/iOS) |

Configure os **secrets** no GitHub:
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- `EXPO_TOKEN`
- `DATABASE_URL`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, etc.

---

## 📁 Estrutura de Pastas (Resumo)

```
backend/
├── src/
│   ├── auth/           # JWT, Guards, Strategies, DTOs
│   ├── users/          # CRUD users
│   ├── photographers/  # Perfil fotógrafo
│   ├── events/         # Eventos + publish
│   ├── albums/         # Álbuns
│   ├── photos/         # Upload R2, signed URLs
│   ├── storage/        # Cloudflare R2 service
│   ├── packs/          # Packs + vehicles
│   ├── vehicles/       # Veículos
│   ├── reservations/   # CRUD + status
│   ├── orders/         # Carrinho + items
│   ├── payments/       # Stripe service + webhooks
│   ├── stats/          # Agregações + recordStat
│   ├── notifications/  # In-app + email
│   ├── common/         # Guards, decorators, pipes
│   ├── prisma/         # PrismaService
│   ├── app.module.ts
│   └── main.ts         # Swagger + CORS + ValidationPipe
├── prisma/schema.prisma
└── test/               # Unit + E2E

frontend/
├── src/
│   ├── app/            # App Router (layout, page, auth/, dashboard/)
│   ├── components/     # ui/, forms/, layout/, photos/
│   ├── lib/            # api.ts, auth-context.tsx, utils.ts, types.ts
│   └── styles/         # globals.css (Tailwind v4)
├── tailwind.config.ts
└── .env.example

mobile/
├── app/                # expo-router (auth/, (tabs)/, events/, gallery/)
├── src/
│   ├── screens/        # auth/, events/, gallery/, photos/, profile/
│   ├── components/     # ui/, forms/, layout/
│   ├── lib/            # api.ts, auth-context.tsx, types.ts
│   └── store/          # Zustand stores
├── .env.example
└── app.json
```

---

## 📚 Documentação

- `backend/README.md` – Setup backend detalhado
- `frontend/README.md` – Setup frontend detalhado
- `mobile/README.md` – Setup mobile detalhado
- `docs/` – Diagramas, decisões de arquitetura, guias
- Swagger UI: `http://localhost:3001/api` (quando backend a correr)

---

## 🤝 Contribuir

1. Fork → Branch (`feat/nova-funcionalidade`)
2. Commit atómico em pt-PT (`feat: adicionar validação de mime-type no upload`)
3. PR → Review → Merge

---

## 📄 Licença

Proprietário – Sandro Pereira. Todos os direitos reservados.

---

## 👤 Autor

**Sandro Pereira**  
Criador e proprietário do projeto.  
GitHub: [@smpsandro1239](https://github.com/smpsandro1239)

---

> **Nota:** Este é um projeto SaaS de nível produção. Certifique-se de configurar todas as variáveis de ambiente, secrets, webhooks Stripe e domínios personalizados antes de ir para produção.