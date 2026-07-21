# 📸 Fotógrafo — Plataforma Premium SaaS para Fotógrafos de Eventos

SaaS completo para fotógrafos de eventos: gestão de eventos, packs, veículos, reservas com pagamento Stripe, galerias protegidas com Cloudflare R2, encomendas de fotos, app mobile para clientes, estatísticas avançadas e notificações.

---

## 🏗️ Arquitetura

```
fotografo/
├── backend/          # NestJS 11 + Prisma 6 + PostgreSQL 17 + Stripe + Cloudflare R2
├── frontend/         # Next.js 15 (App Router) + Tailwind v4 + shadcn/ui + Zustand + TanStack Query
├── mobile/           # Expo 52 (expo-router) + React Native 0.76 + SecureStore
├── docs/             # Documentação adicional e prints Swagger
├── docker-compose.yml
└── .env.example
```

---

## 🚀 Stack Tecnológica

| Camada | Tecnologias |
|--------|-------------|
| **Backend** | Node.js 20+, NestJS 11, Prisma 6, PostgreSQL 17, Stripe 22, Cloudflare R2 (S3), Swagger/OpenAPI, bcrypt, JWT |
| **Frontend** | Next.js 15 (App Router), React 19, Tailwind CSS v4, shadcn/ui, Zustand 5, TanStack Query 5, react-hook-form + zod, next-themes |
| **Mobile** | Expo 52 (expo-router 4), React Native 0.76, Zustand 5, TanStack Query 5, expo-secure-store, expo-screen-capture, expo-notifications |
| **DevOps** | GitHub Actions (CI/CD), Docker (multi-stage), Vercel (Frontend), EAS Build (Mobile), Jest 30 |
| **Armazenamento** | Cloudflare R2 (S3-compatível), signed URLs com expiração |
| **Pagamentos** | Stripe (PaymentIntent, Webhooks, Refunds, Customer management) |
| **Email** | Resend / Nodemailer (configurado, pronto a integrar) |

---

## ✨ Funcionalidades Principais

### 🎯 Backend (16 Módulos — ~95% Completo)

| Módulo | Estado | Descrição |
|--------|--------|-----------|
| **Auth** | ✅ | Registo, login, refresh tokens (JWT + bcrypt), Guards + Roles (ADMIN, PHOTOGRAPHER, CLIENT) |
| **Users** | ✅ | CRUD completo, perfil |
| **Photographers** | ✅ | Perfil profissional, bio, website, portfolio |
| **Events** | ✅ | CRUD + publish/unpublish |
| **Albums** | ✅ | CRUD por evento |
| **Photos** | ✅ | CRUD + ownership check, upload Cloudflare R2, signed URLs |
| **Storage** | ✅ | Upload por buffer, validação mime-type (50MB max), signed URLs com expiração, delete, fileExists |
| **Packs** | ✅ | CRUD com preço |
| **Vehicles** | ✅ | CRUD com disponibilidade |
| **Reservations** | ✅ | CRUD + role-based + status transitions (PENDING → CONFIRMED/CANCELLED) |
| **Payments** | ✅ | Stripe PaymentIntent, Webhooks (succeeded/failed/refunded), Refunds, Customer management |
| **Orders** | ✅ | Carrinho multi-item, validação, status transitions, stats |
| **Stats** | ✅ | Photographer/Event/Photo/Client stats, recordStat |
| **Notifications** | ✅ | In-app + convenience methods, bulk create, mark read, unread count |
| **Rate Limiting** | ✅ | @nestjs/throttler (100 req/min por IP) |
| **Config** | ✅ | ConfigModule global (JWT via ConfigService) |
| **Swagger** | ✅ | Documentação completa com tags, BearerAuth, Responses |

### 🌐 Frontend (Next.js 15 — ~95% Completo)

