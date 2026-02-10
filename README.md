# 📸 Plataforma Premium para Fotógrafos  
### Desenvolvido por **Sandro Pereira**

Este repositório contém o código-fonte completo da plataforma SaaS premium para fotógrafos, incluindo:

- Backend (NestJS + Prisma + PostgreSQL + Stripe + Cloudflare R2/Images)
- Frontend Web (Next.js + Tailwind + shadcn/ui)
- App Mobile (React Native + Expo)
- Infraestrutura DevOps (CI/CD, monitorização, logs, segurança)

---

# 🚀 Objetivo do Projeto

Criar a plataforma mais completa, moderna e premium para fotógrafos de eventos, permitindo:

- Gestão de eventos  
- Packs e veículos  
- Reservas com pagamento  
- Galerias protegidas  
- Encomendas de fotos  
- App mobile para clientes  
- Estatísticas avançadas  
- Notificações  
- Experiência de luxo para fotógrafos e clientes  

---

# 🧠 Arquitetura Geral

## **Backend**
- Node.js 22+
- NestJS 11+
- Prisma 6+
- PostgreSQL 17+
- Stripe API 2024+
- Cloudflare R2 + Images

## **Frontend**
- Next.js 14+ (App Router)
- React 18+
- TailwindCSS 3.4+
- shadcn/ui
- React Query 5+
- Zustand 5+

## **Mobile**
- React Native 0.74+
- Expo SDK 51+
- Expo Router 3+
- MMKV
- React Query 5+

## **Infra**
- Docker 27+
- GitHub Actions
- EAS Build
- Grafana + Loki
- Cloudflare CDN

---

# 📂 Estrutura do Repositório

- `/backend`: Core API e Lógica de Negócio
- `/frontend`: Interface Web (Next.js)
- `/mobile`: Aplicação Mobile (Expo)
- `/docs`: Documentação Adicional
- `sandro.md`: Fonte de Verdade e ToDo List
- `README.md`: Este ficheiro

---

# 🧭 Fluxo de Desenvolvimento

O desenvolvimento segue as instruções definidas no ficheiro `sandro.md`, que contém:

- Prompt geral do projeto  
- Regras de trabalho  
- ToDo List completa  
- Prioridades  
- Estrutura de documentação  

---

# 🖼️ PRINTS & DEMONSTRAÇÕES  
*(Esta secção será atualizada continuamente com prints gerados durante o desenvolvimento.)*

---

# 🟦 **BACKEND — PRINTS**

## 📌 Swagger / OpenAPI
- [✅] Print 1 — Lista de endpoints
- [✅] Print 2 — Endpoint de autenticação (ver docs/prints/swagger_auth.png)
- [✅] Print 2.1 — Endpoint de fotógrafos (ver docs/prints/swagger_photographers.png)
- [✅] Print 3 — Endpoint de upload de fotos (ver docs/prints/swagger_photos.png)
- [✅] Print 4 — Endpoint de reservas
- [ ] Print 5 — Endpoint de pagamentos  
- [ ] Print 6 — Endpoint de estatísticas  

## 📌 Base de Dados (Prisma Studio)
- [✅] Print 7 — Tabela Users (ver docs/prints/swagger_users.png)
- [✅] Print 8 — Tabela Events (ver docs/prints/swagger_events.png)
- [✅] Print 9 — Tabela Albums (ver docs/prints/swagger_albums.png)
- [ ] Print 10 — Tabela Reservations  

## 📌 Logs & Monitorização
- [ ] Print 11 — Logs de requests  
- [ ] Print 12 — Dashboard Grafana  

---

# 🟩 **FRONTEND — PRINTS**

## 📌 Landing Page
- [ ] Print 1 — Hero  
- [ ] Print 2 — Secção Packs  
- [ ] Print 3 — Secção App Mobile  
- [ ] Print 4 — Footer  

## 📌 Autenticação
- [ ] Print 5 — Login  
- [ ] Print 6 — Registo  

## 📌 Dashboard do Fotógrafo
- [ ] Print 7 — Overview  
- [ ] Print 8 — Eventos  
- [ ] Print 9 — Packs  
- [ ] Print 10 — Veículos  
- [ ] Print 11 — Reservas  
- [ ] Print 12 — Encomendas  
- [ ] Print 13 — Estatísticas  

## 📌 Galeria Premium
- [ ] Print 14 — Grid  
- [ ] Print 15 — Fullscreen  
- [ ] Print 16 — Favoritos  
- [ ] Print 17 — Seleção de fotos  

---

# 🟧 **APP MOBILE — PRINTS**

## 📌 Autenticação
- [ ] Print 1 — Login  
- [ ] Print 2 — Registo  

## 📌 Eventos
- [ ] Print 3 — Lista de eventos  
- [ ] Print 4 — Detalhe do evento  

## 📌 Galeria
- [ ] Print 5 — Grid  
- [ ] Print 6 — Fullscreen  
- [ ] Print 7 — Anti‑screenshot ativo  
- [ ] Print 8 — Favoritos  
- [ ] Print 9 — Seleção  

## 📌 Notificações
- [ ] Print 10 — Lista de notificações  

---

# 🔗 LINKS ONLINE  
*(Serão adicionados assim que existirem deploys.)*

- Produção: *(aguarda deploy)*  
- Staging: *(aguarda deploy)*  
- Documentação API: *(aguarda deploy)*  

---

# 🛠️ Setup Local

## **Pré-requisitos**
- Node.js 22+
- Docker 27+
- PostgreSQL 17+
- Yarn ou PNPM
- Expo CLI

---

## **Backend**
```bash
cd backend
cp .env.example .env
yarn install
yarn prisma migrate dev
yarn start:dev
```

## **Frontend**
```bash
cd frontend
cp .env.example .env
yarn install
yarn dev
```

## **Mobile**
```bash
cd mobile
cp .env.example .env
yarn install
expo start
```

---

# 🧪 Testes

- **Unitários:** Jest
- **Integração:** Prisma + Testcontainers
- **E2E API:** Supertest
- **E2E Frontend:** Playwright
- **E2E Mobile:** Detox

---

# 📌 Estado do Projeto
*(Atualizado automaticamente durante o desenvolvimento)*

- Estrutura inicial: ✅
- Backend configurado: ✅
- Frontend configurado: ✅
- Mobile configurado: ✅
- CI/CD: ❌
- Deploy: ❌

---

# 👤 Autor
**Sandro Pereira**
Criador e proprietário do projeto.
