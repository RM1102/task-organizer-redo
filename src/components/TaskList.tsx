import TaskItem from './TaskItem';
import type { Task } from '../types';

interface TaskListProps {
    tasks: Task[];
    onToggleTask: (id: string) => void;
}

const TaskList = ({ tasks, onToggleTask }: TaskListProps) => {
    if (tasks.length === 0) {
        return (
            <div className="text-center py-20 opacity-50">
                <p className="text-solarized-base01 text-lg">No tasks found. Enjoy your day!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {tasks.map(task => (
                <TaskItem key={task.id} task={task} onToggle={onToggleTask} />
            ))}
        </div>
    );
};

export default TaskList;
