import { Router, Request, Response } from "express";
import { mqttClient } from "../services/mqttService";
import Mesure from "../models/Mesure";

const router = Router()

router.get('/pico/data', (_req: Request, res: Response) => {
  res.json(Mesure.findRecent(50))
})
router.post('/pico-led', (req: Request, res: Response) => {
  const { led } = req.body

  if (typeof led !== 'boolean') {
    return res.status(400).json({ error: 'Le champ led doit être true ou false' })
  }

  const message = led ? 'ON' : 'OFF'
  mqttClient.publish('pico/led', message)
  console.log(`Commande LED envoyée au Pico : ${message}`)

  res.json({ led, message })
})
router.post('/pico-data', (req: Request, res: Response) => {
  const picoData = req.body
  console.log('Données reçues du Pico :', picoData)
  res.status(201).json({ received: true, data: picoData })
})

export default router