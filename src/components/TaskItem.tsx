import { Check, Calendar, Tag } from 'lucide-react';
import type { Task } from '../types';

interface TaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
}

const TaskItem = ({ task, onToggle }: TaskItemProps) => {
    return (
        <div className={`p-4 rounded-lg bg-solarized-base2 border border-solarized-base1/20 shadow-sm flex items-center justify-between group transition-all hover:shadow-md ${task.completed ? 'opacity-60' : ''}`}>
            <div className="flex items-center space-x-3 flex-1">
                <button
                    onClick={() => onToggle(task.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-solarized-green border-solarized-green' : 'border-solarized-base1/50 hover:border-solarized-green'}`}
                >
                    {task.completed && <Check className="w-3 h-3 text-white" />}
                </button>

                <div className="flex flex-col">
                    <span className={`text-solarized-base02 font-medium ${task.completed ? 'line-through text-solarized-base01' : ''}`}>
                        {task.title}
                    </span>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-solarized-base0">
                        {task.dueDate && (
                            <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{task.dueDate}</span>
                            </div>
                        )}
                        {task.priority && (
                            <span className={`uppercase tracking-wide font-semibold ${task.priority === 'high' ? 'text-solarized-red' :
                                task.priority === 'medium' ? 'text-solarized-orange' : 'text-solarized-green'
                                }`}>
                                {task.priority}
                            </span>
                        )}
                        {task.tags && task.tags.map(tag => (
                            <div key={tag} className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-solarized-base3 text-solarized-base00">
                                <Tag className="w-2.5 h-2.5" />
                                <span>{tag}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskItem;
