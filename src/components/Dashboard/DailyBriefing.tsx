import React from 'react';

const DailyBriefing: React.FC = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    const dateString = today.toLocaleDateString('en-US', options);

    return (
        <div className="col-span-3 h-full flex flex-col gap-4 bg-solarized-base3 rounded-2xl p-6 shadow-sm border border-solarized-base2">
            <div>
                <h1 className="text-3xl font-bold text-solarized-base03">{dateString}</h1>
                <p className="text-solarized-base01 text-lg">Good morning, Rahul.</p>
            </div>

            <div className="mt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-solarized-base1 mb-2">Weather</h2>
                <div className="flex items-center gap-3">
                    <span className="text-4xl">🌤️</span>
                    <div>
                        <p className="text-xl font-medium text-solarized-base02">72°F</p>
                        <p className="text-solarized-base1 text-sm">Partly Cloudy</p>
                    </div>
                </div>
            </div>

            <div className="mt-auto">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-solarized-base1 mb-2">Focus of the Day</h2>
                <div className="p-4 bg-solarized-violet/10 rounded-xl border-l-4 border-solarized-violet">
                    <p className="text-solarized-violet font-medium">Complete Research Phase</p>
                </div>
            </div>
        </div>
    );
};

export default DailyBriefing;
