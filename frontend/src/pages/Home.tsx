import Header from '../components/Header'
import Window from '../components/Window'
import Dispositifs from './Dispositifs'
import Logs from './Logs'

function Home() {
  return (
    <>
      <Header />
      <Window title="📋 Logs — Groupe A" initialX={60} initialY={60}>
        <Logs />
      </Window>
      <Window title="📡 Dispositifs — Groupe A" initialX={460} initialY={100}>
        <Dispositifs />
      </Window>
    </>
  )
}

export default Home