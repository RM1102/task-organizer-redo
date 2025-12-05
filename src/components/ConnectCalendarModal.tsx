
import React, { useState } from 'react';

interface ConnectCalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ConnectCalendarModal: React.FC<ConnectCalendarModalProps> = ({ isOpen, onClose }) => {
    const [appleUrl, setAppleUrl] = useState('');

    if (!isOpen) return null;

    const handleConnect = (provider: string) => {
        // TODO: Implement OAuth redirect or API call
        console.log(`Connecting to ${provider}`);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#fdf6e3] p-6 rounded-lg w-96 shadow-xl border border-[#eee8d5] text-[#657b83]">
                <h2 className="text-xl font-bold mb-4 text-[#b58900]">Connect Calendars</h2>

                <div className="space-y-4">
                    <button
                        onClick={() => handleConnect('google')}
                        className="w-full p-2 bg-white border border-gray-300 rounded flex items-center justify-center space-x-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                        <span>Google Calendar</span>
                    </button>

                    <button
                        onClick={() => handleConnect('microsoft')}
                        className="w-full p-2 bg-white border border-gray-300 rounded flex items-center justify-center space-x-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                        <span>Outlook / Microsoft</span>
                    </button>

                    <div className="border-t border-gray-200 pt-4">
                        <label className="block text-sm font-medium mb-1">Apple Calendar (Public URL)</label>
                        <input
                            type="text"
                            value={appleUrl}
                            onChange={(e) => setAppleUrl(e.target.value)}
                            placeholder="webcal://..."
                            className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                        />
                        <button
                            onClick={() => handleConnect('apple')}
                            className="w-full p-2 bg-[#2aa198] text-white rounded text-sm hover:bg-[#268bd2] transition-colors"
                        >
                            Add Apple Calendar
                        </button>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-[#586e75] hover:underline">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
