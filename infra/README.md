# 🐳 Infra Docker – Bots Automation System

Este diretório contém toda a infraestrutura necessária para executar o sistema de automação, incluindo:

- **Redis** → Gerenciamento de filas (BullMQ)  
- **PostgreSQL** → Armazenamento do histórico de execuções  
- **Selenoid** → Execução dos bots em navegadores isolados  
- **Selenoid UI** → Dashboard para monitoramento das sessões  

A infraestrutura inteira pode ser iniciada com um único comando via **Docker Compose**.

---

## 📦 Estrutura do Diretório

infra/
├── docker-compose.yml # Serviços Redis, PostgreSQL, Selenoid e UI
├── browsers.json # Configuração dos navegadores do Selenoid
└── README.md # Este arquivo

---

# 🚀 Subindo toda a Infra

Execute:
docker compose up -d

Verifique se tudo está rodando:
docker compose ps

🎥 Gravação de Vídeo e Logs do Selenoid
O Selenoid salva automaticamente:

📺 Acessos Importantes
Recurso	URL/Conexão
Selenoid UI	http://localhost:9090
Selenoid WebDriver	http://localhost:4444/wd/hub
PostgreSQL	postgres://postgres:postgres@localhost:5432/bots
Redis	redis://localhost:6379

🧪 Testando o Selenoid
Verificar se o grid está ativo:
curl http://localhost:4444/status
Resultado esperado:
json
{
  "state": "running",
  "total": 5,
  "used": 0
}
Teste rápido com Selenium WebDriver

const { Builder } = require("selenium-webdriver");

(async () => {
  const driver = await new Builder()
    .usingServer("http://localhost:4444/wd/hub")
    .forBrowser("chrome")
    .build();

  await driver.get("https://google.com");
  await driver.quit();
})();

🔗 Integração com o Projeto Principal
Configure seu .env:

# Selenoid
USE_SELENOID=true
SELENOID_URL=http://localhost:4444/wd/hub
BROWSER_NAME=chrome
BROWSER_VERSION=124.0

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=bots

🧹 Limpando tudo
Parar os containers:

docker compose down
Remover volumes (dados do Redis e PostgreSQL):

docker volume rm infra_pg_data infra_redis_data

📌 Observações Importantes
Para aumentar o limite de navegadores simultâneos, altere -limit no docker-compose.yml.

O Selenoid suporta Chrome, Firefox, Edge, Opera, etc. Basta adicionar no browsers.json.

Para registrar vídeos, use sempre imagens VNC como:
selenoid/vnc:chrome_124.0

O Selenoid UI não precisa de configuração adicional: apenas a URL do Selenoid.