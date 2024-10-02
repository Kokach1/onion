const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the 'public' folder

// Serve the registration form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
    const { name, batch, semester, email, mobile } = req.body;

    // Create a new workbook or read existing
    let workbook;
    const filePath = path.join(__dirname, 'data.xlsx');

    if (fs.existsSync(filePath)) {
        workbook = xlsx.readFile(filePath);
    } else {
        workbook = xlsx.utils.book_new(); // Create a new workbook if it doesn't exist
    }

    // Prepare data
    const data = [
        { Name: name, Batch: batch, Semester: semester, Email: email, Mobile: mobile }
    ];

    // Convert data to a worksheet
    const worksheet = xlsx.utils.json_to_sheet(data);

    // Check if the first sheet exists
    const sheetName = 'Registration';
    if (!workbook.Sheets[sheetName]) {
        xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
    } else {
        // Append to existing sheet
        xlsx.utils.sheet_add_json(workbook.Sheets[sheetName], data, { skipHeader: true, origin: -1 });
    }

    // Write the workbook to file
    xlsx.writeFile(workbook, filePath);

    // Send a response back to the user
    res.send('<h1>Registration Successful!</h1><p>Thank you for registering.</p>');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
