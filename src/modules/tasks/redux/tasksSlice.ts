import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { fetchTasks, addTask, updateTask, deleteTask } from '../services/task-service';
import type { Task } from '../types';

interface TasksState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
}

const initialState: TasksState = {
    tasks: [],
    loading: false,
    error: null,
};

export const getTasks = createAsyncThunk('tasks/getTasks', async () => {
    const response = await fetchTasks();
    return response;
});

export const createNewTask = createAsyncThunk('tasks/createTask', async (task: Omit<Task, 'id'>) => {
    const response = await addTask(task);
    return response;
});

export const updateExistingTask = createAsyncThunk('tasks/updateTask', async (task: Task) => {
    await updateTask(task.id, task);
    return task;
});

export const deleteExistingTask = createAsyncThunk('tasks/deleteTask', async (id: string) => {
    await deleteTask(id);
    return id;
});

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
                state.tasks = action.payload;
                state.loading = false;
            })
            .addCase(getTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch tasks';
            })
            .addCase(createNewTask.fulfilled, (state, action: PayloadAction<Task>) => {
                state.tasks.push(action.payload);
            })
            .addCase(updateExistingTask.fulfilled, (state, action: PayloadAction<Task>) => {
                const index = state.tasks.findIndex((task) => task.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            })
            .addCase(deleteExistingTask.fulfilled, (state, action: PayloadAction<string>) => {
                state.tasks = state.tasks.filter((task) => task.id !== action.payload);
            });
    },
});

export default tasksSlice.reducer;
