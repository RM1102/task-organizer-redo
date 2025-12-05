export type Provider = 'local' | 'google' | 'apple' | 'microsoft';

export interface BaseItem {
    id: string;
    title: string;
    description?: string;
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
    provider: Provider;
    providerId?: string; // ID in the external system
    url?: string; // Link to the external item
}

export interface UnifiedTask extends BaseItem {
    completed: boolean;
    dueDate?: string; // ISO Date string or YYYY-MM-DD
    completedAt?: string;
    tags?: string[];
    priority?: 'low' | 'medium' | 'high';
    listId?: string; // e.g., Google Task List ID
}

export interface UnifiedEvent extends BaseItem {
    startTime: string; // ISO Date string
    endTime: string; // ISO Date string
    allDay: boolean;
    location?: string;
    calendarId?: string; // e.g., Google Calendar ID
}

// Legacy type alias for compatibility during migration, or we can update all usages
export type Task = UnifiedTask;
