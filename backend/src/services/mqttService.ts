import mqtt from 'mqtt'

const brokerUrl = 'mqtt://10.1.100.143:1883'
const subscribedTopics = ['pico/distance', 'pico/bouton']

const mqttClient = mqtt.connect(brokerUrl)

mqttClient.on('connect', () => {
  subscribedTopics.forEach(topic => mqttClient.subscribe(topic))
  console.log(`MQTT connecté à ${brokerUrl}`)
})

mqttClient.on('message', (topic, message) => {
  const payload = message.toString()
  console.log(`[MQTT] ${topic} : ${payload}`)
})

mqttClient.on('error', (error) => {
  console.error('[MQTT] Erreur :', error)
})

export default mqttClient
