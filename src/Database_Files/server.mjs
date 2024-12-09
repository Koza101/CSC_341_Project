import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { collectAndInsertDeviceInfo, insertForm } from './oracle_db.mjs';
import { connectToDatabase } from './oracle_db.mjs';
import cors from 'cors';

const corsOptions = {
    origin: ['http://localhost:8080', 'http://localhost:8080/users'], // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true // Allow cookies if needed
};

const app = express();

app.use(cors(corsOptions));

app.use(bodyParser.json());

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle form submission
app.post('/submit', async (req, res) => {
    try {
        console.log('Form Data Received:', req.body); // Log the received form data
        await collectAndInsertDeviceInfo();
        await insertForm(req.body);
        res.send('Form and system information submitted successfully!');
    } catch (err) {
        console.error('Error processing the submission:', err);
        res.status(500).send('Error processing your request');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

//  Getting user information
app.get('/api/users', async (req, res) => {
    try {
        console.log('Connecting to the database...');
        const connection = await connectToDatabase();
        console.log('Connected. Executing query...');
        
        const query = 'SELECT * FROM users';
        const result = await connection.execute(query);

        console.log('Query executed. Result:', result.rows); // Log the query result
        res.json(result.rows); // Send rows as JSON

        await connection.close();
        console.log('Connection closed.');
    } catch (err) {
        console.error('Error in /api/users:', err);
        res.status(500).send('Error fetching users');
    }
});

// More getting user information
app.get('/api/users/:id', async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const query = 'SELECT * FROM users WHERE user_ID = :id';
        const result = await connection.execute(query, [req.params.id]);
        res.json(result.rows[0]); // Send the first result
        await connection.close();
    } catch (err) {
        console.error('Error fetching user details:', err);
        res.status(500).send('Error fetching user details');
    }
});


// Updating user information
app.put('/api/users/:id', async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const query = `
            UPDATE users
            SET first_name = :firstName, last_name = :lastName, city = :city, "state" = :state, zipcode = :zipCode
            WHERE user_ID = :id
        `;
        await connection.execute(query, {
            id: req.params.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode
        }, { autoCommit: true });
        res.send('User updated successfully!');
        await connection.close();
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Error updating user');
    }
});

// Deleting user information
app.delete('/api/users/:id', async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const query = 'DELETE FROM users WHERE user_ID = :id';
        await connection.execute(query, [req.params.id], { autoCommit: true });
        res.send('User deleted successfully!');
        await connection.close();
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Error deleting user');
    }
});

app.get('/api/device', async (req, res) => {
    console.log('Received request for /api/device');
    try {
        console.log('Fetching device from the database...');
        const connection = await connectToDatabase();
        const query = 'SELECT * FROM device'; // Fetch all device
        const result = await connection.execute(query);
        console.log('Device fetched successfully:', result.rows);
        res.json(result.rows); // Return device data as JSON
        await connection.close();
    } catch (err) {
        console.error('Error fetching device:', err);
        res.status(500).send('Error fetching device');
    }
});