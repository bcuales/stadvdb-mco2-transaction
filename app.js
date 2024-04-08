const express = require('express');
const path = require('path');
const app = express();

// Set the directory for views
app.set('views', path.join(__dirname, 'views'));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Set up static files
app.use(express.static(path.join(__dirname, 'public')));

// Route handler for the root path
app.get('/mainPage', (req, res) => {
  res.render('mainPage', { title: 'Transaction Management' });
});

// Route handlers for other paths
app.get('/addApp', (req, res) => {
  res.render('addApp', { title: 'Add Appointment' });
});

app.get('/searchApp', (req, res) => {
  res.render('searchApp', { title: 'Search Appointment' });
});

app.get('/editApp', (req, res) => {
  res.render('editApp', { title: 'Edit Appointment' });
});

app.get('/deleteApp', (req, res) => {
  res.render('deleteApp', { title: 'Delete Appointment' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
