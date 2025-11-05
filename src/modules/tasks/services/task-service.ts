import { db } from '../../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import type { Task } from '../types';

const tasksCollection = collection(db, 'tasks');

export const fetchTasks = async (): Promise<Task[]> => {
    const snapshot = await getDocs(tasksCollection);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Task[];
};

export const addTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
    const docRef = await addDoc(tasksCollection, task);
    return { id: docRef.id, ...task } as Task;
};

export const updateTask = async (id: string, task: Partial<Omit<Task, 'id'>>): Promise<void> => {
    const taskRef = doc(db, 'tasks', id);
    await updateDoc(taskRef, task);
};

export const deleteTask = async (id: string): Promise<void> => {
    const taskRef = doc(db, 'tasks', id);
    await deleteDoc(taskRef);
};
