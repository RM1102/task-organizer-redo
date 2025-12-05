import { Layout, Calendar, CheckSquare, Settings, Star } from 'lucide-react';

interface SidebarProps {
    currentView: 'inbox' | 'calendar';
    onViewChange: (view: 'inbox' | 'calendar') => void;
}

const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
    return (
        <div className="w-64 h-full bg-solarized-base2 border-r border-solarized-base1/20 flex flex-col p-4 space-y-6">
            <div className="flex items-center space-x-2 px-2 py-1">
                <div className="w-8 h-8 bg-solarized-blue rounded-lg flex items-center justify-center">
                    <CheckSquare className="text-solarized-base3 w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold text-solarized-base03">TaskFlow</h1>
            </div>

            <nav className="space-y-1">
                <NavItem
                    icon={Layout}
                    label="Inbox"
                    count={3}
                    active={currentView === 'inbox'}
                    onClick={() => onViewChange('inbox')}
                />
                <NavItem
                    icon={Calendar}
                    label="Calendar"
                    active={currentView === 'calendar'}
                    onClick={() => onViewChange('calendar')}
                />
                <NavItem icon={Star} label="Important" />
            </nav>

            <div className="pt-4 border-t border-solarized-base1/10">
                <h3 className="px-3 text-xs font-semibold text-solarized-base0 uppercase tracking-wider mb-2">Projects</h3>
                <nav className="space-y-1">
                    <NavItem icon={CheckSquare} label="Personal" color="text-solarized-green" />
                    <NavItem icon={CheckSquare} label="Work" color="text-solarized-orange" />
                </nav>
            </div>

            <div className="mt-auto">
                <NavItem icon={Settings} label="Settings" />
            </div>
        </div>
    );
};

const NavItem = ({ icon: Icon, label, count, active, color, onClick }: { icon: any, label: string, count?: number, active?: boolean, color?: string, onClick?: () => void }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${active ? 'bg-solarized-base3 shadow-sm text-solarized-base03 font-medium' : 'text-solarized-base01 hover:bg-solarized-base3/50 hover:text-solarized-base02'}`}
        >
            <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${color || (active ? 'text-solarized-blue' : 'text-solarized-base0')}`} />
                <span>{label}</span>
            </div>
            {count && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${active ? 'bg-solarized-blue/10 text-solarized-blue' : 'bg-solarized-base1/20 text-solarized-base0'}`}>
                    {count}
                </span>
            )}
        </button>
    );
};

export default Sidebar;
