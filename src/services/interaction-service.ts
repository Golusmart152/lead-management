
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

export interface Interaction {
  id: string;
  lead_id: string;
  date: string;
  type: string;
  notes: string;
}

const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const interactionsSheetName = process.env.INTERACTIONS_SHEET_NAME || 'Interactions';

const client = new JWT({
  email: process.env.GOOGLE_SHEETS_CLIENT_ID,
  key: process.env.GOOGLE_SHEETS_CLIENT_SECRET?.replace(/\\n/g, '\n'), // Ensure newlines are correctly formatted
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth: client });

export const getInteractionsForLead = async (leadId: string): Promise<Interaction[]> => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: interactionsSheetName,
    });

    const rows = response.data.values;
    if (rows) {
      // Assuming the first row is the header
      return rows.slice(1)
        .filter(row => row[1] === leadId) // Filter by lead_id
        .map((row, index) => ({
          id: (index + 2).toString(), // Simple ID generation
          lead_id: row[1],
          date: row[2],
          type: row[3],
          notes: row[4],
        }));
    } else {
      return [];
    }
  } catch (error) {
    console.error('The API returned an error: ' + error);
    throw error;
  }
};

export const createInteraction = async (interaction: Omit<Interaction, 'id'>): Promise<void> => {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: interactionsSheetName,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[interaction.lead_id, interaction.date, interaction.type, interaction.notes]],
      },
    });
  } catch (error) {
    console.error('The API returned an error: ' + error);
    throw error;
  }
};

export const updateInteraction = async (interactionId: string, updatedData: Partial<Omit<Interaction, 'id'>>): Promise<void> => {
  try {
    const range = `${interactionsSheetName}!A${interactionId}:E${interactionId}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[updatedData.lead_id, updatedData.date, updatedData.type, updatedData.notes]],
      },
    });
  } catch (error) {
    console.error('The API returned an error: ' + error);
    throw error;
  }
};

export const deleteInteraction = async (interactionId: string): Promise<void> => {
  try {
    const range = `${interactionsSheetName}!A${interactionId}:E${interactionId}`;

    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range,
    });
  } catch (error) {
    console.error('The API returned an error: ' + error);
    throw error;
  }
};
