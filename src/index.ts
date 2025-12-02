// src/index.ts

import * as dotenv from 'dotenv';
dotenv.config();

import { addScheduledBots, addManualJob } from './queue/qeue_manager';
import './queue/worker'; 

async function main() {
    console.log('Iniciando sistema de bots com Redis + BullMQ...');

    //  registra/agenda bots recorrentes na fila (se você quiser usar agendamento)
    await addScheduledBots();

    //  opcional: enfileirar alguns jobs manuais para teste imediato
    // por ex: criar um job para cada bot
    /*
    for (let i = 1; i <= 3; i++) {
        await addManualJob(i, 'quote_check');
    }
    */

    console.log('Agendamentos feitos. Worker está rodando e escutando a fila Redis.');
}

main().catch(error => {
    console.error("ERRO FATAL NA EXECUÇÃO PRINCIPAL:", error);
    process.exit(1);
});
