import type { UnifiedTask, UnifiedEvent } from '../types';

export interface ServiceAdapter {
    readonly provider: 'google' | 'apple' | 'microsoft' | 'local';

    // Auth
    isAuthenticated(): boolean;
    login(): Promise<void>;
    logout(): Promise<void>;

    // Tasks
    getTasks(): Promise<UnifiedTask[]>;
    createTask(task: Partial<UnifiedTask>): Promise<UnifiedTask>;
    updateTask(id: string, updates: Partial<UnifiedTask>): Promise<UnifiedTask>;
    deleteTask(id: string): Promise<void>;

    // Events
    getEvents(timeMin: Date, timeMax: Date): Promise<UnifiedEvent[]>;
    createEvent(event: Partial<UnifiedEvent>): Promise<UnifiedEvent>;
    updateEvent(id: string, updates: Partial<UnifiedEvent>): Promise<UnifiedEvent>;
    deleteEvent(id: string): Promise<void>;
}
