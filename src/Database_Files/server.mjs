import express from 'express';
import bodyParser from 'body-parser';
import { collectAndInsertDeviceInfo, insertForm } from './oracle_db.mjs';

const app = express();

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
