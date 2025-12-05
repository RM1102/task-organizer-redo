import type { ServiceAdapter } from './adapter.interface';
import type { UnifiedTask, UnifiedEvent } from '../types';

const API_URL = import.meta.env.PROD
    ? 'https://task-organizer-redo.onrender.com'
    : (import.meta.env.VITE_API_URL || 'http://localhost:3000');

export class ApiAdapter implements ServiceAdapter {
    readonly provider = 'local';

    isAuthenticated(): boolean {
        return true;
    }

    async login(): Promise<void> {
        // No-op for now
    }

    async logout(): Promise<void> {
        // No-op
    }

    async getTasks(): Promise<UnifiedTask[]> {
        const res = await fetch(`${API_URL}/items?type=task`);
        if (!res.ok) throw new Error('Failed to fetch tasks');
        return res.json();
    }

    async getEvents(start: Date, end: Date): Promise<UnifiedEvent[]> {
        const query = new URLSearchParams({
            type: 'event',
            start: start.toISOString(),
            end: end.toISOString()
        });
        const res = await fetch(`${API_URL}/items?${query}`);
        if (!res.ok) throw new Error('Failed to fetch events');
        return res.json();
    }

    async getUnifiedEvents(userId: string): Promise<any[]> {
        const res = await fetch(`${API_URL}/calendar/events?userId=${userId}`);
        if (!res.ok) throw new Error('Failed to fetch unified events');
        return res.json();
    }

    async createTask(task: Partial<UnifiedTask>): Promise<UnifiedTask> {
        const res = await fetch(`${API_URL}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...task, is_task: true })
        });
        if (!res.ok) throw new Error('Failed to create task');
        return res.json();
    }

    async updateTask(id: string, updates: Partial<UnifiedTask>): Promise<UnifiedTask> {
        const res = await fetch(`${API_URL}/items/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        if (!res.ok) throw new Error('Failed to update task');
        return res.json();
    }

    async deleteTask(id: string): Promise<void> {
        const res = await fetch(`${API_URL}/items/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to delete task');
    }

    async createEvent(event: Partial<UnifiedEvent>): Promise<UnifiedEvent> {
        const res = await fetch(`${API_URL}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...event, is_task: false })
        });
        if (!res.ok) throw new Error('Failed to create event');
        return res.json();
    }

    async updateEvent(id: string, updates: Partial<UnifiedEvent>): Promise<UnifiedEvent> {
        const res = await fetch(`${API_URL}/items/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        if (!res.ok) throw new Error('Failed to update event');
        return res.json();
    }

    async deleteEvent(id: string): Promise<void> {
        const res = await fetch(`${API_URL}/items/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to delete event');
    }
}
