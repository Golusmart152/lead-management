
import { db } from "../../../firebase/config";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
} from "firebase/firestore";
import type { Lead } from "../types";
import { addLog } from "../../logs/services/log-service";

const leadsCollection = collection(db, "leads");

export const getLeads = async (): Promise<Lead[]> => {
    const snapshot = await getDocs(query(leadsCollection, orderBy("company")));
    return snapshot.docs.map((doc, index) => ({
        id: doc.id,
        visibleId: `LEAD-${String(index + 1).padStart(4, '0')}`,
        ...doc.data(),
    } as Lead));
};

export const addLead = async (lead: Omit<Lead, 'id' | 'visibleId'>): Promise<Lead> => {
    const docRef = await addDoc(leadsCollection, lead);
    addLog({
        action: "create",
        module: "leads",
        details: `Created new lead: ${lead.company}`,
    });
    return { id: docRef.id, visibleId: 'temp-id', ...lead } as Lead;
};

export const updateLead = async (id: string, lead: Partial<Omit<Lead, 'id' | 'visibleId'>>): Promise<void> => {
    const leadRef = doc(db, "leads", id);
    await updateDoc(leadRef, lead);
    addLog({
        action: "update",
        module: "leads",
        details: `Updated lead: ${lead.company}`,
    });
};

export const deleteLead = async (id: string, leadName: string): Promise<void> => {
    const leadRef = doc(db, "leads", id);
    await deleteDoc(leadRef);
    addLog({
        action: "delete",
        module: "leads",
        details: `Deleted lead: ${leadName}`,
    });
};
