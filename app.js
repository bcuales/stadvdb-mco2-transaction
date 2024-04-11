const { searchAppointmentById, deleteAppointmentById } = require('./db');

require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./db');

const port = 3000;

const app = express();

app.use(express.static(path.join(__dirname, 'static')));

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

//Create appointment
app.post('/createAppointment', async (req, res) => {
  const appointmentDetails = req.body;
  try {
      const result = await db.createAppointment(appointmentDetails);
      res.status(200).send('Appointment created successfully');
  } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).send('Error creating appointment');
  }
});


// Delete appointment
app.post('/deleteAppointment', async (req, res) => {
  const appointmentId = req.body.appointmentId;
  try {
    const result = await deleteAppointmentById(appointmentId);
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

// Edit appointment
app.post('/editAppointment', async (req, res) => {
  const formData = req.body;
  try {
    // Call the function to edit the appointment in the database
    const result = await db.editAppointment(formData);
    if (result) {
      res.send('Appointment edited successfully');
    } else {
      res.status(404).send('Failed to edit appointment');
    }
  } catch (error) {
    console.error('Error editing appointment:', error);
    res.status(500).send('Error editing appointment');
  }
});

// Search appointment 
app.post('/searchAppointment', async (req, res) => {
  const appointmentId = req.body.appointmentId;
  try {
    // Call the searchAppointmentById function
    const appointment = await searchAppointmentById(appointmentId);
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

// Start the server
const PORT = process.env.PORT || 3000; // Set PORT
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});