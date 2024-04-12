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

//CHANGEs:
// const masterPool = mysql.createPool(poolConfig1).promise();
// const luzonPool = mysql.createPool(poolConfig2).promise();
// const visminPool = mysql.createPool(poolConfig3).promise();
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
  // masterPool
  // luzonPool
  // visminPool
};

async function createAppointment(appointmentDetails) {
    try {
        const { appointmentType, appointmentMode, doctorsSpecialty, hospitalOrClinic, hospitalRegion, hospitalProvince, hospitalCity, hospitalName, patientSex, patientAge } = appointmentDetails;
        
        // Generate a unique appointment ID using timestamp and a random number
        const appointmentId = `${Date.now()}${Math.floor(Math.random() * 10000)}`;

        const query = 'INSERT INTO mco2_appts (appointment_id, appointment_type, mode_of_appointment, doctor_specialty, hospital_or_clinic_choice, hospital_or_clinic_region, hospital_or_clinic_province, hospital_or_clinic_city, patient_sex, patient_age) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        
        // Ensure appointmentId is the first value in the values array
        const values = [appointmentId, appointmentType, appointmentMode, doctorsSpecialty, hospitalOrClinic, hospitalRegion, hospitalProvince, hospitalCity, hospitalName, patientSex, patientAge];
        
        // CHANGE:
        // const [result] = await masterPool.query(query, values);
        const [result] = await pool1.query(query, values);
        return result;
    } catch (error) {
        throw error;
    }
}



async function deleteAppointmentById(appointmentId) {
    try {
        // CHANGE:
        // const [result, _] = await masterPool.query('DELETE FROM mco2_appts WHERE appointment_id = ?', [appointmentId]);
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
            hospitalOrClinic,
            hospitalRegion,
            hospitalProvince,
            hospitalCity,
            patientSex,
            patientAge
        } = formData;

        // Update the appointment in the database using SQL queries
        // CHANGE: 
        // const result = await masterPool.query('UPDATE mco2_appts SET appointment_type = ?, mode_of_appointment = ?, doctor_specialty = ?, hospital_or_clinic_choice = ?, hospital_or_clinic_region = ?, hospital_or_clinic_province = ?, hospital_or_clinic_city = ?, patient_sex = ?, patient_age = ? WHERE appointment_id = ?', [appointmentType, appointmentMode, doctorsSpecialty, hospitalOrClinic, hospitalRegion, hospitalProvince, hospitalCity, patientSex, patientAge, appointmentID]);
        const result = await pool1.query('UPDATE mco2_appts SET appointment_type = ?, mode_of_appointment = ?, doctor_specialty = ?, hospital_or_clinic_choice = ?, hospital_or_clinic_region = ?, hospital_or_clinic_province = ?, hospital_or_clinic_city = ?, patient_sex = ?, patient_age = ? WHERE appointment_id = ?', [appointmentType, appointmentMode, doctorsSpecialty, hospitalOrClinic, hospitalRegion, hospitalProvince, hospitalCity, patientSex, patientAge, appointmentID]);

        // Check if the appointment was successfully edited
        return result[0].affectedRows > 0;
    } catch (error) {
        throw error;
    }
}

  // Function to search appointment by ID across all databases
async function searchAppointmentById(appointmentId) {
    try {
        // const [results, _] = await masterPool.query('SELECT * FROM mco2_appts WHERE appointment_id = ?', [appointmentId]);
        const [results, _] = await pool1.query('SELECT * FROM mco2_appts WHERE appointment_id = ?', [appointmentId]);
        return results;
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
const queryCentral = query(poolConfig1);
const queryLuzon = query(poolConfig2);
const queryVismin = query(poolConfig3);


