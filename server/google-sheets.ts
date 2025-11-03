
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { pool } from '../src/services/db-service'; // This path will need to be adjusted
import { Lead } from '../src/services/google-sheets-service';

const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const interactionsSheetName = process.env.INTERACTIONS_SHEET_NAME || 'Interactions';

const client = new JWT({
    email: process.env.GOOGLE_SHEETS_CLIENT_ID,
    key: process.env.GOOGLE_SHEETS_CLIENT_SECRET?.replace(/\\n/g, '\n'), // Ensure newlines are correctly formatted
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  
  const sheets = google.sheets({ version: 'v4', auth: client });


export const syncGoogleSheetsWithDB = async () => {
  try {
    console.log('Starting synchronization between Google Sheets and PostgreSQL...');

    // Get leads from Google Sheets
    const sheetLeads = await getLeadsFromSheet();

    // Get leads from PostgreSQL
    const dbResult = await pool.query('SELECT * FROM leads');
    const dbLeads = dbResult.rows;

    // Find leads that are in Google Sheets but not in the database
    const newLeads = sheetLeads.filter(sheetLead => 
      !dbLeads.some(dbLead => dbLead.email === sheetLead.email)
    );

    if (newLeads.length > 0) {
      console.log(`Found ${newLeads.length} new leads to insert into the database.`);
      // Insert new leads into the database
      for (const lead of newLeads) {
        await pool.query('INSERT INTO leads (name, email) VALUES ($1, $2)', [lead.name, lead.email]);
      }
      console.log('Successfully inserted new leads into the database.');
    } else {
      console.log('No new leads to insert.');
    }

    console.log('Synchronization completed successfully.');

  } catch (error) {
    console.error('Error during synchronization:', error);
    throw error;
  }
};

export const createInteractionsSheetIfNotExists = async () => {
    try {
        const spreadsheetInfo = await sheets.spreadsheets.get({
            spreadsheetId,
        });

        const sheetExists = spreadsheetInfo.data.sheets?.some(
            (sheet) => sheet.properties?.title === interactionsSheetName
        );

        if (!sheetExists) {
            console.log(`Creating "${interactionsSheetName}" sheet...`);
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                requestBody: {
                    requests: [
                        {
                            addSheet: {
                                properties: {
                                    title: interactionsSheetName,
                                },
                            },
                        },
                    ],
                },
            });
            // Add headers to the new sheet
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: `${interactionsSheetName}!A1:E1`,
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [['Interaction ID', 'Lead ID', 'Date', 'Type', 'Notes']],
                },
            });
            console.log(`"${interactionsSheetName}" sheet created successfully.`);
        } else {
            console.log(`"${interactionsSheetName}" sheet already exists.`);
        }
    } catch (error) {
        console.error('Error creating interactions sheet:', error);
        throw error;
    }
};

async function getLeadsFromSheet(): Promise<Lead[]> {
    // Implementation of getLeadsFromSheet - assuming it exists in another file
    // and needs to be brought over or reimplemented.
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Leads!A2:C', // Assuming Leads sheet and columns A-C
    });
    const rows = res.data.values;
    if (rows && rows.length) {
        return rows.map(row => ({
            id: 0, // Not available from sheets directly, might need adjustment
            name: row[0],
            email: row[1],
        }));
    }
    return [];
}
