import express from 'express';
import bodyParser from 'body-parser';
import { insertApplicant } from './oracle_db.mjs';

const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle form submission
app.post('/submit', async (req, res) => {
    try {
        await insertApplicant(req.body);
        res.send('Form submitted successfully!');
    } catch (err) {
        res.status(500).send('Error processing your request');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
