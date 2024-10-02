// server.js

// Import required modules
const express = require('express'); // Web framework for Node.js
const bodyParser = require('body-parser'); // Middleware to parse request bodies
const fs = require('fs'); // File system module to handle file operations
const path = require('path'); // Module for handling file and directory paths

const app = express(); // Create an instance of Express
const PORT = 3000; // Define the port number

// Serve static files (like CSS)
app.use(express.static(__dirname)); // Add this line

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML file when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Send index.html file
});

// Handle form submission
app.post('/submit', (req, res) => {
    console.log(req.body); // Log the received data

    const { name, batch, semester, email, mobile } = req.body;
    
    if (!name || !batch || !semester || !email || !mobile) {
        return res.send('All fields are required.');
    }

    const data = `Name: ${name}, Batch: ${batch}, Semester: ${semester}, Email: ${email}, Mobile: ${mobile}\n`;

    fs.appendFile('data.txt', data, (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.send('Error saving data. Please try again.');
        }
        res.send('<h1>Registration Successful!</h1><p>Thank you for registering.</p><a href="/">Go back to the form</a>');
    });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Log server running message
});
