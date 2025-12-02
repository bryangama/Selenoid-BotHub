import { Worker, Job } from 'bullmq';
import { redisConnection } from '../core/redis_connection';
import type { BotJobData } from './qeue_manager';
import { BotRunner } from '../runners/BotRunner';
import { BotExecutionService } from '../services/BotExecutionService';
import { QTD_BOTS } from '../config/setting';

async function processJob(job: Job<BotJobData>): Promise<void> {
    const { botId, flowName, frequency } = job.data;
    let executionId: number | null = null;

    console.log(
        `[Worker] 🚀 Iniciando job ${job.name} (id=${job.id}) | botId=${botId} | flow=${flowName} | freq=${frequency}`
    );

    try {
        executionId = await BotExecutionService.createExecution(botId, job.name);

        // BotRunner já cria e gerencia o driver internamente
        const runner = new BotRunner(botId);
        await runner.run(flowName);

        if (executionId) {
            await BotExecutionService.updateStatus(executionId, 'COMPLETED', undefined, { flowName, frequency, jobId: job.id });
        }

        console.log(`[Worker] ✅ Job ${job.id} concluído com sucesso para bot ${botId}.`);

    } catch (e: any) {
        console.error(`[Worker] ❌ FALHA no job ${job.id} para bot ${botId}:`, e.message);
        
        if (executionId) {
            await BotExecutionService.updateStatus(executionId, 'FAILED', e.message, { flowName, frequency, jobId: job.id, stack: e.stack });
        }

        throw e; 
    }
}

console.log(`[Worker] 🔧 Configurado para processar ${QTD_BOTS} jobs simultâneos`);

export const automationWorker = new Worker<BotJobData>(
    'automation_queue',
    async (job) => {
        await processJob(job);
    },
    {
        connection: redisConnection,
        concurrency: QTD_BOTS, // ← Processa N jobs em paralelo!
    }
);

automationWorker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} marcado como COMPLETED.`);
});

automationWorker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} falhou:`, err);
});
