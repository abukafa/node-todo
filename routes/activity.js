const express = require('express');
const router = express.Router();
const { db, migration } = require('../src/db');

router.use(express.json());

// get all activities
router.get('/', async (req, res) => {
    const [rows] = await db.query(`SELECT * FROM activities`);
    res.json({ status: 'Success', message: 'Success', data: rows });
});

// get activity
router.get('/:id', async (req, res) => {
    const [rows] = await db.query(`SELECT * FROM activities WHERE activity_id = ?`, [req.params.id]);
    res.json({ status: 'Success', message: 'Success', data: rows });
});

router.post('/', async (req, res) => {
    const query = 'INSERT INTO activities (title, email) VALUES (?, ?)';
    const values = [req.body.title, req.body.email];
    try {
        const [result] = await db.query(query, values);
        const insertedId = result.insertId;
        const [newResult] = await db.query('SELECT * FROM activities WHERE activity_id = ?', [insertedId]);
        res.json({
            status: 'Success',
            message: 'Activity created',
            data: newResult[0],
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: error.message,
        });
    }
});


// update activity
router.put('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM activities WHERE activity_id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({
                status: 'Error',
                message: 'Activity not found',
            });
        }

        const title = req.body.title ? req.body.title :  rows.title;
        const email = req.body.email ? req.body.email :  rows.email;

        const query = 'UPDATE activities SET title = ?, email = ? WHERE activity_id = ?';
        const values = [title, email, req.params.id];

        const [result] = await db.query(query, values);

        const [newResult] = await db.query('SELECT * FROM activities WHERE activity_id = ?', [req.params.id]);

        res.json({
            status: 'Success',
            message: 'Activity updated',
            data: newResult[0],
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: error.message,
        });
    }
});

// delete activity
router.delete('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM activities WHERE activity_id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({
                status: 'Error',
                message: 'Activity not found',
            });
        }

        const [result] = await db.query('DELETE FROM activities WHERE activity_id = ?', [req.params.id]);

        res.json({
            status: 'Success',
            message: 'Activity deleted',
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: error.message,
        });
    }
});

module.exports = router;
