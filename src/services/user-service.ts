
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { UserProfile } from '../types';

const userProfilesCollection = 'userProfiles';

export const createUserProfile = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
    await setDoc(doc(db, userProfilesCollection, uid), {
        uid,
        ...data
    });
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const docRef = doc(db, userProfilesCollection, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
    } else {
        return null;
    }
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
    await setDoc(doc(db, userProfilesCollection, uid), data, { merge: true });
};
