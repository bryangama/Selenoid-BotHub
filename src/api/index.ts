import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { automationQueue } from '../queue/qeue_manager';
import { executionRoutes } from './routes/Execution.routes';
import { swaggerSpec } from './swagger';

const app = express();

const PORT = process.env.API_PORT || 3000;

app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Bull Board setup
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullMQAdapter(automationQueue)],
  serverAdapter: serverAdapter,
});

app.get('/api/jobs', async (req, res) => {
  try {
    const status = req.query.status as any || 'active';
    const jobs = await automationQueue.getJobs([status]);
    
    const formattedJobs = jobs.map(job => ({
      id: job.id,
      name: job.name,
      botId: job.data?.botId,
      flowName: job.data?.flowName,
      state: status,
      attempts: job.attemptsMade,
      maxAttempts: job.opts.attempts,
      addedAt: new Date(job.timestamp).toISOString(),
      data: job.data,
      failedReason: job.failedReason,
      stacktrace: job.stacktrace,
    }));

    res.json(formattedJobs);
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs', details: error.message });
  }
});

app.use('/admin/queues', serverAdapter.getRouter());

app.get('/admin/selenoid/status', async (req, res) => {
  try {
    const selenoidUrl = process.env.SELENOID_URL || 'http://localhost:4444';
    const response = await fetch(`${selenoidUrl}/status`);
    if (!response.ok) {
      throw new Error(`Selenoid responded with ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch Selenoid status', 
      details: error.message 
    });
  }
});

// Execution Logs Routes
app.use('/admin/executions', executionRoutes);


app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API de bots está no ar' });
});


app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
    console.log(`📚 Swagger disponível em http://localhost:${PORT}/api-docs`);
    console.log(`📊 Bull Board disponível em http://localhost:${PORT}/admin/queues`);
});