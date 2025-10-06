import express from 'express';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import config from './config/index.js';

const app = express();

// Static files
app.use(express.static('public'));

// Routes
app.use('/', routes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Auto-refresh mechanism to keep metrics updated
setInterval(async () => {
  try {
    await fetch(`http://localhost:${config.port}`);
  } catch (error) {
    console.error('Failed to fetch node statistics:', error);
  }
}, config.refreshInterval);

export default app;
