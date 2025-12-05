import React from 'react';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { useAppStore } from '../store';

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const { scheduleTask } = useAppStore();

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && over.id.toString().startsWith('timeline-slot-')) {
            const hour = parseInt(over.id.toString().replace('timeline-slot-', ''), 10);
            const taskId = active.id.toString();

            // Create start time for today at the dropped hour
            const startTime = new Date();
            startTime.setHours(hour, 0, 0, 0);

            // If the hour has passed today, maybe schedule for tomorrow?
            // For now, let's just stick to "today at that time" even if in past, 
            // or maybe the timeline implies "today". 
            // Given the requirement is just "put on the visual timeline", this suffices.

            scheduleTask(taskId, startTime);
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="h-screen w-screen overflow-hidden bg-[#fdf6e3] text-[#657b83] grid grid-rows-[60px_1fr] grid-cols-1">
                <header className="bg-[#eee8d5] border-b border-[#93a1a1]/20 px-6 flex items-center gap-3">
                    <img src="/logo.png" alt="Task Organizer Logo" className="w-8 h-8 object-contain" />
                    <h1 className="text-xl font-bold text-[#586e75] tracking-tight">Task Organizer</h1>
                </header>
                <main className="h-full w-full overflow-hidden p-4 grid grid-cols-12 gap-4">
                    {children}
                </main>
            </div>
        </DndContext>
    );
};

export default DashboardLayout;
