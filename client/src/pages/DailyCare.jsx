import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { remindersAPI } from '../api/axios';
import ReminderCard from '../components/ReminderCard';
import NewReminderModal from '../components/NewReminderModal';

export default function DailyCare() {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingReminder, setEditingReminder] = useState(null);

    useEffect(() => {
        fetchReminders();
    }, []);

    const fetchReminders = async () => {
        try {
            const response = await remindersAPI.getAll();
            setReminders(response.data);
        } catch (error) {
            console.error('Error fetching reminders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddOrUpdate = async (task, frequency, icon) => {
        try {
            if (editingReminder) {
                const response = await remindersAPI.update(editingReminder._id, {
                    task,
                    frequency,
                    icon,
                });
                setReminders(reminders.map(r =>
                    r._id === editingReminder._id ? response.data : r
                ));
            } else {
                const response = await remindersAPI.create({
                    task,
                    frequency,
                    icon,
                });
                setReminders([response.data, ...reminders]);
            }
            setShowModal(false);
            setEditingReminder(null);
        } catch (error) {
            console.error('Error saving reminder:', error);
        }
    };

    const handleEdit = (reminder) => {
        setEditingReminder(reminder);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await remindersAPI.delete(id);
            setReminders(reminders.filter(r => r._id !== id));
        } catch (error) {
            console.error('Error deleting reminder:', error);
        }
    };

    const handleToggleComplete = async (reminder, completed) => {
        try {
            const response = await remindersAPI.update(reminder._id, {
                ...reminder,
                completed
            });
            setReminders(reminders.map(r =>
                r._id === reminder._id ? response.data : r
            ));
        } catch (error) {
            console.error('Error updating reminder status:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-t-green-500 border-gray-200 rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading reminders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-center px-4 z-30">
                <span className="text-2xl mr-2">🪴</span>
                <h1 className="text-xl font-semibold text-gray-800">Daily Care</h1>
            </header>

            <main className="pt-16 pb-4">
                <div className="max-w-md mx-auto p-4 space-y-3">
                    {reminders.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-4">No reminders yet. Add your first one!</p>
                        </div>
                    ) : (
                        reminders.map((reminder) => (
                            <ReminderCard
                                key={reminder._id}
                                reminder={reminder}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onToggle={handleToggleComplete}
                            />
                        ))
                    )}

                    <button
                        onClick={() => {
                            setEditingReminder(null);
                            setShowModal(true);
                        }}
                        className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg font-semibold text-base transition-colors shadow-md hover:shadow-lg mt-4 flex items-center justify-center gap-2"
                    >
                        <Plus size={20} />
                        Add Reminder
                    </button>
                </div>
            </main>

            {showModal && (
                <NewReminderModal
                    onClose={() => {
                        setShowModal(false);
                        setEditingReminder(null);
                    }}
                    onSave={handleAddOrUpdate}
                    reminder={editingReminder}
                />
            )}
        </div>
    );
}
