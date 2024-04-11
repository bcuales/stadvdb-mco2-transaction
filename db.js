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
  createAppointment,
  deleteAppointmentById,
  editAppointment,
  searchAppointmentById 
};

async function createAppointment(appointmentDetails) {
    try {
        const { appointmentType, appointmentMode, doctorsSpecialty, hospitalOrClinic, hospitalRegion, hospitalProvince, hospitalCity, hospitalName, patientSex, patientAge } = appointmentDetails;
        const query = 'INSERT INTO appointments (appointmentType, appointmentMode, doctorsSpecialty, hospitalOrClinic, hospitalRegion, hospitalProvince, hospitalCity, hospitalName, patientSex, patientAge) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [appointmentType, appointmentMode, doctorsSpecialty, hospitalOrClinic, hospitalRegion, hospitalProvince, hospitalCity, hospitalName, patientSex, patientAge];
        const [result] = await pool.query(query, values);
        return result;
    } catch (error) {
        throw error;
    }
}

async function deleteAppointmentById(appointmentId) {
    try {
        const [result, _] = await pool1.query('DELETE FROM mco2_appts WHERE appointment_id = ?', [appointmentId]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function editAppointment(formData) {
    try {
      // Extract data from the formData object
      const {
        appointmentID,
        appointmentType,
        appointmentMode,
        doctorsSpecialty,
        hospitalClinic,
        hospitalRegion,
        hospitalProvince,
        hospitalCity,
        hospitalName,
        patientSex,
        patientAge
      } = formData;
  
      // Update the appointment in the database using SQL queries
      const result = await pool1.query('UPDATE appointments SET appointment_type = ?, appointment_mode = ?, doctors_specialty = ?, hospital_clinic = ?, hospital_region = ?, hospital_province = ?, hospital_city = ?, hospital_name = ?, patient_sex = ?, patient_age = ? WHERE appointment_id = ?', [appointmentType, appointmentMode, doctorsSpecialty, hospitalClinic, hospitalRegion, hospitalProvince, hospitalCity, hospitalName, patientSex, patientAge, appointmentID]);
      
      // Check if the appointment was successfully edited
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Function to perform queries with concurrency control
async function query(pool) {
    return async (q, values, mode) => {
        const connection = await pool.getConnection();
        try {
            await connection.query('LOCK TABLES mco2_appts ' + mode);
            const [results] = await connection.query(q, values);
            await connection.query('UNLOCK TABLES');
            return results;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    };
}

// Functions for executing queries on each database with concurrency control
const queryCentral = query(central);
const queryLuzon = query(luzon);
const queryVismin = query(vismin);

// Function to search appointment by ID across all databases
async function searchAppointmentById(appointmentId) {
    try {
        const resultsCentral = await queryCentral('SELECT * FROM mco2_appts WHERE appointment_id = ?', [appointmentId], 'READ');
        const resultsLuzon = await queryLuzon('SELECT * FROM mco2_appts WHERE appointment_id = ?', [appointmentId], 'READ');
        const resultsVismin = await queryVismin('SELECT * FROM mco2_appts WHERE appointment_id = ?', [appointmentId], 'READ');
        return [resultsCentral, resultsLuzon, resultsVismin];
    } catch (error) {
        throw error;
    }
}

module.exports = {
    central,
    luzon,
    vismin,
    searchAppointmentById
};

async function searchAppointmentById(appointmentId) {
    try {
        const [results, _] = await pool1.query('SELECT * FROM mco2_appts WHERE appointment_id = ?', [appointmentId]);
        return results;
    } catch (error) {
        throw error;
    }
}
