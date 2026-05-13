import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import routes from './routes/index'
import { initMqtt } from './services/mqttService'
import path from 'path';

const app = express()
const PORT = 80
const frontendPath = path.join(__dirname, '../../frontend/dist');
initMqtt()
app.use(express.static(frontendPath));
app.use(cors())
app.use(express.json())
app.use('/api', routes)

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
