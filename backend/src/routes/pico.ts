import { Router, Request, Response } from "express";
import { historiqueCapteurs } from "../services/mqttService";

const router = Router()

router.get('/pico/data', (_req: Request, res: Response) => {
  res.json(historiqueCapteurs)
})

router.post('/pico-data', (req: Request, res: Response) => {
  const picoData = req.body
  console.log('Données reçues du Pico :', picoData)
  res.status(201).json({ received: true, data: picoData })
})

export default router