const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3005;
const router = express.Router();
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', router);


// PostgreSQL connection
// const pool = new Pool({
//     user: process.env.POSTGRES_USER || 'postgres',
//     password: process.env.POSTGRES_PASSWORD || 'data@data',
//     database: process.env.POSTGRES_DB || 'student_master',
//     host: process.env.POSTGRES_HOST || 'localhost',
//     port: Number(process.env.POSTGRES_PORT || 5432),
//     max: 10,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });

// const isAzure = process.env.POSTGRES_HOST?.includes('azure.com');

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: process.env.POSTGRES_PORT,
    // ssl: isAzure
    //     ? { rejectUnauthorized: false }
    //     : false,
});



pool.query('SELECT 1', (err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to PostgreSQL database');
    }
});

pool.query(`
    CREATE TABLE IF NOT EXISTS students (
      studentid SERIAL PRIMARY KEY,
      name TEXT,
      major TEXT,
      email TEXT
    );
`);

// Start server
app.listen(port, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log(`Server is running on port ${port}`);
});

// GET all students
router.get('/students', (req, res) => {
    const sql = 'SELECT * FROM students';
    pool.query(sql, (err, result) => {
        if (err) return res.json(err);
        return res.status(200).json(result.rows);
    });
});

// GET one student by ID
router.get('/students/:studentid', (req, res) => {
    const stdId = Number(req.params.studentid);
    const sql = 'SELECT * FROM students WHERE studentid = $1';
    pool.query(sql, [stdId], (err, result) => {
        if (err) return res.json(err);
        return res.status(200).json(result.rows);
    });
});

// POST create student
router.post('/students', (req, res) => {
    const { name, major, email } = req.body;
    const sql = 'INSERT INTO students(name, major, email) VALUES($1, $2, $3) RETURNING *';
    pool.query(sql, [name, major, email], (err, result) => {
        if (err) return res.json(err);
        return res.status(201).json(result.rows[0]);
    });
});

// PATCH update student
router.patch('/students/:studentid', (req, res) => {
    const stdId = Number(req.params.studentid);
    const { name, major, email } = req.body;
    const sql = 'UPDATE students SET name = $1, major = $2, email = $3 WHERE studentid = $4';
    pool.query(sql, [name, major, email, stdId], (err, result) => {
        if (err) return res.json(err);
        return res.status(200).send(`Student updated successfully: ${stdId}`);
    });
});

// DELETE student
router.delete('/students/:studentid', (req, res) => {
    const stdId = Number(req.params.studentid);
    const sql = 'DELETE FROM students WHERE studentid = $1';
    pool.query(sql, [stdId], (err, result) => {
        if (err) return res.json(err);
        return res.status(200).send(`Student deleted successfully: ${stdId}`);
    });
});
 
