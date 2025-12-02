# 🤖 Bots Automation System

> Sistema de automação web escalável com filas de processamento, desenvolvido em Node.js + TypeScript, usando Redis, BullMQ, Selenium/Selenoid e PostgreSQL.

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![BullMQ](https://img.shields.io/badge/BullMQ-Queue-DC382D?logo=redis)
![Selenium](https://img.shields.io/badge/Selenium-WebDriver-43B02A?logo=selenium)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)

## 📋 Sobre o Projeto

Este projeto é um **sistema de RPA (Robotic Process Automation)** que executa múltiplos bots de automação web em paralelo, usando:

- **BullMQ + Redis** para enfileiramento e agendamento de jobs  
- **Selenium WebDriver + Selenoid** para automação de navegador em containers  
- **PostgreSQL + Knex** para armazenar o histórico de execuções  
- **Swagger + Bull Board** para observabilidade e monitoramento  

Projeto de portfólio para demonstrar:

- Arquitetura backend assíncrona e escalável  
- Integração com serviços externos (Redis, Selenoid, PostgreSQL)  
- Boas práticas com TypeScript, camadas e organização de código  

## 🏗️ Arquitetura Geral

```text
┌─────────────────┐      ┌─────────────┐      ┌──────────────┐
│   API Express   │──────│    Redis    │──────│   Worker     │
│  (Swagger +     │      │   (BullMQ)  │      │  (Processa   │
│   Bull Board)   │      └─────────────┘      │  os Jobs)    │
└─────────────────┘                           └──────┬───────┘
                                                     │
                              ┌──────────────────────┼──────────────────────┐
                              │                      │                      │
                         ┌────▼────┐           ┌─────▼─────┐          ┌─────▼─────┐
                         │BotRunner│           │ Selenoid  │          │PostgreSQL│
                         └────┬────┘           │ (Browsers)│          │  (Logs)  │
                              │                └───────────┘          └───────────┘
                    ┌─────────┼─────────┐
                    │         │         │
               GooglePage  GooglePage2  GooglePage3
                  (Page Objects - Fluxos de automação)
```

## 📁 Estrutura do Projeto

```text
src/
├── api/                    # API REST
│   ├── controllers/        # Controllers HTTP
│   ├── routes/             # Definição de rotas
│   ├── swagger.ts          # Configuração do Swagger (OpenAPI)
│   └── index.ts            # Entry point da API
├── config/                 # Configurações
│   ├── bots.ts             # Definição dos bots e flows padrão
│   ├── database.ts         # Conexão com PostgreSQL (Knex)
│   └── setting.ts          # Variáveis de ambiente (Selenoid, QTD_BOTS, etc.)
├── core/                   # Núcleo do sistema
│   ├── DriverFactory.ts    # Criação do WebDriver (local / Selenoid)
│   └── redis_connection.ts # Conexão Redis usada pelo BullMQ
├── database/
│   └── migrations/         # Migrations do Knex (inclui bot_executions)
├── pages/                  # Page Objects do Selenium
│   ├── GooglePage.ts
│   ├── GooglePage2.ts
│   ├── GooglePage3.ts
│   └── GooglePage4.ts
├── queue/                  # Filas BullMQ
│   ├── qeue_manager.ts     # Agendamento e adição de jobs na fila
│   └── worker.ts           # Worker que processa os jobs em paralelo
├── runners/
│   └── BotRunner.ts        # Orquestra qual fluxo (Page) executar
├── services/
│   └── BotExecutionService.ts  # Registro e consulta de execuções no banco
└── index.ts                # Entry point do worker principal
```

## 🚀 Executando o Projeto

### Pré-requisitos

- Node.js 20+  
- Redis em execução  
- PostgreSQL em execução  
- Selenoid 

### Instalação

```bash
git clone  https://github.com/bryangama/Selenoid-BotHub.git
cd Selenoid-BotHub

npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

### Configuração (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=sua_senha
DB_NAME=bots

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Selenoid
USE_SELENOID=true
SELENOID_URL=http://localhost:4444/wd/hub
BROWSER_NAME=chrome
BROWSER_VERSION=124.0

# Worker
QTD_BOTS=3

# API
API_PORT=5000
```

### Migrations

```bash
# Cria/atualiza as tabelas (inclui bot_executions)
npm run migrate
```

### Execução

```bash
# Terminal 1 - Worker (processa as filas e executa os bots)
npm run worker

# Terminal 2 - API (Swagger, Bull Board e endpoints)
npm run api
```

## 📡 Endpoints Principais

Após subir a API, você terá:

- `GET /health` → Health check da API  
- `GET /api/jobs?status=active` → Lista jobs da fila  
- `GET /admin/executions` → Histórico de execuções dos bots  
- `GET /admin/selenoid/status` → Status do Selenoid  
- `GET /admin/queues` → Bull Board (dashboard das filas)  
- `GET /api-docs` → Swagger UI (documentação interativa)  

## ⚙️ Concorrência e Execução Paralela

O worker é configurado para processar múltiplos jobs em paralelo:

```ts
// src/config/setting.ts
export const QTD_BOTS: number = Number(process.env.QTD_BOTS ?? 3);
```

```ts
// src/queue/worker.ts
export const automationWorker = new Worker<BotJobData>(
  'automation_queue',
  async (job) => await processJob(job),
  {
    connection: redisConnection,
    concurrency: QTD_BOTS, // executa vários bots ao mesmo tempo
  }
);
```

Isso permite que vários bots rodem simultaneamente no Selenoid, respeitando o limite configurado.

📸 Screenshots

BullMQ Dashboard (Bull Board)
<img width="954" height="500" alt="Captura de tela 2025-12-02 110758" src="https://github.com/user-attachments/assets/10d6e1f7-f88f-4d99-ae8c-6b5aa580d2d3" />

Selenoid Sessions / Grid

<img width="940" height="564" alt="Captura de tela 2025-12-02 110743" src="https://github.com/user-attachments/assets/8d0c4b5d-2d20-4336-b961-c9a214f6f067" />

## 🗄️ Estrutura da Tabela `bot_executions`

As execuções dos bots são persistidas na tabela `bot_executions`, que registra tanto o histórico quanto os detalhes de erro (quando houver):

| Coluna        | Tipo                         | Descrição |
|---------------|------------------------------|-----------|
| `id`          | `serial` (PK)                | Identificador único da execução |
| `bot_id`      | `integer`                    | Identificador do bot (configurado em `bots.ts`) |
| `bot_name`    | `varchar`                    | Nome do bot/fluxo (ex.: `purchase_execution`, `bot_quote_check`) |
| `status`      | `enum('RUNNING','COMPLETED','FAILED')` | Status atual da execução |
| `started_at`  | `timestamp`                  | Data/hora de início da execução |
| `finished_at` | `timestamp` (nullable)       | Data/hora de término da execução |
| `error_message` | `text` (nullable)          | Mensagem resumida do erro, quando `status = FAILED` |
| `metadata`    | `jsonb` (nullable)          | Dados adicionais como `jobId`, `flowName`, `frequency`, `stack` completo, etc. |
| `created_at`  | `timestamp`                  | Data/hora em que o registro foi criado |
| `updated_at`  | `timestamp`                  | Última atualização do registro |

Essa estrutura permite:

- Auditar todas as execuções dos bots  
- Diferenciar execuções **bem-sucedidas**, **falhas** e **em andamento**  
- Armazenar contexto extra da execução no campo `metadata` sem engessar o schema  

## 📜 Exemplo de Registro em `bot_executions`

Abaixo um exemplo real de como as execuções dos bots são armazenadas na tabela `bot_executions` — incluindo uma execução com erro no Selenoid e outra concluída com sucesso.

<details>
<summary><strong>📄 Clique para visualizar os registros completos</strong></summary>

<br>
❌ Execução com erro (status = FAILED)

id:           6

bot_id:       3

bot_name:     purchase_execution

status:       FAILED

started_at:   2025-12-02 10:26:00.086 -0300

finished_at:  2025-12-02 10:27:17.541 -0300

error_message:session timed out or not found

metadata:{
  "jobId": "repeat:dfd2d8d8da4f8549d8ed99f7f45a8740:1764681960000",
  
  "stack": "NoSuchSessionError: session timed out or not found
      at Object.throwDecodedError (C:\\bots\\node_modules\\selenium-webdriver\\lib\\error.js:523:15)
      at parseHttpResponse (C:\\bots\\node_modules\\selenium-webdriver\\lib\\http.js:524:13)
      at Executor.execute (C:\\bots\\node_modules\\selenium-webdriver\\lib\\http.js:456:28)
      at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
      at async Driver.execute (C:\\bots\\node_modules\\selenium-webdriver\\lib\\webdriver.js:745:17)
      at async Object.thenFinally (C:\\bots\\node_modules\\selenium-webdriver\\lib\\promise.js:100:5)
      at async processJob (C:\\bots\\src\\queue\\worker.ts:34:13)
      at async Worker.Worker.connection (C:\\bots\\src\\queue\\worker.ts:52:9)
      at async <anonymous> (C:\\bots\\node_modules\\bullmq\\src\\classes\\worker.ts:990:26)",
      
  "flowName": "report_download",
  
  "frequency": "1m"
}

        
✅ Execução bem-sucedida (status = COMPLETED)
id:           20

bot_id:       1

bot_name:     bot_quote_check

status:       COMPLETED

started_at:   2025-12-02 11:06:00.159 -0300

finished_at:  2025-12-02 11:06:17.611 -0300

error_message:(null)

metadata:{
  "jobId": "repeat:b46fa3c8fea1686285ffeee91fb37a8e:1764684360000",
  
  "flowName": "login",
  
  "frequency": "1m"
}

</details>


🧠 O que este projeto demonstra


Modelagem de arquitetura assíncrona com filas

Uso de Selenium/Selenoid para automação web em escala

Integração de BullMQ + Bull Board para observabilidade

Persistência e auditoria de execuções com PostgreSQL + Knex

Organização de código em camadas (API, core, services, queue, pages)

Documentação profissional com Swagger (OpenAPI)


