import type { ServiceAdapter } from './adapter.interface';
import type { UnifiedTask, UnifiedEvent } from '../types';

export class MockAdapter implements ServiceAdapter {
    readonly provider = 'local';
    private tasks: UnifiedTask[] = [];
    private events: UnifiedEvent[] = [];

    // Simulate network delay
    private async delay() {
        return new Promise(resolve => setTimeout(resolve, 300));
    }

    constructor() {
        // Seed some initial data
        this.tasks = [
            {
                id: 'mock-1',
                title: 'Review Implementation Plan',
                completed: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                provider: 'local',
                priority: 'high',
                tags: ['planning']
            },
            {
                id: 'mock-2',
                title: 'Develop Persistence Layer',
                completed: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                provider: 'local',
                priority: 'high',
                tags: ['dev']
            }
        ];
    }

    isAuthenticated() { return true; }
    async login() { }
    async logout() { }

    async getTasks(): Promise<UnifiedTask[]> {
        await this.delay();
        return [...this.tasks];
    }

    async createTask(task: Partial<UnifiedTask>): Promise<UnifiedTask> {
        await this.delay();
        const newTask: UnifiedTask = {
            id: `mock-${Date.now()}`,
            title: task.title || 'Untitled',
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            provider: 'local',
            ...task
        };
        this.tasks.push(newTask);
        return newTask;
    }

    async updateTask(id: string, updates: Partial<UnifiedTask>): Promise<UnifiedTask> {
        await this.delay();
        const index = this.tasks.findIndex(t => t.id === id);
        if (index === -1) throw new Error('Task not found');

        this.tasks[index] = { ...this.tasks[index], ...updates, updatedAt: new Date().toISOString() };
        return this.tasks[index];
    }

    async deleteTask(id: string): Promise<void> {
        await this.delay();
        this.tasks = this.tasks.filter(t => t.id !== id);
    }

    async getEvents(timeMin: Date, timeMax: Date): Promise<UnifiedEvent[]> {
        await this.delay();
        // Return dummy events within range
        return this.events.filter(e => {
            const start = new Date(e.startTime);
            return start >= timeMin && start <= timeMax;
        });
    }

    async createEvent(event: Partial<UnifiedEvent>): Promise<UnifiedEvent> {
        await this.delay();
        const newEvent: UnifiedEvent = {
            id: `mock-evt-${Date.now()}`,
            title: event.title || 'Untitled Event',
            startTime: event.startTime || new Date().toISOString(),
            endTime: event.endTime || new Date(Date.now() + 3600000).toISOString(),
            allDay: event.allDay || false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            provider: 'local',
            ...event
        };
        this.events.push(newEvent);
        return newEvent;
    }

    async updateEvent(id: string, updates: Partial<UnifiedEvent>): Promise<UnifiedEvent> {
        await this.delay();
        const index = this.events.findIndex(e => e.id === id);
        if (index === -1) throw new Error('Event not found');

        this.events[index] = { ...this.events[index], ...updates, updatedAt: new Date().toISOString() };
        return this.events[index];
    }

    async deleteEvent(id: string): Promise<void> {
        await this.delay();
        this.events = this.events.filter(e => e.id !== id);
    }
}