| Componente | Estado | Descrição |
|------------|--------|-----------|
| **Landing Page** | ✅ | Hero, features, stats, testimonials, CTA, footer (410 linhas) |
| **Auth Pages** | ✅ | Login/Register com react-hook-form + zod, loading states, toast erros |
| **Dashboard Layout** | ✅ | Sidebar navegação + Header (hamburger mobile, sino notificações, user dropdown, theme toggle) |
| **Dashboard Page** | ✅ | Stats cards, eventos recentes, ações rápidas |
| **CRUD Eventos** | ✅ | Listar, criar, editar, eliminar com confirmação |
| **CRUD Álbuns** | ✅ | Listar por evento, criar, gerir fotos |
| **Upload Fotos** | ✅ | Upload múltiplo com preview, grid responsivo |
| **Galeria Premium** | ✅ | Grid 2-4 colunas, fullscreen modal, eliminar |
| **Packs** | ✅ | CRUD com dialog |
| **Veículos** | ✅ | CRUD com dialog |
| **Reservas** | ✅ | Listar, confirmar, cancelar, tabs filtro, detalhe com integração Stripe |
| **Encomendas** | ✅ | Listar, tabs filtro, dropdown estado |
| **Notificações** | ✅ | Tabs Não Lidas/Todas, mark read, mark all read |
| **22 Hooks TanStack** | ✅ | useEvents, useAlbums, usePhotos, usePacks, useReservations, useOrders, useNotifications, etc. |
| **Zustand Stores** | ✅ | UI (sidebar), Filtros (event, album, reservation, order) |
| **Error Boundary** | ✅ | Fallback em português + botão retry |
| **Página 404** | ✅ | Design consistente |
| **Dark Mode** | ✅ | next-themes (light/dark/system) |
| **18 shadcn/ui** | ✅ | Button, Input, Card, Dialog, Table, Tabs, Select, Badge, Skeleton, etc. |

### 📱 Mobile (Expo 52 — ~95% Completo)

| Componente | Estado | Descrição |
|------------|--------|-----------|
| **Auth Login** | ✅ | Formulário com validação, loading states |
| **Auth Register** | ✅ | Formulário com confirmação password |
| **Tab Layout** | ✅ | 3 tabs: Eventos, Galeria, Perfil |
| **Tela Eventos** | ✅ | Lista com pull-to-refresh, EventCard |
| **Tela Detalhe Evento** | ✅ | Hero section, álbuns, botão reservar |
| **Tela Galeria** | ✅ | Grid 3 colunas, album selector, pull-to-refresh |
| **Foto Fullscreen** | ✅ | Imagem ecrã inteiro, Share API |
| **Tela Perfil** | ✅ | Avatar, stats por role, logout com confirmação |
| **Tela Configurações** | ✅ | Conta, notificações, tema, sobre |
| **5 Componentes UI** | ✅ | EventCard, PhotoGrid, EmptyState, LoadingSpinner, Avatar |
| **Anti-screenshot** | ✅ | expo-screen-capture em vistas sensíveis |
| **Push Notifications** | ✅ | expo-notifications + registro de token |
| **API Client** | ✅ | Todos endpoints tipados com SecureStore |
| **Auth Context** | ✅ | SecureStore + refresh automático |

### 🔧 DevOps (~90% Completo)

| Componente | Estado | Descrição |
|------------|--------|-----------|
| **Dockerfile** | ✅ | Multi-stage build (builder + runner) |
| **docker-compose.yml** | ✅ | PostgreSQL 17 + Backend + Frontend |
| **Backend CI/CD** | ✅ | Lint → Test → Prisma migrate → Docker build + push GHCR |
| **Frontend CI/CD** | ✅ | Lint → Typecheck → Build → Vercel deploy |
| **Mobile CI/CD** | ✅ | Lint → Typecheck → EAS Build Android + iOS |
| **Seed Script** | ✅ | 4 users, 3 eventos, 3 álbuns, 3 packs, 3 vehicles, reserv, notificações |
| **Testes Unitários** | ✅ | Auth + Payments (5 testes, todos a passar) |

---

## 📦 Instalação Rápida

### Pré-requisitos
- Node.js 20+
- PostgreSQL 17+ (ou Docker)
- Docker + Docker Compose (opcional, para dev local)
- Expo CLI (`npm i -g expo-cli`) para mobile
- Stripe CLI (`stripe login`) para webhooks locais

### Opção 1: Docker Compose (Recomendado)

```bash
# 1. Clonar o repositório
git clone https://github.com/smpsandro1239/Fotografo.git
cd Fotografo

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com as suas credenciais

# 3. Iniciar todos os serviços
docker-compose up -d

# 4. Correr migrations + seed
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma db seed

# 5. Aceder
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# Swagger: http://localhost:3001/api
```

### Opção 2: Setup Manual

#### Backend
```bash
cd backend
cp .env.example .env        # Edite com suas credenciais
npm install
npx prisma generate
npx prisma migrate dev      # Cria tabelas
npx prisma db seed           # Dados de demonstração (opcional)
npm run start:dev           # http://localhost:3001/api (Swagger)
```

#### Frontend
```bash
cd frontend
cp .env.example .env.local  # Edite NEXT_PUBLIC_API_URL
npm install
npm run dev                 # http://localhost:3000
```

#### Mobile
```bash
cd mobile
cp .env.example .env        # Edite EXPO_PUBLIC_API_URL
npm install
npx expo start              # QR code no terminal → Expo Go no telemóvel
```

---

## 🔐 Contas de Demonstração (Seed)

