
import { Queue, Job } from 'bullmq';
import { redisConnection } from '../core/redis_connection';
import { BOTS } from '../config/bots';

export interface BotJobData {
  botId: number;
  flowName: string;
  frequency: string;
}

export const automationQueue = new Queue<BotJobData>('automation_queue', {
  connection: redisConnection,
});

//Para Testes todos os bots estão agendados para rodar a cada 1 minuto
export async function addScheduledBots(): Promise<void> {
  console.log('Adicionando bots agendados à fila...');

  // Exemplo: para cada bot ativo, agenda seu fluxo padrão
  for (const bot of BOTS) {
    if (!bot.enabled) continue;

    // aqui você pode  por id
    if (bot.id === 1) {
      // Bot de cotação - a cada 1 minutos
      await automationQueue.add(
        'bot_quote_check',
        {
          botId: bot.id,
          flowName: bot.defaultFlow,
          frequency: '1m',
        },
        {
          repeat: { every: 60_000 },
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
          removeOnComplete: true,
        }
      );
    }

   if (bot.id === 2) {
      // Bot de relatório - diário 10:30
      await automationQueue.add(
        'bot_daily_report',
        {
          botId: bot.id,
          flowName: bot.defaultFlow,
          frequency: '10:30 daily',
        },
        {
          repeat: { every: 60_000 }, // pattern	pattern: '5 * * * *'	CRON - minuto 5 de cada hora
          attempts: 5,
          backoff: { type: 'exponential', delay: 1000 },
          removeOnComplete: true,
        }
      );
    }

    if (bot.id === 3) {
      // Bot de cotação - a cada 1 minutos
      await automationQueue.add(
        'purchase_execution',
        {
          botId: bot.id,
          flowName: bot.defaultFlow,
          frequency: '1m',
        },
        {
          repeat: { every: 60_000 },
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
          removeOnComplete: true,
        }
      );
    }

    if (bot.id === 4) {
        // Bot de relatório - diário 09:30
        await automationQueue.add(
          'login', // Nome do job (aparece no Bull Board)
          {
            botId: bot.id, // ID do bot (1)
            flowName: bot.defaultFlow, // Flow a executar (vem do bots.ts → 'login')
            frequency: '09:30 daily', // Só informativo para logs
          },
          {
            repeat: { every: 60_000 }, // ← Repete a cada 60.000ms (60 segundos)
            attempts: 5, // Se falhar, tent
            backoff: { type: 'exponential', delay: 1000 }, // Espera entre retries
            removeOnComplete: true, // Remove job da fila após completar
          }
        );
      }

    // e assim por diante para outros bots...
  }

  console.log('Agendamentos recorrentes adicionados com sucesso.');
}

export async function addManualJob(botId: number, flowName: string): Promise<Job<BotJobData>> {
  return automationQueue.add('manual_job', {
    botId,
    flowName,
    frequency: 'Manual',
  });
}
