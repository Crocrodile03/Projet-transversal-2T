import { useState } from 'react'
import Header from '../components/Header'
import Window from '../components/Window'
import Cow from '../components/Cow'
import Dispositifs from './Dispositifs'
import Logs from './Logs'

const WINDOWS = ['logs', 'dispositifs'] as const
type WinId = typeof WINDOWS[number]

function Home() {
  const [order, setOrder] = useState<WinId[]>(['logs', 'dispositifs'])

  function focus(id: WinId) {
    setOrder(prev => prev[prev.length - 1] === id ? prev : [...prev.filter(w => w !== id), id])
  }

  function zOf(id: WinId) {
    return 9 + order.indexOf(id)
  }

  return (
    <>
      <Cow />
      <Header />
      <Window title="📋 Logs — Groupe A" initialX={60} initialY={60} zIndex={zOf('logs')} onFocus={() => focus('logs')}>
        <Logs />
      </Window>
      <Window title="📡 Dispositifs — Groupe A" initialX={460} initialY={100} zIndex={zOf('dispositifs')} onFocus={() => focus('dispositifs')}>
        <Dispositifs />
      </Window>
    </>
  )
}

export default Home