
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export const generateVisibleId = async (prefix: string, collectionName: string): Promise<string> => {
    const coll = collection(db, collectionName);
    const snapshot = await getDocs(coll);
    const count = snapshot.size;
    return `${prefix}-${(count + 1).toString().padStart(4, '0')}`;
};
