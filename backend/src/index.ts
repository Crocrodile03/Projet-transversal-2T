import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import routes from './routes/index'
// import mongoose from './db.js' // Uncomment when ready to connect to MongoDB

const app = express()
const PORT = 54333
import mqtt from 'mqtt';

const MQTT_BROKER = 'mqtt://10.1.100.143:1883'; 

console.log(`Tentative de connexion au broker MQTT : ${MQTT_BROKER}`);
const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on('connect', () => {
  console.log('✅ Backend connecté avec succès au Broker MQTT !');
  mqttClient.subscribe('pico/distance');
  mqttClient.subscribe('pico/bouton');
});

mqttClient.on('message', (topic, message) => {
  const valeur = message.toString();
  
  if (topic === 'pico/distance') {
    console.log(`📏 Distance reçue en direct : ${valeur} cm`);
  } else if (topic === 'pico/bouton') {
    console.log(`🔘 Bouton reçu en direct : ${valeur}`);
  }
});

mqttClient.on('error', (err) => {
  console.error('❌ Erreur MQTT :', err);
});
app.use(cors())
app.use(express.json())
app.use('/api', routes)

// Uncomment when ready to connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database-name')
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`)
//     })
//   })
//   .catch(error => {
//     console.error('Unable to connect to MongoDB:', error)
//   })

// For now, start server without DB connection
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
