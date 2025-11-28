const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const authMiddleware = require('../middleware/auth');

// Get user's reminders
router.get('/', authMiddleware, async (req, res) => {
    try {
        const reminders = await Reminder.find({ user: req.userId })
            .sort({ createdAt: -1 });

        res.json(reminders);
    } catch (error) {
        console.error('Error fetching reminders:', error);
        res.status(500).json({ error: 'Failed to fetch reminders' });
    }
});

// Create reminder
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { icon, task, time, frequency } = req.body;

        const reminder = new Reminder({
            user: req.userId,
            icon: icon || 'Droplets',
            task,
            time: time || `Set for ${frequency}`,
            frequency
        });

        await reminder.save();
        res.status(201).json(reminder);
    } catch (error) {
        console.error('Error creating reminder:', error);
        res.status(500).json({ error: 'Failed to create reminder' });
    }
});

// Update reminder
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { icon, task, time, frequency } = req.body;

        const reminder = await Reminder.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!reminder) {
            return res.status(404).json({ error: 'Reminder not found' });
        }

        if (icon) reminder.icon = icon;
        if (task) reminder.task = task;
        if (time) reminder.time = time;
        if (frequency) reminder.frequency = frequency;
        if (req.body.completed !== undefined) {
            reminder.completed = req.body.completed;
            if (reminder.completed) {
                reminder.completedAt = new Date();
            } else {
                reminder.completedAt = undefined;
            }
        }

        await reminder.save();
        res.json(reminder);
    } catch (error) {
        console.error('Error updating reminder:', error);
        res.status(500).json({ error: 'Failed to update reminder' });
    }
});

// Delete reminder
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const result = await Reminder.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

        if (!result) {
            return res.status(404).json({ error: 'Reminder not found' });
        }

        res.json({ success: true, message: 'Reminder deleted' });
    } catch (error) {
        console.error('Error deleting reminder:', error);
        res.status(500).json({ error: 'Failed to delete reminder' });
    }
});

module.exports = router;
