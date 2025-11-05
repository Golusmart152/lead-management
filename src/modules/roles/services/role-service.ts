
import { db } from "../../../firebase/config";
import {
    collection,
    getDocs,
    addDoc,
    query,
    orderBy,
    deleteDoc,
    doc,
    updateDoc,
    DocumentData,
    QueryDocumentSnapshot
} from "firebase/firestore";
import type { Role } from "../../../types";
import { addLog } from "../../logs/services/log-service";

const rolesCollection = collection(db, "roles");

const roleFromDocument = (doc: QueryDocumentSnapshot<DocumentData>): Role => {
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name,
    };
};

export const getRoles = async (): Promise<Role[]> => {
    const snapshot = await getDocs(query(rolesCollection, orderBy("name")));
    return snapshot.docs.map(roleFromDocument);
};

export const addRole = async (role: {name: string}): Promise<Role> => {
    const docRef = await addDoc(rolesCollection, role);
    const snapshot = await getDoc(docRef);
    const newRole = roleFromDocument(snapshot)
    addLog({
        action: "create",
        module: "roles",
        details: `Created new role: ${newRole.name}`,
    });
    return newRole
};

export const updateRole = async (
    id: string,
    updates: Partial<Role>
): Promise<void> => {
    const docRef = doc(db, "roles", id);
    await updateDoc(docRef, updates);
    addLog({
        action: "update",
        module: "roles",
        details: `Updated role: ${updates.name || 'unknown'}`,
    });
};

export const deleteRole = async (id: string): Promise<void> => {
    const docRef = doc(db, "roles", id);
    const snapshot = await getDoc(docRef)
    const role = roleFromDocument(snapshot)
    await deleteDoc(docRef);
    addLog({
        action: "delete",
        module: "roles",
        details: `Deleted role: ${role.name}`,
    });
};
