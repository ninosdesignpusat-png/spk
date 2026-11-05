import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '15mb' }));

  // Google Sheets Proxy endpoint to avoid CORS issues when posting to Apps Script Web App
  app.post('/api/sheets/proxy', async (req, res) => {
    try {
      const { targetUrl, payload } = req.body;
      if (!targetUrl || typeof targetUrl !== 'string') {
        return res.status(400).json({ error: 'targetUrl wajib diisi' });
      }

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      try {
        const json = JSON.parse(text);
        return res.json(json);
      } catch {
        return res.json({ success: true, raw: text });
      }
    } catch (error: any) {
      console.error('Error proxying to Google Sheets:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Gagal menghubungi Google Apps Script Web App',
      });
    }
  });

  // App Health / Info
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      app: 'Ninos Design - Sistem Surat Jalan Potong & SPK Produksi',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ninos Design Production Server running on http://localhost:${PORT}`);
  });
}

startServer();
