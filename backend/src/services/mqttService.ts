import mqtt from 'mqtt';

// On définit le type de nos données
export interface Mesure {
  topic: string;
  valeur: string;
  heure: string;
}

// Notre tableau temporaire (qu'on exporte pour pouvoir le lire ailleurs)
export let historiqueCapteurs: Mesure[] = [];

// Fonction pour initialiser la connexion
export const initMqtt = () => {
  const MQTT_BROKER = 'mqtt://10.1.100.143:1883';
  console.log(`Tentative de connexion au broker MQTT : ${MQTT_BROKER}`);
  const mqttClient = mqtt.connect(MQTT_BROKER);

  mqttClient.on('connect', () => {
    console.log('✅ Service MQTT connecté avec succès !');
    mqttClient.subscribe('pico/distance');
    mqttClient.subscribe('pico/bouton');
  });

  mqttClient.on('message', (topic, message) => {
    const valeur = message.toString();
    console.log(`[MQTT] Message reçu - ${topic} : ${valeur}`);
    
    const nouvelleDonnee: Mesure = {
      topic: topic,
      valeur: valeur,
      heure: new Date().toLocaleTimeString()
    };

    historiqueCapteurs.unshift(nouvelleDonnee);
    if (historiqueCapteurs.length > 20) {
      historiqueCapteurs.pop();
    }
  });

  mqttClient.on('error', (err) => {
    console.error('❌ Erreur MQTT :', err);
  });
};