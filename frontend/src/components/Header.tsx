import { useNavigate } from 'react-router-dom'
import styles from './Header.module.css'

interface HeaderProps {
  onDemarrer?: () => void
}

function Header({ onDemarrer }: HeaderProps) {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('accessToken')
    navigate('/login')
  }

  return (
    <div className={styles.taskbar}>
      <button className={styles.startBtn} onClick={onDemarrer}>
        <span className={styles.startBlink}>⬤</span>
        Démarrer
      </button>
      <div className={styles.separator} />
      <span className={styles.appBtn}>📹 Console Surveillance</span>
      <div className={styles.tray}>
        <button className={styles.logoutBtn} onClick={logout}>🔒 Déconnexion</button>
        <div className={styles.traySep} />
        <span>{new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  )
}

export default Header
