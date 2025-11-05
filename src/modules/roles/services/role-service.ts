import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import type { Role } from '../types';

export const getRoles = async (): Promise<Role[]> => {
    const rolesCol = collection(db, 'roles');
    const snapshot = await getDocs(rolesCol);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Role[];
};

export const addRole = async (role: Omit<Role, 'id'>) => {
    await addDoc(collection(db, 'roles'), role);
};
