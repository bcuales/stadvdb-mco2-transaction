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

module.exports = {
    central,
    luzon,
    vismin,
    searchAppointmentById
  };
  