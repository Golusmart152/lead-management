
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import type { Department } from '../../../types';

export const getDepartments = async (): Promise<Department[]> => {
    const departmentsCol = collection(db, 'departments');
    const snapshot = await getDocs(departmentsCol);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Department[];
};

export const addDepartment = async (department: Omit<Department, 'id'>) => {
    await addDoc(collection(db, 'departments'), department);
};
