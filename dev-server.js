
const express = require('express');

const app = express();
const port = 3001;

app.use(express.json());

app.post('/api/license/verify', (req, res) => {
  // Simulate a successful license verification
  res.json({ status: 'active' });
});

app.listen(port, () => {
  console.log(`Dev server listening at http://localhost:${port}`);
});
