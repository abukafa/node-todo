require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const { db, migration } = require('./db');

const activity = require('../routes/activity');
const todo = require('../routes/todo');

const port = process.env.MYSQL_PORT || 3030;
const host = process.env.MYSQL_HOST || 'localhost';

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use('/activity-groups', activity);
app.use('/todo-items', todo);

// error handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message || 'An error occurred.',
    });
});

const run = async () => {
    await migration();
    app.listen(port);
    console.log(`Server run on http://${host}:${port}/`);
};

run();