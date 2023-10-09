const http = require('http');
const fs = require('fs');
const mysql = require('mysql');
const path = require('path');
const url = require('url');
const { error } = require('console');

const port = 3016;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'database_password', // update the mysql password
    database: 'userdb',
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

const server = http.createServer((req, res) => {
    const { pathname } = url.parse(req.url);

    if (req.method === 'GET' && pathname === '/register') {
        fs.readFile(path.join(__dirname, 'register.html'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (req.method === 'GET' && pathname === '/login') {
        fs.readFile(path.join(__dirname, 'login.html'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (req.method === 'POST' && pathname === '/register') {
        let data = '';

        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            const formData = new URLSearchParams(data);
            const firstname = formData.get('firstname');
            const lastname = formData.get('lastname');
            const email = formData.get('email');
            const password = formData.get('password');
            const confirm_password = formData.get('confirm_password');

            // Validation logic
            if (password !== confirm_password) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Passwords do not match.');
            } else if (!isValidEmail(email)) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid email address.');
            } else {
                // Store details in the MySQL database (you need to create the table)
                const query = 'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)';
                db.query(query, [firstname, lastname, email, password], (err) => {
                    if (err) {
                        console.error('MySQL query error:', err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end('Congratulations! You have successfully registered details.');
                    }
                });
            }
        });
    } else if (req.method === 'POST' && pathname === '/login') {
        let data = '';

        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            const formData = new URLSearchParams(data);
            const email = formData.get('email');
            const password = formData.get('password');

            // Validation logic
            // Check the user's credentials in the MySQL database
            db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
                if (err) {
                    console.error('MySQL query error:', err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }

                if (results.length === 0) {
                    res.writeHead(302, { 'Location': '/register?error=InvalidEmailOrPassword' });
                    res.end();
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('Login successful');
                }
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Helper function to validate email address
function isValidEmail(email) {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegex.test(email);
}
