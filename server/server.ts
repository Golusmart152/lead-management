
import express from 'express';
import cors from 'cors';
import { syncGoogleSheetsWithDB, createInteractionsSheetIfNotExists } from './google-sheets';

const app = express();
const port = process.env.BACKEND_PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/sync', async (req, res) => {
  try {
    await syncGoogleSheetsWithDB();
    res.status(200).send('Synchronization successful');
  } catch (error) {
    console.error(error);
    res.status(500).send('Synchronization failed');
  }
});

app.post('/api/create-interactions-sheet', async (req, res) => {
  try {
    await createInteractionsSheetIfNotExists();
    res.status(200).send('Interaction sheet created or already exists');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to create interaction sheet');
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
