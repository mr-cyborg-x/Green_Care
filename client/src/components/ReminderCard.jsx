import { Edit3, Trash2, Droplets, Sun, Scissors, Check } from 'lucide-react';

export default function ReminderCard({ reminder, onEdit, onDelete, onToggle }) {
    const getIcon = (iconName) => {
        switch (iconName) {
            case 'Droplets':
                return <Droplets className="text-blue-500" size={24} />;
            case 'Sun':
                return <Sun className="text-yellow-500" size={24} />;
            case 'Scissors':
                return <Scissors className="text-gray-600" size={24} />;
            case 'Check':
                return <Check className="text-green-500" size={24} />;
            default:
                return <Droplets className="text-blue-500" size={24} />;
        }
    };

    const getBgColor = (iconName) => {
        switch (iconName) {
            case 'Droplets':
                return 'bg-blue-50';
            case 'Sun':
                return 'bg-yellow-50';
            case 'Scissors':
                return 'bg-gray-50';
            case 'Check':
                return 'bg-green-50';
            default:
                return 'bg-blue-50';
        }
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between">
            <div className="flex items-center">
                <div
                    onClick={() => onEdit(reminder)}
                    className={`p-3 ${getBgColor(reminder.icon)} rounded-full cursor-pointer hover:opacity-80 transition-opacity`}
                >
                    {getIcon(reminder.icon)}
                </div>
                <div className="ml-4 flex-1">
                    <div className={`font-semibold text-gray-800 ${reminder.completed ? 'line-through text-gray-400' : ''}`}>
                        {reminder.task}
                    </div>
                    <div className="text-sm text-gray-500">{reminder.time}</div>
                </div>
            </div>
            <div className="flex items-center space-x-3">
                <input
                    type="checkbox"
                    checked={reminder.completed || false}
                    onChange={(e) => onToggle(reminder, e.target.checked)}
                    className="w-5 h-5 text-green-500 rounded focus:ring-green-500 cursor-pointer"
                />
                <button
                    onClick={() => onEdit(reminder)}
                    className="text-gray-400 hover:text-blue-500"
                >
                    <Edit3 size={20} />
                </button>
                <button
                    onClick={() => onDelete(reminder._id)}
                    className="text-gray-400 hover:text-red-500"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
}
