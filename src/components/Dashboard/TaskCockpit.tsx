import React, { useState } from 'react';
import { useAppStore } from '../../store';
import type { UnifiedTask } from '../../types';
import DraggableTaskItem from './DraggableTaskItem';

const TaskCockpit: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'college' | 'personal'>('all');
    const [isAdding, setIsAdding] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const { tasks, toggleTaskCompletion, addTask } = useAppStore();

    // Helper to determine task type based on provider or tags
    const getTaskType = (task: UnifiedTask): 'college' | 'personal' | 'other' => {
        if (task.provider === 'microsoft') return 'college';
        if (task.provider === 'google' || task.provider === 'apple') return 'personal';
        // Fallback checks
        if (task.tags?.includes('college')) return 'college';
        return 'personal'; // Default
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        await addTask({
            title: newTaskTitle,
            provider: 'local', // Default for now
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        setNewTaskTitle('');
        setIsAdding(false);
    };

    const filteredTasks = tasks.filter(t => {
        if (activeTab === 'all') return true;
        return getTaskType(t) === activeTab;
    });

    return (
        <div className="col-span-3 h-full flex flex-col bg-solarized-base3 text-solarized-base03 rounded-2xl p-4 shadow-lg overflow-hidden border border-solarized-base2">
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-1">Cockpit</h2>
                <p className="text-solarized-base01 text-xs">Unified Task Stream</p>
            </div>

            {/* Context Toggles */}
            <div className="flex p-1 bg-solarized-base2 rounded-lg mb-6">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'all' ? 'bg-solarized-base3 text-solarized-base03 shadow' : 'text-solarized-base01 hover:text-solarized-base00'}`}
                >
                    All
                </button>
                <button
                    onClick={() => setActiveTab('college')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'college' ? 'bg-solarized-base3 text-solarized-blue shadow' : 'text-solarized-base01 hover:text-solarized-blue'}`}
                >
                    College
                </button>
                <button
                    onClick={() => setActiveTab('personal')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'personal' ? 'bg-solarized-base3 text-solarized-green shadow' : 'text-solarized-base01 hover:text-solarized-green'}`}
                >
                    Personal
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-3">
                    {filteredTasks.length === 0 ? (
                        <div className="text-center py-8 text-solarized-base1 text-sm italic">
                            No tasks found.
                        </div>
                    ) : filteredTasks.map(task => {
                        const type = getTaskType(task);
                        return (
                            <DraggableTaskItem key={task.id} id={task.id}>
                                <div
                                    onClick={() => toggleTaskCompletion(task.id)}
                                    // Removed cursor-pointer from parent since draggable handle might want it
                                    // But we will keep it for now as the whole item is draggable
                                    className={`p-3 bg-solarized-base2 rounded-xl border border-solarized-base2 hover:border-solarized-base1/20 transition-colors group cursor-grab ${task.completed ? 'opacity-50' : ''}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${type === 'college' ? 'bg-solarized-blue/10 text-solarized-blue' : 'bg-solarized-green/10 text-solarized-green'}`}>
                                            {task.provider}
                                        </span>
                                        <span className="text-xs text-solarized-base1">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Date'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${task.completed ? 'bg-solarized-green border-solarized-green' : 'border-solarized-base1'}`}>
                                            {task.completed && <div className="w-2 h-2 bg-white rounded-full" />}
                                        </div>
                                        <p className={`font-medium text-sm text-solarized-base03 bg-transparent ${task.completed ? 'line-through text-solarized-base1' : ''}`}>{task.title}</p>
                                    </div>
                                </div>
                            </DraggableTaskItem>
                        )
                    })}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-solarized-base2">
                {isAdding ? (
                    <form onSubmit={handleAddTask} className="flex gap-2">
                        <input
                            type="text"
                            autoFocus
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            onBlur={() => !newTaskTitle && setIsAdding(false)}
                            onKeyDown={(e) => e.key === 'Escape' && setIsAdding(false)}
                            placeholder="Type task..."
                            className="flex-1 py-2 px-3 bg-solarized-base2 rounded-lg text-sm text-solarized-base03 border border-transparent focus:border-solarized-blue focus:outline-none placeholder-solarized-base1"
                        />
                        <button type="submit" className="py-2 px-4 bg-solarized-blue text-white rounded-lg text-sm font-medium hover:bg-solarized-blue/90">
                            Add
                        </button>
                    </form>
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full py-2 bg-solarized-base2 hover:bg-solarized-base2/80 rounded-lg text-sm text-solarized-base00 font-medium transition-colors">
                        + Quick Add
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskCockpit;
