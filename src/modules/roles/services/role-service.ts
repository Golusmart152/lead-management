
import { db } from "../../../firebase/config";
import {
    collection,
    getDocs,
    addDoc,
    query,
    orderBy,
} from "firebase/firestore";
import type { Role } from "../../../types";

const rolesCollection = collection(db, "roles");

export const getRoles = async (): Promise<Role[]> => {
    const snapshot = await getDocs(query(rolesCollection, orderBy("name")));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Role));
};

export const addRole = async (role: Omit<Role, 'id'>): Promise<Role> => {
    const docRef = await addDoc(rolesCollection, role);
    return { id: docRef.id, ...role } as Role;
};
