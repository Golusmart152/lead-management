
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
import { addLog } from "../../logs/services/log-service";

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

export const addProduct = async (product: Omit<Product, 'id' | 'uuid' | 'visibleId'>): Promise<Product> => {
    const newProductData = {
        ...product,
        uuid: generateUUID(),
        visibleId: await generateVisibleId('P', 'products')
    }
    const docRef = await addDoc(productsCollection, newProductData);
    addLog({
        action: "create",
        module: "products-services",
        details: `Created new product/service: ${product.name}`,
    });
    return { id: docRef.id, ...newProductData } as Product;
};

export const updateProduct = async (
    id: string,
    updates: Partial<Omit<Product, "id">>
): Promise<void> => {
    const docRef = doc(db, "products", id);
    const updateData = { ...updates };
    await updateDoc(docRef, updateData);
    addLog({
        action: "update",
        module: "products-services",
        details: `Updated product/service: ${updates.name}`,
    });
};

export const deleteProduct = async (id: string, productName: string): Promise<void> => {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
    addLog({
        action: "delete",
        module: "products-services",
        details: `Deleted product/service: ${productName}`,
    });
};
