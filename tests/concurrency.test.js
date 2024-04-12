const request = require('supertest');
const app = require('../app'); 

import('chai').then(chai => {
  const expect = chai.expect;

  describe('Concurrency Test Cases', () => {
    it('Case #1: Concurrent transactions in two or more nodes are reading the same data item.', async () => {
      // Send concurrent read requests from multiple nodes
      const [response1, response2] = await Promise.all([
        request(app).get('/searchAppointment'),
        request(app).get('/searchAppointment'),
      ]);

      // Check if both responses are successful and contain the same data
      expect(response1.status).to.equal(200);
      expect(response2.status).to.equal(200);
      expect(response1.body).to.deep.equal(response2.body);
    });

    it('Case #2: At least one transaction in the three nodes is writing and the others are reading.', async () => {
      // Write request to update an appointment
      const updateResponse = await request(app).post('/editAppointment').send({ /* Update data */ });

      // Concurrent read requests to retrieve the same appointment information
      const [readResponse1, readResponse2] = await Promise.all([
        request(app).get('/searchAppointment'),
        request(app).get('/searchAppointment'),
      ]);

      // Check if write and read operations were successful
      expect(updateResponse.status).to.equal(200);
      expect(readResponse1.status).to.equal(200);
      expect(readResponse2.status).to.equal(200);

      // Check if the read responses contain consistent data
      expect(readResponse1.body).to.deep.equal(readResponse2.body);
    });

    it('Case #3: Concurrent transactions in two or more nodes are writing the same data item.', async () => {
      // Concurrent write requests from multiple nodes to update the same appointment information
      const [writeResponse1, writeResponse2] = await Promise.all([
        request(app).post('/editAppointment').send({ /* update data */ }),
        request(app).post('/editAppointment').send({ /* update data */ }),
      ]);

      // Check if both write operations were successful
      expect(writeResponse1.status).to.equal(200);
      expect(writeResponse2.status).to.equal(200);

    });
  });
});
