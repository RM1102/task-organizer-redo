import { Plus } from 'lucide-react';
import { useState } from 'react';

interface AddTaskProps {
    onAdd: (title: string) => void;
}

const AddTask = ({ onAdd }: AddTaskProps) => {
    const [title, setTitle] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onAdd(title.trim());
            setTitle('');
        }
    };

    return (
        <div className={`mb-6 rounded-lg bg-solarized-base3 border transition-all duration-200 ${isFocused ? 'border-solarized-blue shadow-md' : 'border-solarized-base1/30 shadow-sm'}`}>
            <form onSubmit={handleSubmit} className="flex items-center px-4 py-3">
                <Plus className={`w-5 h-5 mr-3 transition-colors ${isFocused ? 'text-solarized-blue' : 'text-solarized-base1'}`} />
                <input
                    type="text"
                    placeholder="Add a new task..."
                    className="flex-1 bg-transparent border-none outline-none text-solarized-base02 placeholder-solarized-base1 text-lg"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </form>
            {/* Optional: Add details/tags expansion here if focused */}
        </div>
    );
};

export default AddTask;
