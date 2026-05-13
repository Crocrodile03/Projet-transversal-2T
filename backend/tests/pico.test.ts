import request from 'supertest';
import express from 'express';
import picoRoutes from '../src/routes/pico';
import { mqttClient } from '../src/services/mqttService';

// On simule le service MQTT pour ne pas envoyer de vrais messages
jest.mock('../src/services/mqttService', () => ({
  historiqueCapteurs: [
    { topic: 'pico/distance', valeur: '15', heure: '12:00:00' }
  ],
  mqttClient: {
    publish: jest.fn()
  }
}));

// On crée une fausse application Express juste pour nos tests
const app = express();
app.use(express.json());
app.use('/api', picoRoutes);

describe('Routes Pico', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/pico/data', () => {
    it('devrait renvoyer l\'historique des capteurs', async () => {
      const response = await request(app).get('/api/pico/data');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/pico-led', () => {
    it('devrait envoyer "on" si led est true', async () => {
      const response = await request(app)
        .post('/api/pico-led')
        .send({ led: true });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('ON');
      // On vérifie que la fonction de publication MQTT a bien été appelée
      expect(mqttClient.publish).toHaveBeenCalledWith('pico/led', 'ON');
    });

    it('devrait renvoyer une erreur 400 si led n\'est pas un booléen', async () => {
      const response = await request(app)
        .post('/api/pico-led')
        .send({ led: 'allume-toi' }); // Mauvais type

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Le champ led doit être true ou false');
      // On vérifie que rien n'a été publié sur le MQTT
      expect(mqttClient.publish).not.toHaveBeenCalled();
    });
  });
});