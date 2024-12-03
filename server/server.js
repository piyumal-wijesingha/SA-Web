// const express = require("express");
// const mysql = require("mysql2");
// const cors = require("cors");

// const app = express();
// app.use(cors())

// app.get('/' , (re, res)=> {
//     return res.json("From backend side");

// })

// app.listen(5000, ()=> {
//     console.log
// })


const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: '', // Replace with your MySQL password
    database: 'skillswap', // Replace with your database name
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Register Endpoint
app.post('/register', (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).send({ message: 'All fields are required' });
    }

    const sql = 'INSERT INTO register (email, username, password) VALUES (?, ?, ?)';
    db.query(sql, [email, username, password], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).send({ message: 'Registration failed' });
        }
        res.status(201).send({ message: 'User registered successfully' });
    });
});

// Login Endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ message: 'All fields are required' });
    }

    const sql = 'SELECT * FROM register WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error('Error during login:', err);
            return res.status(500).send({ message: 'Login failed' });
        }

        if (results.length > 0) {
            res.status(200).send({ message: 'Login successful' });
        } else {
            res.status(401).send({ message: 'Invalid credentials' });
        }
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
