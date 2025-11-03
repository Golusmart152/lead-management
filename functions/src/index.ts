
import * as functions from "firebase-functions";
import { google } from "googleapis";
import { JWT } from "google-auth-library";

const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const leadsSheetName = process.env.LEADS_SHEET_NAME || "Leads";

const client = new JWT({
  email: process.env.GOOGLE_SHEETS_CLIENT_ID,
  key: process.env.GOOGLE_SHEETS_CLIENT_SECRET?.replace(/\\n/g, '\n'),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth: client });

export const createSheetLead = functions.https.onCall(async (data, _context) => {
  const { name, email } = data;
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: leadsSheetName,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[name, email]],
      },
    });
    return { success: true };
  } catch (error) {
    console.error("The API returned an error: " + error);
    throw new functions.https.HttpsError("internal", "Unable to create lead in Google Sheet.");
  }
});

export const updateSheetLead = functions.https.onCall(async (data, _context) => {
  const { leadId, updatedData } = data;
  try {
    const range = `${leadsSheetName}!A${leadId}:B${leadId}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[updatedData.name, updatedData.email]],
      },
    });
    return { success: true };
  } catch (error) {
    console.error("The API returned an error: " + error);
    throw new functions.https.HttpsError("internal", "Unable to update lead in Google Sheet.");
  }
});

export const deleteSheetLead = functions.https.onCall(async (data, _context) => {
  const { leadId } = data;
  try {
    const range = `${leadsSheetName}!A${leadId}:B${leadId}`;

    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range,
    });
    return { success: true };
  } catch (error) {
    console.error("The API returned an error: " + error);
    throw new functions.https.HttpsError("internal", "Unable to delete lead from Google Sheet.");
  }
});
