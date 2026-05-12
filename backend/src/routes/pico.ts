import { Router, Request, Response } from "express";

const router = Router()



router.post('/pico-data', (req: Request, res: Response) => {
  const picoData = req.body
  console.log('Données reçues du Pico :', picoData)
  res.status(201).json({ received: true, data: picoData })
})

export default router