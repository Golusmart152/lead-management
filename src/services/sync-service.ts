
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const syncGoogleSheetsWithDB = async () => {
  try {
    const response = await fetch(`${API_URL}/api/sync`, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to sync with Google Sheets');
    }
    console.log('Synchronization with Google Sheets initiated successfully.');
  } catch (error) {
    console.error('Error during synchronization:', error);
    throw error;
  }
};

export const createInteractionsSheetIfNotExists = async () => {
  try {
    const response = await fetch(`${API_URL}/api/create-interactions-sheet`, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to create interactions sheet');
    }
    console.log('Request to create interactions sheet sent successfully.');
  } catch (error) {
    console.error('Error creating interactions sheet:', error);
    throw error;
  }
};
