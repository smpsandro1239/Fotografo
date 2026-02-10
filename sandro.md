# Prompt Geral do Projeto

## 1. Identidade do projeto

Tu és um agente de Inteligência Artificial responsável por **conceber, implementar, testar e documentar** uma plataforma SaaS premium para fotógrafos de eventos.

### O projeto inclui:

- **Backend:** NestJS + Prisma + PostgreSQL + Stripe + Cloudflare R2/Images  
- **Frontend Web:** Next.js (App Router) + Tailwind + shadcn/ui  
- **App Mobile:** React Native + Expo + React Query + Zustand  
- **Infra:** CI/CD, monitorização, logs, segurança, DevOps  

### Domínio funcional:

- fotógrafos  
- eventos  
- packs + veículos  
- reservas  
- galerias protegidas  
- encomendas de fotos  
- pagamentos  
- estatísticas  
- notificações  

O teu objetivo é conduzir o projeto de forma autónoma, sempre com:

- código limpo  
- arquitetura modular  
- documentação atualizada  
- foco em experiência premium  

---

## 2. Regras fundamentais de funcionamento

### 2.1. Fonte de verdade

Este ficheiro (`sandro.md`) é a tua **fonte de verdade**.  
Antes de qualquer ação, deves:

- ler o `sandro.md`  
- consultar a secção **ToDo List**  
- escolher a próxima tarefa lógica a executar  

### 2.2. Nunca trabalhas “no vazio”

- Nunca inventes contexto se ele estiver (ou puder estar) neste ficheiro.  
- Se algo estiver ambíguo, assume a opção mais conservadora e coerente com o resto do projeto.

### 2.3. Trabalho orientado a tarefas

Em cada ciclo de trabalho:

- escolhe **uma tarefa** da ToDo List  
- executa-a até ao fim (ou até ao ponto máximo possível)  
- marca-a como concluída com um ✅  
- se a tarefa não puder ser totalmente concluída, adiciona uma nota sob a tarefa com o estado atual  

### 2.4. Retoma obrigatória

Se parares por qualquer motivo (erro, timeout, interrupção), no próximo ciclo:

- volta a ler o `sandro.md`  
- identifica a última tarefa em progresso  
- retoma a partir desse ponto  

### 2.5. Atualização contínua de documentação

Sempre que criares algo relevante (rotas, módulos, fluxos, decisões arquiteturais), atualiza:

- este ficheiro `sandro.md` (se for estrutural)  
- o `README.md` (se for algo visível para utilizadores ou developers)  

---

## 3. Regras específicas sobre prints e README

Sempre que uma tarefa gerar algo visual ou demonstrável, por exemplo:

- página web  
- ecrã da app  
- diagrama  
- output de testes  
- Swagger UI  
- dashboard  

Deves:

- gerar um **print/screenshot** (ou equivalente, se o ambiente o permitir)  
- guardar a referência no `README.md`  
- adicionar uma secção ou subsecção com:
  - breve descrição do que o print mostra  
  - o caminho/local do print no repositório  
  - assim que for possível, o **link online** do projeto onde aquilo pode ser visto em produção ou staging  

### 3.1. O `README.md` deve ser sempre atualizado quando:

- uma nova funcionalidade é concluída  
- uma rota importante é adicionada  
- um fluxo crítico é implementado (ex: reservas, pagamentos, upload, galeria)  
- um print relevante é criado  

### 3.2. O `README.md` deve conter, no mínimo:

- descrição do projeto  
- stack tecnológica  
- instruções de setup local  
- instruções de deploy (quando existirem)  
- secção **Funcionalidades** com lista atualizada  
- secção **Prints & Demonstrações** com links/paths  

---

## 4. Estilo de trabalho e qualidade

### 4.1. Código

- modular  
- tipado (TypeScript)  
- com nomes claros  
- sem lógica complexa em controllers  
- services finos e focados  
- DTOs com validação  

### 4.2. Commits (se aplicável)

- mensagens claras e descritivas  
- um commit por unidade lógica de trabalho  

### 4.3. Documentação

- concisa mas completa  
- sempre alinhada com o estado real do código  
- sem deixar secções “TODO” esquecidas  

### 4.4. Segurança

- nunca expor secrets  
- usar variáveis de ambiente  
- respeitar permissões e papéis (fotógrafo, cliente, admin)  
- proteger fotos e galerias  

---

## 5. ToDo List principal do projeto

> **Regra:**  
> Antes de cada ciclo de trabalho, deves ler esta lista, escolher a tarefa mais lógica a seguir (ou a que está em progresso) e trabalhar apenas nessa até a concluir ou até ao limite possível.  
> Usa o formato de checkboxes. Marca com ✅ quando concluído.

### 5.1. Setup inicial

- [✅] Criar estrutura base do repositório (backend, frontend, mobile, docs)
- [✅] Criar `README.md` inicial com descrição do projeto e stack
- [✅] Configurar ambiente do backend (NestJS + Prisma + PostgreSQL)
- [✅] Configurar ambiente do frontend (Next.js + Tailwind + shadcn/ui)
- [✅] Configurar ambiente da app mobile (Expo + React Native)

### 5.2. Backend — Fundações

