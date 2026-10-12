const express = require('express');
const router = express.Router();
const dbPromise = require('../db');

router.get('/', async (req, res) => {
    try {
        const db = await dbPromise;
        const query = `
            SELECT t.id, t.title, t.description, t.status, t.priority, t.created_at, 
                   u.id AS user_id, u.name AS user_name, u.email AS user_email
            FROM Tasks t
            LEFT JOIN Users u ON t.assigned_to = u.id
            ORDER BY t.created_at DESC
        `;
        const rows = await db.all(query);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ success: false, error: 'Failed to retrieve tasks' });
    }
});

router.post('/', async (req, res) => {
    const { title, description, priority, assigned_to } = req.body;
    
    if (!title || !title.trim()) {
        return res.status(400).json({ success: false, error: 'Task title is required' });
    }

    try {
        const db = await dbPromise;
        const query = `
            INSERT INTO Tasks (title, description, priority, assigned_to)
            VALUES (?, ?, ?, ?)
        `;
        const result = await db.run(query, [
            title.trim(), 
            description?.trim() || null, 
            priority || 'Low', 
            assigned_to || null
        ]);
        
        res.status(201).json({ 
            success: true, 
            data: { 
                id: result.lastID, 
                title: title.trim(), 
                description: description?.trim() || null, 
                priority: priority || 'Low', 
                assigned_to, 
                status: 'pending' 
            } 
        });
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ success: false, error: 'Failed to create task' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { status, title, description, priority, assigned_to } = req.body;

    try {
        const db = await dbPromise;

        if (status) {
            const validStatuses = ['pending', 'in_progress', 'completed'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ 
                    success: false, 
                    error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
                });
            }
            const result = await db.run('UPDATE Tasks SET status = ? WHERE id = ?', [status, id]);
            if (result.changes === 0) {
                return res.status(404).json({ success: false, error: 'Task not found' });
            }
            return res.json({ success: true, message: 'Status updated' });
        }

        if (title) {
            const result = await db.run(
                'UPDATE Tasks SET title = ?, description = ?, priority = ?, assigned_to = ? WHERE id = ?',
                [title.trim(), description?.trim() || null, priority || 'Low', assigned_to || null, id]
            );
            if (result.changes === 0) {
                return res.status(404).json({ success: false, error: 'Task not found' });
            }
            return res.json({ success: true, message: 'Task updated successfully' });
        }

        return res.status(400).json({ success: false, error: 'No update parameters provided' });
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).json({ success: false, error: 'Failed to update task' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const db = await dbPromise;
        const result = await db.run('DELETE FROM Tasks WHERE id = ?', [id]);

        if (result.changes === 0) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        res.json({ success: true, message: 'Task deleted successfully' });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ success: false, error: 'Failed to delete task' });
    }
});

module.exports = router;
