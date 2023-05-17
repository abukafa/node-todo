const express = require('express');
const router = express.Router();
const { db, migration } = require('../src/db');

// get all todos
router.get('/', async (req, res) => {
    const [rows] = await db.query(`SELECT * FROM todos`);
    res.json({ status: 'Success', message: 'Success', data: rows });
});

// get todo
router.get('/:id', async (req, res) => {
    const [rows] = await db.query(`SELECT * FROM todos WHERE todo_id = ?`, [req.params.id]);
    res.json({ status: 'Success', message: 'Success', data: rows });
});

// create todo
router.post('/', async (req, res) => {
    const query = 'INSERT INTO todos (activity_group_id, title, priority, is_active) VALUES (?, ?, ?, ?)';
    const values = [req.body.activity_group_id, req.body.title, req.body.priority || 'high', req.body.is_active, req.body.created_at];

    try {
        const [result] = await db.query(query, values);
        const insertedId = result.insertId;
        const [newResult] = await db.query('SELECT * FROM todos WHERE todo_id = ?', [insertedId]);
        res.json({
            status: 'Success',
            message: 'todo created',
            data: newResult[0],
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: error.message,
        });
    }
});

// update todo
router.put('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM todos WHERE todo_id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({
                status: 'Error',
                message: 'todo not found',
            });
        }

        const query = 'UPDATE todos SET activity_group_id = ?, title = ?, priority = ?, is_active = ?, created_at = ? WHERE todo_id = ?';

        const activityGroupId = req.body.activity_group_id || rows.activity_group_id;
        const title = req.body.title || rows.title;
        const priority = req.body.priority || rows.priority;
        const isActive = req.body.is_active || rows.is_active;
        const createdAt = req.body.created_at || rows.created_at;

        const values = [activityGroupId, title, priority, isActive, createdAt, req.params.id];

        const [result] = await db.query(query, values);

        const [newResult] = await db.query('SELECT * FROM todos WHERE todo_id = ?', [req.params.id]);

        res.json({
            status: 'Success',
            message: 'todo updated',
            data: newResult[0],
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: error.message,
        });
    }
});



// delete todo
router.delete('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM todos WHERE todo_id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({
                status: 'Error',
                message: 'todo not found',
            });
        }

        const [result] = await db.query('DELETE FROM todos WHERE todo_id = ?', [req.params.id]);

        res.json({
            status: 'Success',
            message: 'todo deleted',
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: error.message,
        });
    }
});

module.exports = router;