| Tipo | Email | Password |
|------|-------|----------|
| Admin | admin@fotografo.com | password123 |
| Fotógrafo | fotografo@fotografo.com | password123 |
| Cliente 1 | cliente1@fotografo.com | password123 |
| Cliente 2 | cliente2@fotografo.com | password123 |

---

## 🗄️ Schema Prisma (Resumo)

```prisma
User (ADMIN | PHOTOGRAPHER | CLIENT)
  └── 1:1 Photographer
        └── 1:N Event
              ├── 1:N Album → 1:N Photo (R2 signed URLs, stats)
              └── 1:N Reservation (PENDING | CONFIRMED | CANCELLED)
                    └── Payment (Stripe PaymentIntent)
        ├── 1:N Pack
        │     └── 1:N Vehicle
        ├── 1:N Order → 1:N OrderItem (PHOTO | ALBUM | PACK | PRINT | DIGITAL_DOWNLOAD)
        │     └── Payment
        └── 1:N Stat (VIEW | FAVORITE | DOWNLOAD | SHARE)

User → 1:N Notification (type, read, data JSON)
```

---

## 🔐 Variáveis de Ambiente

| Serviço | Variáveis Obrigatórias |
|---------|------------------------|
| **Backend** | `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `FRONTEND_URL`, `CORS_ORIGINS`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_ACCESS_KEY_ID`, `CLOUDFLARE_SECRET_ACCESS_KEY`, `CLOUDFLARE_R2_BUCKET_NAME`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| **Frontend** | `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_R2_HOSTNAME` |
| **Mobile** | `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` |
| **Opcional** | `RESEND_API_KEY`, `EMAIL_FROM` (email), `NEXT_PUBLIC_GA_ID` (analytics) |

> Consulte `.env.example` na raiz e em cada subpasta para a lista completa.

---

## 🧪 Testes

```bash
# Backend - Unitários
cd backend
npm run test

# Backend - E2E
npm run test:e2e

# Backend - Cobertura
npm run test:cov
```

---

## 🚢 CI/CD (GitHub Actions)

| Workflow | Trigger | Jobs |
|----------|---------|------|
| **backend-ci.yml** | push `backend/**` | lint → test → prisma migrate → Docker build + push GHCR |
| **frontend-ci.yml** | push `frontend/**` | lint → type-check → build → deploy Vercel |
| **mobile-ci.yml** | push `mobile/**` | lint → type-check → EAS Build Android + iOS |

### Secrets necessários no GitHub

| Secret | Descrição |
|--------|-----------|
| `VERCEL_TOKEN` | Token de deploy Vercel |
| `VERCEL_ORG_ID` | ID da organização Vercel |
| `VERCEL_PROJECT_ID` | ID do projeto Vercel |
| `EXPO_TOKEN` | Token EAS Build |
| `DATABASE_URL` | URL da base de dados |
| `JWT_SECRET` | Segredo JWT |
| `STRIPE_SECRET_KEY` | Chave secreta Stripe |
| `STRIPE_WEBHOOK_SECRET` | Segredo webhook Stripe |
| `CLOUDFLARE_ACCESS_KEY_ID` | Chave de acesso R2 |
| `CLOUDFLARE_SECRET_ACCESS_KEY` | Segredo R2 |

---

## 📁 Estrutura de Pastas Detalhada

