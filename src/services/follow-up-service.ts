import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { FollowUp } from '../models/follow-up';

export const addFollowUp = async (leadId: string, notes: string, date: Date): Promise<FollowUp> => {
  const followUp: Omit<FollowUp, 'id'> = { leadId, notes, date };
  const docRef = await addDoc(collection(db, 'follow-ups'), followUp);
  return { ...followUp, id: docRef.id };
};

export const getFollowUps = async (leadId: string): Promise<FollowUp[]> => {
  const q = query(collection(db, 'follow-ups'), where('leadId', '==', leadId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as FollowUp));
};

export const updateFollowUp = async (followUp: FollowUp): Promise<void> => {
    const followUpRef = doc(db, 'follow-ups', followUp.id);
    await updateDoc(followUpRef, { notes: followUp.notes, date: followUp.date });
};

export const deleteFollowUp = async (followUpId: string): Promise<void> => {
    const followUpRef = doc(db, 'follow-ups', followUpId);
    await deleteDoc(followUpRef);
};
