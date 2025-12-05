
import type { UnifiedEvent } from '../../types';

interface DayViewProps {
    currentDate: Date;
    events: UnifiedEvent[];
}

const DayView = ({ events }: DayViewProps) => {
    // Generate hours 0-23
    const hours = Array.from({ length: 24 }).map((_, i) => i);


    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-solarized-base3">
            {/* Time Grid - Flex container to fit viewport without scrolling */}
            <div className="flex-1 flex flex-col relative">
                {hours.map((hour) => (
                    <div key={hour} className="flex-1 border-b border-solarized-base1/10 flex relative group">
                        {/* Time Label */}
                        <div className="w-16 flex items-start justify-end pr-3 pt-1 border-r border-solarized-base1/10">
                            <span className="text-xs text-solarized-base01 font-medium">
                                {hour === 0 ? '12 AM' : hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                            </span>
                        </div>

                        {/* Hour Slot */}
                        <div className="flex-1 hover:bg-solarized-base2/30 transition-colors relative">
                            {/* Events that start in this hour */}
                            {events.filter(e => {
                                const start = new Date(e.startTime);
                                return start.getHours() === hour;
                            }).map(event => {
                                const start = new Date(event.startTime);
                                const end = event.endTime ? new Date(event.endTime) : new Date(start.getTime() + 60 * 60 * 1000); // Default 1 hour if no end
                                const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                                const startMinute = start.getMinutes();

                                return (
                                    <div
                                        key={event.id}
                                        className={`absolute inset-x-1 z-10 rounded shadow-sm px-2 py-1 bg-solarized-blue text-white opacity-80 hover:opacity-100 hover:z-20 transition-all cursor-pointer`}
                                        style={{
                                            height: `${durationHours * 100}%`,
                                            top: `${(startMinute / 60) * 100}%`
                                        }}
                                    >
                                        <div className="font-semibold text-xs">{event.title}</div>
                                        <div className="text-[10px] opacity-90">
                                            {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="text-[9px] opacity-75 capitalize">{event.provider}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}

                {/* Current Time Indicator (Static for demo, ideally dynamic) */}
                <div
                    className="absolute left-16 right-0 border-t-2 border-solarized-red z-20 pointer-events-none flex items-center"
                    style={{ top: '45%' }} // Example: 10:48 AM approx position
                >
                    <div className="w-2 h-2 rounded-full bg-solarized-red -ml-1"></div>
                </div>
            </div>
        </div>
    );
};

export default DayView;
