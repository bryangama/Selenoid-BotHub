import { db } from '../config/database';

export class BotExecutionService {
  static async createExecution(botId: number, botName: string): Promise<number> {
    console.log(`[BotExecutionService] Creating execution for bot ${botId} (${botName})`);
    const [result] = await db('bot_executions')
      .insert({
        bot_id: botId,
        bot_name: botName,
        status: 'RUNNING',
        started_at: new Date(),
      })
      .returning('id');
    
    console.log(`[BotExecutionService] Created execution ID: ${result.id}`);
    return result.id;
  }

  static async updateStatus(
    id: number, 
    status: 'COMPLETED' | 'FAILED', 
    errorMessage?: string,
    metadata?: any
  ): Promise<void> {
    await db('bot_executions')
      .where({ id })
      .update({
        status,
        finished_at: new Date(),
        error_message: errorMessage,
        metadata: metadata ? JSON.stringify(metadata) : null,
      });
  }

  static async getExecutions(page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const countRows = await db('bot_executions').count<{ total: string | number }[]>('id as total');
    const total = Number(countRows?.[0]?.total ?? 0);

    const data = await db('bot_executions')
      .select('*')
      .orderBy('id', 'desc')
      .limit(limit)
      .offset(offset);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
