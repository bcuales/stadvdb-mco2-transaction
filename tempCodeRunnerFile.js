require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'static', 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.render('mainPage');
});

app.get('/addApp', (req, res) => {
  res.render('addApp');
});

app.get('/searchApp', (req, res) => {
  res.render('searchApp');
});

app.get('/editApp', (req, res) => {
  res.render('editApp');
});

app.get('/deleteApp', (req, res) => {
  res.render('deleteApp');
});

// Search appointment
app.post('/searchAppointment', async (req, res) => {
  const appointmentId = req.body.appointmentId;
  try {
    // Perform the search operation in the database using the provided appointmentId
    const appointment = await db.searchAppointmentById(appointmentId);
    if (appointment) {
      res.json(appointment); // Return the found appointment as JSON
    } else {
      res.status(404).send('Appointment not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error searching for appointment');
  }
});


// Delete appointment
app.post('/deleteAppointment', async (req, res) => {
  const appointmentId = req.body.appointmentId;
  try {
    const result = await db.deleteAppointmentById(appointmentId);
    if (result.affectedRows > 0) {
      res.send(`Appointment ${appointmentId} deleted successfully`);
    } else {
      res.status(404).send('Appointment not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting appointment');
  }
});

// Start the server
const PORT = process.env.PORT || 3000; // Set PORT
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});