const express = require('express');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('mainPage', { title: 'Transaction Management' });
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
