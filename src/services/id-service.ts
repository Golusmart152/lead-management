
import { db } from "../firebase/config";
import {
    doc,
    runTransaction,
    collection,
    query,
    orderBy,
    limit,
    getDocs
} from "firebase/firestore";

const countersCollection = collection(db, 'counters');

export const generateVisibleId = async (prefix: string, collectionName: string): Promise<string> => {
    const counterDocRef = doc(countersCollection, collectionName);

    try {
        const newIdNumber = await runTransaction(db, async (transaction) => {
            const counterDoc = await transaction.get(counterDocRef);

            if (!counterDoc.exists()) {
                // If the counter does not exist, we need to determine the last ID from the collection itself.
                const genericCollection = collection(db, collectionName);
                const q = query(genericCollection, orderBy('visibleId', 'desc'), limit(1));
                const querySnapshot = await getDocs(q);

                let lastId = 0;
                if (!querySnapshot.empty) {
                    const lastDocument = querySnapshot.docs[0].data();
                    if (lastDocument.visibleId) {
                        const parsedId = parseInt(lastDocument.visibleId.replace(prefix, ''), 10);
                        if (!isNaN(parsedId)) {
                            lastId = parsedId;
                        }
                    }
                }
                const newCounterValue = lastId + 1;
                transaction.set(counterDocRef, { currentId: newCounterValue });
                return newCounterValue;
            } else {
                const newCounterValue = counterDoc.data().currentId + 1;
                transaction.update(counterDocRef, { currentId: newCounterValue });
                return newCounterValue;
            }
        });

        return `${prefix}${String(newIdNumber).padStart(5, '0')}`;
    } catch (error) {
        console.error("Transaction failed: ", error);
        // Fallback to the old method if the transaction fails
        return await generateVisibleIdFallback(prefix, collectionName);
    }
};

// Fallback to the old method if the transaction fails
const generateVisibleIdFallback = async (prefix: string, collectionName: string): Promise<string> => {
    const genericCollection = collection(db, collectionName);
    const q = query(genericCollection, orderBy('visibleId', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);

    let lastId = 0;
    if (!querySnapshot.empty) {
        const lastDocument = querySnapshot.docs[0].data();
        if (lastDocument.visibleId) {
            const parsedId = parseInt(lastDocument.visibleId.replace(prefix, ''), 10);
            if (!isNaN(parsedId)) {
                lastId = parsedId;
            }
        }
    }

    const newIdNumber = lastId + 1;
    return `${prefix}${String(newIdNumber).padStart(5, '0')}`;
};
