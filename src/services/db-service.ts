
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { generateUUID } from "../utils/idGenerator";
import { generateVisibleId } from "./id-service";

export type LeadStatus = 'New' | 'Contacted' | 'Follow-Up Scheduled' | 'Interested' | 'Not Interested' | 'Callback Requested' | 'In Progress / Under Discussion' | 'Converted / Closed-Won' | 'Lost / Closed-Lost' | 'Disqualified';

export interface Lead {
  id: string;
  uuid: string;
  visibleId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: LeadStatus;
}

export interface Interaction {
  id: string;
  lead_id: string;
  date: string;
  type: string;
  notes: string;
}

export interface FollowUp {
  id: string;
  leadId: string;
  notes: string;
  dueDate: string;
  status: 'Pending' | 'Completed';
  date?: string;
  time?: string;
  type?: 'Follow-Up Scheduled' | 'Callback Requested';
}

export interface FollowUpWithLead extends FollowUp {
    clientName: string;
    clientPhone: string;
    taskType: string;
}

const leadsCollection = collection(db, "leads");
const followUpsCollection = collection(db, "followUps");

export const getLeads = async (): Promise<Lead[]> => {
  const snapshot = await getDocs(query(leadsCollection, orderBy("name")));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Lead));
};

export const getLead = async (id: string): Promise<Lead | null> => {
  const docRef = doc(db, "leads", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Lead) : null;
};

export const createLead = async (lead: Omit<Lead, "id" | "uuid" | "visibleId">): Promise<Lead> => {
  const newLead = {
    ...lead,
    uuid: generateUUID(),
    visibleId: await generateVisibleId('L', 'leads')
  }
  const docRef = await addDoc(leadsCollection, newLead);
  return { id: docRef.id, ...newLead } as Lead;
};

export const updateLead = async (
  id: string,
  updates: Partial<Omit<Lead, "id">>
): Promise<Lead | null> => {
  const docRef = doc(db, "leads", id);
  await updateDoc(docRef, updates);
  return getLead(id);
};

export const deleteLead = async (id: string): Promise<void> => {
  const docRef = doc(db, "leads", id);
  await deleteDoc(docRef);
};

export const getFollowUps = async (leadId: string): Promise<FollowUp[]> => {
  const q = query(followUpsCollection, where("leadId", "==", leadId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FollowUp));
}

export const getAllFollowUps = async (): Promise<FollowUpWithLead[]> => {
    const snapshot = await getDocs(query(followUpsCollection, orderBy("dueDate")));
    const followUps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FollowUp));

    const followUpsWithLead: FollowUpWithLead[] = [];

    for(const followUp of followUps) {
        const lead = await getLead(followUp.leadId);
        if(lead) {
            followUpsWithLead.push({
                ...followUp,
                clientName: lead.name,
                clientPhone: lead.phone,
                taskType: followUp.type || ''
            });
        }
    }

    return followUpsWithLead;
}

export const addFollowUp = async (leadId: string, followUp: Omit<FollowUp, 'id' | 'leadId'>): Promise<FollowUp> => {
  const newFollowUp = {
    ...followUp,
    leadId,
  };
  const docRef = await addDoc(followUpsCollection, newFollowUp);
  return { id: docRef.id, ...newFollowUp } as FollowUp;
}

export const updateFollowUp = async (
    id: string,
    updates: Partial<Omit<FollowUp, 'id'>>
): Promise<void> => {
    const docRef = doc(db, "followUps", id);
    await updateDoc(docRef, updates);
};

export const deleteFollowUp = async (id: string): Promise<void> => {
    const docRef = doc(db, "followUps", id);
    await deleteDoc(docRef);
};
