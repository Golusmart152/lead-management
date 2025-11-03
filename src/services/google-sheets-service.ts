
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

const createSheetLeadFn = httpsCallable(functions, 'createSheetLead');
const updateSheetLeadFn = httpsCallable(functions, 'updateSheetLead');
const deleteSheetLeadFn = httpsCallable(functions, 'deleteSheetLead');

export const createSheetLead = async (lead: { name: string; email: string }) => {
  try {
    const result = await createSheetLeadFn(lead);
    return result.data;
  } catch (error) {
    console.error('Error creating lead in Google Sheet:', error);
    throw error;
  }
};

export const updateSheetLead = async (leadId: string, updatedData: { name?: string; email?: string }) => {
  try {
    const result = await updateSheetLeadFn({ leadId, updatedData });
    return result.data;
  } catch (error) {
    console.error('Error updating lead in Google Sheet:', error);
    throw error;
  }
};

export const deleteSheetLead = async (leadId: string) => {
  try {
    const result = await deleteSheetLeadFn({ leadId });
    return result.data;
  } catch (error) {
    console.error('Error deleting lead from Google Sheet:', error);
    throw error;
  }
};
