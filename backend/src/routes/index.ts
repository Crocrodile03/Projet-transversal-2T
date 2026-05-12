import { Router } from 'express'
import authRouter from './auth'
import picoRouter from './pico'
import { jwtAuth } from '../middlewares/jwtAuth'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

router.use('/auth', authRouter)
router.use(picoRouter)

router.get('/profile', jwtAuth, (req, res) => {
  res.json({ user: (req as typeof req & { user: unknown }).user })
})

export default router
