import express, { Request, Response } from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { aiCoordinator, ollamaProvider } from './src/services/ai';

dotenv.config();

// Enforce HMR disabled in AI Studio cloud preview environment
process.env.DISABLE_HMR = 'true';

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const port = parseInt(process.env.PORT || '3000', 10);
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  /**
   * AI Status Service Endpoint
   * Returns live availability of Local (Ollama), Cloud (Gemini), and Offline (TrailMind Engine).
   * RULE: Never displays "Local AI Connected" unless Ollama actually responded successfully.
   */
  app.get('/api/ai/status', async (req: Request, res: Response) => {
    try {
      const preferred = (req.query.pref as any) || 'AUTO';
      const status = await aiCoordinator.getStatus(preferred);
      res.json(status);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve AI status', details: err.message });
    }
  });

  /**
   * Dedicated Ollama health check endpoint
   * Returns exact format:
   * {
   *   "provider": "ollama",
   *   "model": "llama3.2:3b",
   *   "available": true/false,
   *   "mode": "local"
   * }
   */
  app.get('/api/ai/ollama-status', async (_req: Request, res: Response) => {
    try {
      const health = await ollamaProvider.getHealthStatus();
      res.json(health);
    } catch (err: any) {
      res.json({
        provider: 'ollama',
        model: 'llama3.2:3b',
        available: false,
        mode: 'local',
        details: err?.message || 'Check failed',
      });
    }
  });

  /**
   * Test Local Ollama endpoint
   * Performs an immediate ping to Ollama API to verify daemon and model status.
   */
  app.post('/api/ai/test-local', async (_req: Request, res: Response) => {
    try {
      const health = await ollamaProvider.getHealthStatus();
      res.json({
        success: health.available,
        message: health.details || (health.available ? 'Connected to Ollama' : 'Could not reach Ollama'),
        health,
      });
    } catch (err: any) {
      res.json({
        success: false,
        message: err?.message || 'Failed to ping Ollama',
      });
    }
  });

  /**
   * Provider-independent Mission Generation endpoint
   * Uses AIProvider.generateMission() with automatic fallback:
   * LOCAL (Ollama llama3.2:3b) -> CLOUD (Gemini) -> OFFLINE (TrailMind Engine).
   */
  app.post('/api/ai/generate', async (req: Request, res: Response) => {
    try {
      const preferred = req.body?.preferredProvider;
      const mission = await aiCoordinator.generateMission(req.body, preferred);
      res.json(mission);
    } catch (err: any) {
      console.error('AI Coordinator unexpected error, serving offline mission:', err);
      // Failsafe guarantee: always return a working mission
      const failsafe = await aiCoordinator.generateMission(req.body, 'OFFLINE');
      res.json(failsafe);
    }
  });

  // Backward-compatible alias for previous /api/generate-mission
  app.post('/api/generate-mission', async (req: Request, res: Response) => {
    try {
      const mission = await aiCoordinator.generateMission(req.body);
      res.json(mission);
    } catch {
      const failsafe = await aiCoordinator.generateMission(req.body, 'OFFLINE');
      res.json(failsafe);
    }
  });

  // Mount Vite or serve static assets
  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  server.listen(port, '0.0.0.0', () => {
    console.log(`TrailMind AI server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
