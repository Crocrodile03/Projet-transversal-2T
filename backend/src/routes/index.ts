import { Router } from 'express'
import authRouter from './auth'
import picoRouter from './pico'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

router.use(authRouter)
router.use(picoRouter)

export default router