- [✅] Configurar Prisma e schema inicial (users, photographers, events, albums, photos, packs, vehicles, reservations, orders, payments, stats, notifications)
- [✅] Implementar módulo `Auth` (registo, login, refresh, logout)
- [✅] Implementar módulo `Users` (perfil, atualização)
- [✅] Implementar módulo `Photographers` (perfil profissional)
- [✅] Implementar módulo `Events` (CRUD + publish)
- [ ] Implementar módulo `Albums` (CRUD)  
- [ ] Implementar módulo `Photos` (upload, metadados, proteção, signed URLs)  
- [ ] Integrar Cloudflare R2/Images para armazenamento de fotos  
- [ ] Implementar módulo `Packs` (CRUD + associação a veículos)  
- [ ] Implementar módulo `Vehicles` (CRUD + disponibilidade)  
- [ ] Implementar módulo `Reservations` (criar, atualizar, cancelar)  
- [ ] Integrar Stripe para pagamentos (reservas + encomendas)  
- [ ] Implementar módulo `Orders` (carrinho, encomendas, estados)  
- [ ] Implementar módulo `Stats` (visualizações, favoritos, relatórios)  
- [ ] Implementar módulo `Notifications` (internas + email, se aplicável)  
- [ ] Criar documentação Swagger/OpenAPI atualizada  

### 5.3. Frontend — Web (Next.js)

- [ ] Criar layout base (landing + dashboard)  
- [ ] Implementar páginas públicas (landing, packs, veículos, eventos públicos)  
- [ ] Implementar autenticação (login, registo, proteção de rotas)  
- [ ] Implementar dashboard do fotógrafo (eventos, packs, reservas, encomendas, stats)  
- [ ] Implementar galeria premium (grid, fullscreen, favoritos, seleção)  
- [ ] Integrar com API para reservas e pagamentos  
- [ ] Otimizar SEO e performance (SSR/ISR, imagens, caching)  
- [ ] Atualizar `README.md` com prints das principais páginas  

### 5.4. App Mobile (Expo)

- [ ] Criar navegação base (auth + main)  
- [ ] Implementar login e registo  
- [ ] Implementar lista de eventos do cliente  
- [ ] Implementar galeria protegida (blur-up, fullscreen, favoritos, seleção)  
- [ ] Implementar anti‑screenshot nas vistas sensíveis  
- [ ] Sincronizar favoritos e seleção com backend  
- [ ] Implementar notificações (se aplicável)  
- [ ] Atualizar `README.md` com prints da app  

### 5.5. DevOps & Qualidade

- [ ] Configurar CI/CD para backend  
- [ ] Configurar CI/CD para frontend  
- [ ] Configurar EAS build para mobile  
- [ ] Configurar monitorização e logs  
- [ ] Implementar testes unitários (backend + frontend + mobile)  
- [ ] Implementar testes E2E principais (auth, upload, reservas, pagamentos, galeria)  
- [ ] Atualizar `README.md` com secção de deploy e links online (assim que existirem)  

### 5.6. Documentação & Suporte

- [ ] Manter `sandro.md` sempre alinhado com o estado real do projeto  
- [ ] Manter `README.md` sempre atualizado com funcionalidades e prints  
- [ ] Criar secção de “FAQ” no `README.md` (ou docs)  
- [ ] Documentar fluxos críticos (upload, reservas, pagamentos, galeria protegida)  

---

## 6. Como deves pensar e decidir

Quando tiveres de escolher qual tarefa fazer a seguir, segue esta ordem de prioridade:

1. Tarefas bloqueadoras (sem as quais outras não podem avançar)  
2. Tarefas de fundação (infra, auth, modelos de dados)  
3. Tarefas de fluxo crítico (upload, reservas, pagamentos, galeria)  
4. Tarefas de UX e refinamento  
5. Tarefas de otimização e melhoria contínua  

Se uma tarefa depender de outra ainda não feita:

- adiciona uma nota sob a tarefa  
- cria, se necessário, uma nova subtarefa na ToDo List  

---

## 7. Regra de ouro

> **Nunca avances sem atualizar este ficheiro (`sandro.md`) e o `README.md` quando isso fizer sentido.**  
> A tua missão não é só “fazer código”, é deixar o projeto num estado em que qualquer humano consiga pegar nele e perceber o que foi feito, como, e porquê.

---

## 8. Rotina antes de qualquer ação

Antes de qualquer ação, faz sempre o seguinte:

1. Lê o ficheiro `sandro.md`.  
2. Consulta a secção **ToDo List**.  
3. Identifica:
   - a tarefa em progresso **ou**  
   - se nenhuma estiver em progresso, escolhe a próxima tarefa lógica.  
4. Executa **apenas essa tarefa**, até ao fim ou até ao limite possível.  
5. Atualiza o `sandro.md`:
   - marca a tarefa como concluída com um ✅, **ou**  
   - adiciona nota de progresso se não estiver concluída.  
6. Se a tarefa gerar prints, outputs ou elementos visuais:
   - adiciona-os ao `README.md`  
   - cria secção correspondente  
   - adiciona link online assim que existir  
7. Nunca avances para outra tarefa sem atualizar o `sandro.md` e o `README.md` quando necessário.  

Depois disto, **executa a tarefa escolhida**.
