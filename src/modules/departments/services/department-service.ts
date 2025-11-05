
import { db } from "../../../firebase/config";
import {
    collection,
    getDocs,
    addDoc,
    query,
    orderBy,
    deleteDoc,
    doc,
    updateDoc
} from "firebase/firestore";
import type { Department } from "../../../types";
import { addLog } from "../../logs/services/log-service";

const departmentsCollection = collection(db, "departments");

export const getDepartments = async (): Promise<Department[]> => {
    const snapshot = await getDocs(query(departmentsCollection, orderBy("name")));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Department));
};

export const addDepartment = async (department: Omit<Department, 'id'>): Promise<Department> => {
    const docRef = await addDoc(departmentsCollection, department);
    addLog({
        action: "create",
        module: "departments",
        details: `Created new department: ${department.name}`,
    });
    return { id: docRef.id, ...department } as Department;
};

export const updateDepartment = async (id: string, updates: Partial<Omit<Department, "id">>): Promise<void> => {
    const docRef = doc(db, "departments", id);
    await updateDoc(docRef, updates);
    addLog({
        action: "update",
        module: "departments",
        details: `Updated department: ${updates.name}`,
    });
};

export const deleteDepartment = async (id: string, departmentName: string): Promise<void> => {
    const docRef = doc(db, "departments", id);
    await deleteDoc(docRef);
    addLog({
        action: "delete",
        module: "departments",
        details: `Deleted department: ${departmentName}`,
    });
};
