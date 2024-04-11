const express = require('express');
const { createPool, pool } = require('mysql2');

const app = express();


const central = createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.CENTRAL_DB_NAME,
    connectionLimit: 10
});

const luzon = createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT_LUZON,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.LUZON_DB_NAME,
    connectionLimit: 10
});

const vismin = createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT_VISMIN,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.VISMIN_DB_NAME,
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

module.exports = {
    central,
    luzon,
    vismin,
    searchAppointmentById
};
