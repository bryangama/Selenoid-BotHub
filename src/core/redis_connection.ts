import 'dotenv/config';
import type { RedisOptions } from 'bullmq';

export const redisConnection: RedisOptions = {
    host: process.env.REDIS_HOST ?? 'localhost', 
    port: Number(process.env.REDIS_PORT ?? 6379), 
};

console.log(`[Redis] Configuração de conexão definida para ${redisConnection.host}:${redisConnection.port}`);