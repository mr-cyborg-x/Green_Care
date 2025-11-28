import { useState } from 'react';
import { X, Droplets, Sun, Scissors, Check } from 'lucide-react';

export default function NewReminderModal({ onClose, onSave, reminder }) {
    const [task, setTask] = useState(reminder ? reminder.task : '');
    const [frequency, setFrequency] = useState(
        reminder ? reminder.frequency : 'Daily'
    );
    const [icon, setIcon] = useState(reminder ? reminder.icon : 'Droplets');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(task, frequency, icon);
    };

    const icons = [
        { name: 'Droplets', icon: Droplets, color: 'text-blue-500' },
        { name: 'Sun', icon: Sun, color: 'text-yellow-500' },
        { name: 'Scissors', icon: Scissors, color: 'text-gray-600' },
        { name: 'Check', icon: Check, color: 'text-green-500' },
    ];

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative p-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>

                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        {reminder ? 'Edit Reminder' : 'Add New Reminder'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="task"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Task Name
                            </label>
                            <input
                                type="text"
                                id="task"
                                value={task}
                                onChange={(e) => setTask(e.target.value)}
                                placeholder="e.g., Water the Monstera"
                                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="frequency"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Frequency
                            </label>
                            <select
                                id="frequency"
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option>Daily</option>
                                <option>Every 2 days</option>
                                <option>Weekly</option>
                                <option>Bi-weekly</option>
                                <option>Monthly</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Icon
                            </label>
                            <div className="flex space-x-2">
                                {icons.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <button
                                            type="button"
                                            key={item.name}
                                            onClick={() => setIcon(item.name)}
                                            className={`p-3 rounded-full transition-colors ${icon === item.name
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            <IconComponent size={20} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg font-semibold transition-colors mt-4"
                        >
                            {reminder ? 'Update' : 'Save'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
