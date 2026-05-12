import { Router, Request, Response } from "express";

const router = Router()

router.get('/pico-flask', async (_req: Request, res: Response) => {
  try {
    const response = await fetch('http://localhost:5000/api/data')
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error('Erreur fetch Flask :', error)
    res.status(502).json({ error: 'Impossible de récupérer les données du service Flask' })
  }
})



router.post('/pico-data', (req: Request, res: Response) => {
  const picoData = req.body
  console.log('Données reçues du Pico :', picoData)
  res.status(201).json({ received: true, data: picoData })
})

export default router