
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

export type ProductServiceType = 'Product' | 'Service';

export interface ProductOrService {
    id: string;
    uuid: string;
    visibleId: string;
    name: string;
    description: string;
    type: ProductServiceType;
}

const productsOrServicesCollection = collection(db, "productsOrServices");

export const getProductsOrServices = async (): Promise<ProductOrService[]> => {
    const snapshot = await getDocs(query(productsOrServicesCollection, orderBy("name")));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ProductOrService));
};

export const getProductOrService = async (id: string): Promise<ProductOrService | null> => {
    const docRef = doc(db, "productsOrServices", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as ProductOrService) : null;
};

export const addProductOrService = async (productOrService: Omit<ProductOrService, 'id' | 'uuid' | 'visibleId'>): Promise<ProductOrService> => {
    const newProductOrService = {
        ...productOrService,
        uuid: generateUUID(),
        visibleId: await generateVisibleId('I', 'productsOrServices')
    }
    const docRef = await addDoc(productsOrServicesCollection, newProductOrService);
    return { id: docRef.id, ...newProductOrService } as ProductOrService;
};

export const updateProductOrService = async (
    id: string,
    updates: Partial<Omit<ProductOrService, "id">>
): Promise<void> => {
    const docRef = doc(db, "productsOrServices", id);
    await updateDoc(docRef, updates);
};

export const deleteProductOrService = async (id: string): Promise<void> => {
    const docRef = doc(db, "productsOrServices", id);
    await deleteDoc(docRef);
};
