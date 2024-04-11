const mysql = require('mysql2')
const express = require('express');

const app = express();

// Central
const poolConfig1 = {
    host: 'ccscloud.dlsu.edu.ph', 
    port: 20210, 
    user: 'root', 
    password: 'rFyY9m3JNa4HUwG2nBkz6sXc', 
    database: 'Node01', 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Luzon
const poolConfig2 = {
    host: 'ccscloud.dlsu.edu.ph', 
    port: 20211, 
    user: 'root', 
    password: 'rFyY9m3JNa4HUwG2nBkz6sXc', 
    database: 'Node02', 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// VisMin
const poolConfig3 = {
  host: 'ccscloud.dlsu.edu.ph', 
  port: 20212, 
  user: 'root', 
  password: 'rFyY9m3JNa4HUwG2nBkz6sXc', 
  database: 'Node03', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool1 = mysql.createPool(poolConfig1).promise();
const pool2 = mysql.createPool(poolConfig2).promise();
const pool3 = mysql.createPool(poolConfig3).promise();

// // Example query using pool2
// pool1.query('SELECT * FROM mco2_appts')
//   .then(([rows]) => {
//     console.log('Query results from pool1:', rows);
//   })
//   .catch((error) => {
//     console.error('Error executing query:', error);
//   });

module.exports = {
  pool1,
  pool2,
  pool3,
  searchAppointmentById // Export the function
};

async function searchAppointmentById(appointmentId) {
    try {
        const [results, _] = await central.query('SELECT * FROM mco2_appts WHERE appointment_id = ?', [appointmentId]);
        return results;
    } catch (error) {
        throw error;
    }
}
