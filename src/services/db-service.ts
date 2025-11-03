
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
} from "firebase/firestore";

export interface Lead {
  id: string;
  name: string;
  email: string;
}

export interface Interaction {
  id: string;
  lead_id: string;
  date: string;
  type: string;
  notes: string;
}

const leadsCollection = collection(db, "leads");

export const getLeads = async (): Promise<Lead[]> => {
  const snapshot = await getDocs(query(leadsCollection, orderBy("name")));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Lead));
};

export const getLeadById = async (id: string): Promise<Lead | null> => {
  const docRef = doc(db, "leads", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Lead) : null;
};

export const createLead = async (lead: Omit<Lead, "id">): Promise<Lead> => {
  const docRef = await addDoc(leadsCollection, lead);
  return { id: docRef.id, ...lead };
};

export const updateLead = async (
  id: string,
  updates: Partial<Omit<Lead, "id">>
): Promise<Lead | null> => {
  const docRef = doc(db, "leads", id);
  await updateDoc(docRef, updates);
  return getLeadById(id);
};

export const deleteLead = async (id: string): Promise<void> => {
  const docRef = doc(db, "leads", id);
  await deleteDoc(docRef);
};