```
backend/
├── src/
│   ├── auth/              # JWT, Guards, Strategies, DTOs
│   ├── users/             # CRUD users
│   ├── photographers/     # Perfil fotógrafo
│   ├── events/            # Eventos + publish
│   ├── albums/            # Álbuns
│   ├── photos/            # Upload R2, signed URLs
│   ├── storage/           # Cloudflare R2 service (206 linhas)
│   ├── packs/             # Packs + pricing
│   ├── vehicles/          # Veículos + disponibilidade
│   ├── reservations/      # CRUD + status transitions
│   ├── orders/            # Carrinho + items + estados
│   ├── payments/          # Stripe service + webhooks + refunds
│   ├── stats/             # Agregações + recordStat
│   ├── notifications/     # In-app + convenience methods
│   ├── common/            # Guards, decorators, pipes
│   ├── prisma/            # PrismaService
│   ├── app.module.ts      # Root module (16 módulos)
│   └── main.ts            # Swagger + CORS + ValidationPipe + raw body
├── prisma/
│   ├── schema.prisma      # 12 models, 6 enums
│   └── seed.ts            # Dados de demonstração
├── Dockerfile             # Multi-stage build
├── test/                  # Unit + E2E
└── package.json

frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout + Providers
│   │   ├── page.tsx           # Landing page (410 linhas)
│   │   ├── not-found.tsx      # Página 404
│   │   ├── providers.tsx      # TanStack Query + next-themes + Toaster
│   │   ├── auth/
│   │   │   ├── layout.tsx     # Layout centralizado
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   └── dashboard/
│   │       ├── layout.tsx     # Sidebar + Header
│   │       ├── page.tsx       # Stats + eventos recentes
│   │       ├── events/        # CRUD completo
│   │       ├── albums/        # CRUD + upload fotos
│   │       ├── photos/        # Galeria premium
│   │       ├── packs/         # CRUD packs
│   │       ├── vehicles/      # CRUD veículos
│   │       ├── reservations/  # Reservas + Stripe
│   │       ├── orders/        # Encomendas
│   │       └── notifications/ # Notificações
│   ├── components/
│   │   ├── ui/            # 18 componentes shadcn/ui
│   │   ├── layout/        # Sidebar, Header
│   │   └── error-boundary.tsx
│   ├── hooks/
│   │   └── use-api.ts     # 22 hooks TanStack Query
│   ├── stores/
│   │   ├── ui.ts          # Sidebar state
│   │   └── filters.ts     # Filtros globais
│   └── lib/
│       ├── api.ts         # API client (235 linhas)
│       ├── auth-context.tsx # Zustand auth store
│       ├── types.ts       # Tipos TypeScript
│       └── utils.ts       # cn, formatPrice, formatDate, etc.
├── next.config.ts         # Images remotePatterns (R2)
├── tailwind.config.ts
├── components.json        # shadcn/ui config
└── package.json

mobile/
├── app/
│   ├── _layout.tsx        # Root Stack + AuthProvider
│   ├── (tabs)/
│   │   ├── _layout.tsx    # Tab layout (Eventos, Galeria, Perfil)
│   │   ├── events.tsx     # Lista eventos
│   │   ├── gallery.tsx    # Grid fotos
│   │   └── profile.tsx    # Perfil + stats
│   ├── auth/
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── styles.ts
│   ├── events/[id].tsx    # Detalhe evento
│   ├── gallery/photo.tsx  # Foto fullscreen
│   └── settings/index.tsx # Configurações
├── src/
│   ├── components/
│   │   ├── EventCard.tsx
│   │   ├── PhotoGrid.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Avatar.tsx
│   │   └── ScreenshotProtect.tsx
│   └── lib/
│       ├── api.ts         # API client com SecureStore
│       ├── auth-context.tsx # AuthProvider + SecureStore
│       ├── types.ts       # Tipos TypeScript
│       └── notifications.ts # Push notifications
├── app.json
├── eas.json
└── package.json

docs/
├── archive/
│   └── agente.md          # Histórico de conversas
└── prints/                # Screenshots Swagger UI

.github/workflows/
├── backend-ci.yml
├── frontend-ci.yml
└── mobile-ci.yml
```

---

## 📚 Documentação

- **Swagger UI**: `http://localhost:3001/api` (quando backend a correr)
- `docs/prints/` — Screenshots do Swagger UI
- `.env.example` — Variáveis de ambiente documentadas

---

## 🔄 Fluxo de Trabalho (User Journey)

### Fotógrafo
1. Regista conta → Role PHOTOGRAPHER
2. Cria evento → Adiciona álbuns → Faz upload de fotos
3. Configura packs com preços
4. Publica evento → Clientes podem reservar
5. Recebe reservas → Confirma → Cria pagamento Stripe
6. Clientes compram fotos → Encomendas criadas
7. Visualiza estatísticas (views, downloads, receita)

### Cliente
1. Regista conta → Role CLIENT
2. navega eventos públicos
3. Reserva evento → Paga via Stripe
4. Vê galeria de fotos do evento
5. Seleciona fotos → Cria encomenda → Paga
6. Recebe notificações

---

## 🤝 Contribuir

1. Fork → Branch (`feat/nova-funcionalidade`)
2. Commit atómico em pt-PT (`feat: adicionar validação de mime-type no upload`)
3. PR → Review → Merge

### Convenções de Commit
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `refactor`: Refatoração sem alterar comportamento
- `test`: Adicionar testes
- `chore`: Tarefas de manutenção
- `ci`: Alterações nos workflows CI/CD

---

## 📄 Licença

Proprietário — Sandro Pereira. Todos os direitos reservados.

---

## 👤 Autor

**Sandro Pereira**
Criador e proprietário do projeto.
GitHub: [@smpsandro1239](https://github.com/smpsandro1239)

---

> **Nota:** Este é um projeto SaaS de nível produção. Certifique-se de configurar todas as variáveis de ambiente, secrets, webhooks Stripe e domínios personalizados antes de ir para produção.
