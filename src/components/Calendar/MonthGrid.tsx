

import type { UnifiedEvent } from '../../types';

interface MonthGridProps {
    currentDate: Date;
    events: UnifiedEvent[];
}

const MonthGrid = ({ currentDate, events }: MonthGridProps) => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    // Solarized implementation of a month grid
    return (
        <div className="flex-1 flex flex-col bg-solarized-base3">
            <div className="grid grid-cols-7 border-b border-solarized-base1/20">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-solarized-base01">
                        {day}
                    </div>
                ))}
            </div>
            <div className="flex-1 grid grid-cols-7 grid-rows-5 lg:grid-rows-6">
                {Array.from({ length: startDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="border-b border-r border-solarized-base1/10 bg-solarized-base2/20"></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => (
                    <div key={i} className="border-b border-r border-solarized-base1/10 p-2 min-h-[80px] hover:bg-solarized-base2/50 transition-colors group relative">
                        <span className={`text-sm font-medium ${i + 1 === new Date().getDate() && currentDate.getMonth() === new Date().getMonth()
                            ? 'text-solarized-base3 bg-solarized-blue w-6 h-6 rounded-full flex items-center justify-center p-1'
                            : 'text-solarized-base01'
                            }`}>
                            {i + 1}
                        </span>
                        {/* Events for this day */}
                        {events
                            .filter(e => {
                                const d = new Date(e.startTime);
                                return d.getDate() === i + 1 && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
                            })
                            .slice(0, 3) // Limit to 3
                            .map(event => (
                                <div key={event.id} className="mt-1 text-xs truncate bg-solarized-blue/20 text-solarized-blue px-1.5 py-0.5 rounded border border-solarized-blue/30">
                                    {event.title}
                                </div>
                            ))
                        }
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MonthGrid;
