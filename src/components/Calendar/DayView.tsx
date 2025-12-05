
interface DayViewProps {
    currentDate: Date;
}

const DayView = ({ }: DayViewProps) => {
    // Generate hours 0-23
    const hours = Array.from({ length: 24 }).map((_, i) => i);

    // Example overlapping events for visualization
    const events = [
        { id: 1, title: 'Team Standup', startHour: 9, duration: 1, color: 'bg-solarized-blue' },
        { id: 2, title: 'Deep Work Block', startHour: 10, duration: 2, color: 'bg-solarized-magenta' },
        { id: 3, title: 'Lunch', startHour: 13, duration: 1, color: 'bg-solarized-green' }
    ];

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
                            {events.filter(e => Math.floor(e.startHour) === hour).map(event => (
                                <div
                                    key={event.id}
                                    className={`absolute inset-x-1 top-0 z-10 rounded shadow-sm px-2 py-1 ${event.color} text-white opacity-80 hover:opacity-100 hover:z-20 transition-all cursor-pointer`}
                                    style={{
                                        height: `${event.duration * 100}%`,
                                        top: `${(event.startHour % 1) * 100}%`
                                    }}
                                >
                                    <div className="font-semibold text-xs">{event.title}</div>
                                    <div className="text-[10px] opacity-90">
                                        {event.startHour > 12 ? event.startHour - 12 : event.startHour}:00 - {event.startHour + event.duration > 12 ? event.startHour + event.duration - 12 : event.startHour + event.duration}:00
                                    </div>
                                </div>
                            ))}
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
