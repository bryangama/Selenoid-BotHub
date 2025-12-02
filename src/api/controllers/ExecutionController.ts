import type { Request, Response } from 'express';
import { BotExecutionService } from '../../services/BotExecutionService';

export class ExecutionController {
  static async index(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await BotExecutionService.getExecutions(page, limit);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ 
        status: 'error', 
        message: 'Failed to fetch executions', 
        details: error.message 
      });
    }
  }
}