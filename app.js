const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'static', 'html')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'html', 'mainPage.html'));
});

app.get('/addApp', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'html', 'addApp.html'));
});

app.get('/searchApp', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'html', 'searchApp.html'));
});

app.get('/editApp', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'html', 'editApp.html'));
});

app.get('/deleteApp', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'html', 'deleteApp.html'));
});

// Search appointment
app.post('/searchAppointment', async (req, res) => {
  const appointmentId = req.body.appointmentId;
  try {
    const appointment = await db.searchAppointmentById(appointmentId);
    if (appointment) {
      res.json(appointment);
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
