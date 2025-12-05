import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UnifiedTask, UnifiedEvent } from '../types';
import { ApiAdapter } from '../services/apiAdapter';
import type { ServiceAdapter } from '../services/adapter.interface';

// Initialize adapter 
const adapter: ServiceAdapter = new ApiAdapter();

interface AppState {
    activeContexts: ('personal' | 'college' | 'family')[];
    tasks: UnifiedTask[];
    events: UnifiedEvent[];
    isLoading: boolean;
    error: string | null;

    toggleContext: (context: 'personal' | 'college' | 'family') => void;
    fetchData: () => Promise<void>;
    addTask: (task: Partial<UnifiedTask>) => Promise<void>;
    toggleTaskCompletion: (id: string) => Promise<void>;
    scheduleTask: (taskId: string, startTime: Date) => Promise<void>;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            activeContexts: ['personal', 'college', 'family'],
            tasks: [],
            events: [],
            isLoading: false,
            error: null,

            toggleContext: (context) => set((state) => {
                const isActive = state.activeContexts.includes(context);
                return {
                    activeContexts: isActive
                        ? state.activeContexts.filter(c => c !== context)
                        : [...state.activeContexts, context]
                };
            }),

            fetchData: async () => {
                set({ isLoading: true, error: null });
                try {
                    const tasks = await adapter.getTasks();
                    const events = await adapter.getEvents(new Date(), new Date(Date.now() + 86400000 * 7)); // Next 7 days
                    set({ tasks, events, isLoading: false });
                } catch (err: any) {
                    set({ error: err.message || 'Failed to fetch data', isLoading: false });
                }
            },

            addTask: async (task) => {
                try {
                    const newTask = await adapter.createTask(task);
                    set((state) => ({ tasks: [...state.tasks, newTask] }));
                } catch (err: any) {
                    set({ error: err.message });
                }
            },

            toggleTaskCompletion: async (id) => {
                const task = get().tasks.find(t => t.id === id);
                if (!task) return;

                // Optimistic update
                const updatedTask = { ...task, completed: !task.completed };
                set(state => ({
                    tasks: state.tasks.map(t => t.id === id ? updatedTask : t)
                }));

                try {
                    await adapter.updateTask(id, { completed: updatedTask.completed });
                } catch (err) {
                    // Revert on failure
                    set(state => ({
                        tasks: state.tasks.map(t => t.id === id ? task : t),
                        error: 'Failed to update task'
                    }));
                }
            },

            scheduleTask: async (taskId: string, startTime: Date) => {
                const task = get().tasks.find(t => t.id === taskId);
                if (!task) return;

                // 1. Remove from tasks (optimistic)
                const previousTasks = get().tasks;
                const previousEvents = get().events;

                set(state => ({
                    tasks: state.tasks.filter(t => t.id !== taskId)
                }));

                // 2. Create Event
                const newEvent: UnifiedEvent = {
                    id: Math.random().toString(36).substr(2, 9), // Temp ID
                    title: task.title,
                    startTime: startTime.toISOString(),
                    endTime: new Date(startTime.getTime() + 60 * 60 * 1000).toISOString(), // Default 1h
                    allDay: false,
                    provider: task.provider,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                set(state => ({
                    events: [...state.events, newEvent]
                }));

                // 3. Persist via Adapter (Mocking the "move" logic for now)
                try {
                    // In a real scenario, we might delete the task and create an event,
                    // or update the task to have a scheduled time.
                    // implementing "delete task + create event" logic
                    await adapter.createEvent(newEvent);
                    await adapter.deleteTask(taskId);
                } catch (err: any) {
                    // Revert
                    set({ tasks: previousTasks, events: previousEvents, error: 'Failed to schedule task' });
                }
            }
        }),
        {
            name: 'task-organizer-storage',
            partialize: (state) => ({
                activeContexts: state.activeContexts,
                // We typically verify if we really want to persist tasks/events or always fetch fresh. 
                // For "Offline First" feel, we persist them.
                tasks: state.tasks,
                events: state.events
            }),
        }
    )
);
