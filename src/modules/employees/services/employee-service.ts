
import { db } from "../../../firebase/config";
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
import { generateUUID } from "../../../utils/idGenerator";
import { generateVisibleId } from "../../../services/id-service";
import type { Employee } from '../types';
import { addLog } from "../../logs/services/log-service";

const employeesCollection = collection(db, "employees");

export const getEmployees = async (): Promise<Employee[]> => {
    const snapshot = await getDocs(query(employeesCollection, orderBy("name")));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Employee));
};

export const getEmployee = async (id: string): Promise<Employee | null> => {
    const docRef = doc(db, "employees", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Employee) : null;
};

export const addEmployee = async (employee: Omit<Employee, 'id' | 'uuid' | 'visibleId'>): Promise<Employee> => {
    const newEmployee = {
        ...employee,
        uuid: generateUUID(),
        visibleId: await generateVisibleId('E', 'employees')
    }
    const docRef = await addDoc(employeesCollection, newEmployee);
    addLog({
        action: "create",
        module: "employees",
        details: `Created new employee: ${employee.name}`,
    });
    return { id: docRef.id, ...newEmployee } as Employee;
};

export const updateEmployee = async (
    id: string,
    updates: Partial<Omit<Employee, "id">>
): Promise<void> => {
    const docRef = doc(db, "employees", id);
    await updateDoc(docRef, updates);
    addLog({
        action: "update",
        module: "employees",
        details: `Updated employee: ${updates.name}`,
    });
};

export const deleteEmployee = async (id: string, employeeName: string): Promise<void> => {
    const docRef = doc(db, "employees", id);
    await deleteDoc(docRef);
    addLog({
        action: "delete",
        module: "employees",
        details: `Deleted employee: ${employeeName}`,
    });
};
