const { central, luzon, vismin } = require('./db');

async function searchAppointmentById(appointmentId) {
  try {
    const connection = await central.getConnection();
    const [results] = await connection.query('SELECT * FROM mco2_appts WHERE appointment_id = ?', [appointmentId]);
    connection.release();
    return results;
  } catch (error) {
    console.error('Error searching appointment:', error);
    throw new Error('Error searching appointment');
  }
}