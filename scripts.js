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

async function deleteAppointmentById(appointmentId) {
  try {
    const connection = await central.getConnection();
    const [results] = await connection.query('DELETE FROM mco2_appts WHERE appointment_id = ?', [appointmentId]);
    connection.release();
    return results;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw new Error('Error deleting appointment');
  }
} 

async function editAppointmentById(appointmentId, appointmentData) {
  try {
    const connection = await central.getConnection();
    const [results] = await connection.query('UPDATE mco2_appts SET appointment_type = ?, mode_of_appointment = ?, doctor_specialty = ?, patient_sex = ?, patient_age = ? WHERE appointment_id = ?', [
      appointmentData.appointment_type,
      appointmentData.mode_of_appointment,
      appointmentData.doctor_specialty,
      appointmentData.patient_sex,
      appointmentData.patient_age,
      appointmentId
    ]);
    connection.release();
    return results;
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw new Error('Error updating appointment');
  }
}

module.exports = {
  searchAppointmentById,
  deleteAppointmentById,
  editAppointmentById
};