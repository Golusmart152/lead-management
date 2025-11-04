
import { db } from "../../../firebase/config";
import {
    collection,
    getDocs,
    addDoc,
    query,
    orderBy,
} from "firebase/firestore";
import type { Department } from "../../../types";

const departmentsCollection = collection(db, "departments");

export const getDepartments = async (): Promise<Department[]> => {
    const snapshot = await getDocs(query(departmentsCollection, orderBy("name")));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Department));
};

export const addDepartment = async (department: Omit<Department, 'id'>): Promise<Department> => {
    const docRef = await addDoc(departmentsCollection, department);
    return { id: docRef.id, ...department } as Department;
};
