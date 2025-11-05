
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase/config';
import type { UserProfile } from '../types';

const userProfilesCollection = 'userProfiles';

export const createUserProfile = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
    await setDoc(doc(firestore, userProfilesCollection, uid), {
        uid,
        ...data
    });
};

export const getUserProfile = async (uid: string): Promise<UserProfile> => {
    const docRef = doc(firestore, userProfilesCollection, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
    } else {
        throw new Error('No such user profile!');
    }
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
    await setDoc(doc(firestore, userProfilesCollection, uid), data, { merge: true });
};
