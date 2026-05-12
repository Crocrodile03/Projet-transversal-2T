import { useState, useEffect } from 'react'
import vache from '../assets/images/vache.png'
import styles from './Cow.module.css'

// ── Paramètres modifiables ─────────────────────────────────────────────
const MIN_BOTTOM_PCT     = 5    // % depuis le bas — plus bas = plus gros + rapide
const MAX_BOTTOM_PCT     = 45   // % depuis le bas — plus haut = plus petit + lent

const MIN_SIZE           = 200  // largeur (px) des vaches en bas
const MAX_SIZE           = 55   // largeur (px) des vaches en haut

const MIN_DURATION       = 7    // secondes pour traverser (bas, rapides)
const MAX_DURATION       = 22   // secondes pour traverser (haut, lentes)

const SPAWN_TICK_MS      = 500   // intervalle entre chaque tentative (millisecondes)
const SPAWN_CHANCE_PCT   = 15    // % de chance de spawner à chaque tick (0-100)

const MAX_COWS           = 6    // nombre max de vaches simultanées
// ──────────────────────────────────────────────────────────────────────

interface CowInstance {
  id: number
  bottom: number
  size: number
  duration: number
  direction: 'ltr' | 'rtl'
}

let nextId = 0
function lerp(t: number, a: number, b: number) { return a + t * (b - a) }

function makeCow(): CowInstance {
  const bottom = MIN_BOTTOM_PCT + Math.random() * (MAX_BOTTOM_PCT - MIN_BOTTOM_PCT)
  const t = (bottom - MIN_BOTTOM_PCT) / (MAX_BOTTOM_PCT - MIN_BOTTOM_PCT)
  return {
    id:        nextId++,
    bottom,
    size:      lerp(t, MIN_SIZE, MAX_SIZE),
    duration:  lerp(t, MIN_DURATION, MAX_DURATION),
    direction: Math.random() < 0.5 ? 'ltr' : 'rtl',
  }
}

function Cow() {
  const [cows, setCows] = useState<CowInstance[]>([])

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    function spawnAndSchedule() {
      if (Math.random() * 100 < SPAWN_CHANCE_PCT) {
        setCows(prev => prev.length >= MAX_COWS ? prev : [...prev, makeCow()])
      }
      timeoutId = setTimeout(spawnAndSchedule, SPAWN_TICK_MS)
    }

    spawnAndSchedule()
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <>
      {cows.map(cow => (
        <div
          key={cow.id}
          className={`${styles.cow} ${styles[cow.direction]}`}
          style={{
            bottom: `${cow.bottom}%`,
            width: cow.size,
            animationDuration: `${cow.duration}s`,
            // bottom 10% de la zone → devant les fenêtres (z-index 11), reste → derrière (1-9)
            zIndex: ((cow.bottom - MIN_BOTTOM_PCT) / (MAX_BOTTOM_PCT - MIN_BOTTOM_PCT)) < 0.1
              ? 11
              : Math.round(9 - ((cow.bottom - MIN_BOTTOM_PCT) / (MAX_BOTTOM_PCT - MIN_BOTTOM_PCT)) * 8),
          }}
          onAnimationEnd={() => setCows(prev => prev.filter(c => c.id !== cow.id))}
        >
          {/* t=0 → vache en bas (proche, gros wiggle) ; t=1 → vache en haut (loin, petit wiggle) */}
          <img
            src={vache}
            alt="vache"
            className={styles.img}
            style={{ '--wiggle-angle': `${lerp((cow.bottom - MIN_BOTTOM_PCT) / (MAX_BOTTOM_PCT - MIN_BOTTOM_PCT), 6, 1)}deg` } as React.CSSProperties}
          />
        </div>
      ))}
    </>
  )
}

export default Cow
