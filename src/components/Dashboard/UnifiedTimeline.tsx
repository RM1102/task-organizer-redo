import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useAppStore } from '../../store';
import type { UnifiedEvent } from '../../types';

interface DroppableHourSlotProps {
    hour: number;
    children?: React.ReactNode;
}

const DroppableHourSlot: React.FC<DroppableHourSlotProps> = ({ hour, children }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: `timeline-slot-${hour}`,
    });

    const style = {
        backgroundColor: isOver ? 'rgba(42, 161, 152, 0.1)' : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative w-full h-full">
            {children}
        </div>
    );
};

const UnifiedTimeline: React.FC = () => {
    const { events } = useAppStore();
    // Default hours 8 AM to 8 PM
    const startHour = 8;
    const endHour = 20;
    const hours = Array.from({ length: 13 }, (_, i) => i + startHour);

    // Helper to position event
    const getEventStyle = (event: UnifiedEvent) => {
        const start = new Date(event.startTime);
        const end = new Date(event.endTime);
        const startH = start.getHours() + start.getMinutes() / 60;
        const endH = end.getHours() + end.getMinutes() / 60;

        // Skip if out of view (simplified)
        if (endH < startHour || startH > endHour) return null;

        const top = (startH - startHour) * 60; // 60px per hour
        const height = (endH - startH) * 60;

        return {
            top: `${top}px`,
            height: `${height}px`,
        };
    };

    return (
        <div className="col-span-6 h-full bg-solarized-base3 rounded-2xl shadow-sm border border-solarized-base2 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-solarized-base2 flex justify-between items-center">
                <h2 className="font-semibold text-solarized-base03">Visual Timeline</h2>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-solarized-blue/10 text-solarized-blue font-medium">
                        <div className="w-2 h-2 rounded-full bg-solarized-blue"></div> College
                    </span>
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-solarized-green/10 text-solarized-green font-medium">
                        <div className="w-2 h-2 rounded-full bg-solarized-green"></div> Personal
                    </span>
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-solarized-orange/10 text-solarized-orange font-medium">
                        <div className="w-2 h-2 rounded-full bg-solarized-orange"></div> Family
                    </span>
                </div>
            </div>

            <div className="flex-1 relative overflow-y-auto p-4 custom-scrollbar">
                {/* Hour Grid */}
                <div className="grid grid-rows-[repeat(13,minmax(60px,1fr))] relative" style={{ height: hours.length * 60 }}>
                    {hours.map(hour => (
                        <div key={hour} className="border-b border-solarized-base2 last:border-0 relative h-[60px] box-border">
                            <span className="absolute -top-3 left-0 text-xs text-solarized-base1 w-10 text-right pr-2">
                                {hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'PM' : 'AM'}
                            </span>
                            <div className="ml-12 w-full h-full border-l border-solarized-base2 relative">
                                <DroppableHourSlot hour={hour}>
                                    {/* Slot content */}
                                </DroppableHourSlot>
                            </div>
                        </div>
                    ))}

                    {/* Events Layer */}
                    <div className="absolute top-0 left-12 right-0 bottom-0 pointer-events-none">
                        {events.map(event => {
                            const style = getEventStyle(event);
                            if (!style) return null;

                            const isCollege = event.provider === 'microsoft' || event.calendarId?.includes('college');
                            const colorClass = isCollege
                                ? 'bg-solarized-blue/10 border-solarized-blue text-solarized-blue'
                                : 'bg-solarized-green/10 border-solarized-green text-solarized-green';

                            return (
                                <div key={event.id}
                                    className={`absolute left-2 right-2 border-l-4 rounded px-2 py-1 text-xs overflow-hidden pointer-events-auto ${colorClass}`}
                                    style={style}>
                                    <span className="font-bold block truncate">{event.title}</span>
                                    <div className="text-[10px] opacity-75 truncate">{event.provider} Cal</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Current Time Indicator (Mock position for now) */}
                    <div className="absolute top-[320px] left-12 right-0 border-t-2 border-solarized-red z-10 pointer-events-none">
                        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-solarized-red"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnifiedTimeline;
