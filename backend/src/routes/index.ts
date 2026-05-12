import { Router } from 'express'
import authRouter from './auth'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

router.use(authRouter)

export default router
