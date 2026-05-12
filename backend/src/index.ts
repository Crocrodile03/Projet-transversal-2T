import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import routes from './routes/index'
import { initMqtt } from './services/mqttService'

const app = express()
const PORT = 54333

initMqtt()

app.use(cors())
app.use(express.json())
app.use('/api', routes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
