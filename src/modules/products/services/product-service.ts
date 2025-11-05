
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
import type { Product } from "../types";

const productsCollection = collection(db, "products");

export const getProducts = async (): Promise<Product[]> => {
    const snapshot = await getDocs(query(productsCollection, orderBy("name")));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
};

export const getProduct = async (id: string): Promise<Product | null> => {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Product) : null;
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    const newProductData = {
        ...product,
        uuid: generateUUID(),
        visibleId: await generateVisibleId('P', 'products')
    }
    const docRef = await addDoc(productsCollection, newProductData);
    return { id: docRef.id, ...newProductData } as Product;
};

export const updateProduct = async (
    id: string,
    updates: Partial<Omit<Product, "id">>
): Promise<void> => {
    const docRef = doc(db, "products", id);
    const updateData = { ...updates };
    await updateDoc(docRef, updateData);
};

export const deleteProduct = async (id: string): Promise<void> => {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
};
