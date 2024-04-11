const express = require('express');
const { createPool, pool } = require('mysql2');

const app = express();

const central = createPool({
    host: "ccscloud.dlsu.edu.ph",
    port: 20210,
    user: "root",
    password: "rFyY9m3JNa4HUwG2nBkz6sXc",
    database: "N01",
    connectionLimit: 10
});

const luzon = createPool({
    host: "ccscloud.dlsu.edu.ph",
    port: 20211,
    user: "root",
    password: "rFyY9m3JNa4HUwG2nBkz6sXc",
    database: "N02",
    connectionLimit: 10
});

const vismin = createPool({
    host: "ccscloud.dlsu.edu.ph",
    port: 20212,
    user: "root",
    password: "rFyY9m3JNa4HUwG2nBkz6sXc",
    database: "N03",
    connectionLimit: 10
});

async function searchAppointmentById(appointmentId) {
    try {
        const [results, _] = await central.query('SELECT * FROM mco2_appts WHERE appointment_id = ?', [appointmentId]);
        return results;
    } catch (error) {
        throw error;
    }
}

// perform queries with concurrency control
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

//  executing queries on each database with concurrency control
const queryCentral = query(central);
const queryLuzon = query(luzon);
const queryVismin = query(vismin);

//to search appointment by ID across all databases
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
  