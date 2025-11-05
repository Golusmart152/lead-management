
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
import type { Customer } from "../types";

const customersCollection = collection(db, "customers");

export const getCustomers = async (): Promise<Customer[]> => {
    const snapshot = await getDocs(query(customersCollection, orderBy("name")));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Customer));
};

export const getCustomer = async (id: string): Promise<Customer | null> => {
    const docRef = doc(db, "customers", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Customer) : null;
};

export const addCustomer = async (customer: Omit<Customer, 'id' | 'uuid' | 'visibleId'>): Promise<Customer> => {
    const newCustomer = {
        ...customer,
        uuid: generateUUID(),
        visibleId: await generateVisibleId('C', 'customers')
    }
    const docRef = await addDoc(customersCollection, newCustomer);
    return { id: docRef.id, ...newCustomer } as Customer;
};

export const updateCustomer = async (
    id: string,
    updates: Partial<Omit<Customer, "id">>
): Promise<void> => {
    const docRef = doc(db, "customers", id);
    await updateDoc(docRef, updates);
};

export const deleteCustomer = async (id: string): Promise<void> => {
    const docRef = doc(db, "customers", id);
    await deleteDoc(docRef);
};
