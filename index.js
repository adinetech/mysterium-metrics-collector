import app from './src/app.js';
import config from './src/config/index.js';

const port = config.port;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Dashboard available at http://localhost:${port}/dashboard`);
  console.log(`Metrics available at http://localhost:${port}/metrics`);
  console.log(`API help available at http://localhost:${port}/help`);
});
