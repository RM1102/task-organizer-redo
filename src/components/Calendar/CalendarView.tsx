import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MonthGrid from './MonthGrid';
import DayView from './DayView';

type ViewMode = 'month' | 'week' | 'day';

const CalendarView = () => {
    const [currentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>('day');

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="flex flex-col h-full bg-solarized-base3">
            {/* Calendar Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-solarized-base1/10">
                <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-bold text-solarized-base03">
                        {viewMode === 'day'
                            ? currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                            : `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                        }
                    </h2>
                    <div className="flex items-center bg-solarized-base2 rounded-lg p-0.5 border border-solarized-base1/20">
                        <button className="p-1 hover:text-solarized-blue transition-colors rounded"><ChevronLeft className="w-5 h-5" /></button>
                        <button className="p-1 hover:text-solarized-blue transition-colors rounded"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                </div>

                <div className="flex bg-solarized-base2 rounded-lg p-1 border border-solarized-base1/20 shadow-sm">
                    {(['month', 'week', 'day'] as ViewMode[]).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={`px-3 py-1 text-sm font-medium rounded-md capitalize transition-all ${viewMode === mode
                                ? 'bg-solarized-base3 text-solarized-blue shadow-sm'
                                : 'text-solarized-base01 hover:text-solarized-base00'
                                }`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            {/* Calendar Content */}
            <div className="flex-1 overflow-auto flex flex-col">
                {viewMode === 'month' && <MonthGrid currentDate={currentDate} />}
                {viewMode === 'day' && <DayView currentDate={currentDate} />}
                {viewMode === 'week' && (
                    <div className="flex-1 flex items-center justify-center text-solarized-base01">
                        Week View Placeholder
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarView;
