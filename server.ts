import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import healthRouter from './api/health.ts';
import exchangeRatesRouter from './api/exchangerates.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Mount backend API routes stored in /api at project root level
  app.use('/api/health', healthRouter);
  app.use('/api/exchangerates', exchangeRatesRouter);
  app.use('/api/rates', exchangeRatesRouter); // Convenient alias

  if (!isProd) {
    // Development mode: Mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static files
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[LionRate SG] Server running on http://0.0.0.0:${PORT}`);
    console.log(`[LionRate SG] Health check: http://localhost:${PORT}/api/health`);
    console.log(`[LionRate SG] MAS Exchange Rates: http://localhost:${PORT}/api/exchangerates`);
  });
}

startServer().catch((err) => {
  console.error('[LionRate SG] Server startup error:', err);
  process.exit(1);
});
