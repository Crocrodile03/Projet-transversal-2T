import styles from './Header.module.css'

interface HeaderProps {
  onDemarrer?: () => void
}

function Header({ onDemarrer }: HeaderProps) {
  return (
    <div className={styles.taskbar}>
      <button className={styles.startBtn} onClick={onDemarrer}>
        <span className={styles.startBlink}>⬤</span>
        Démarrer
      </button>
      <div className={styles.separator} />
      <span className={styles.appBtn}>📹 Console Surveillance</span>
      <div className={styles.tray}>
        <span>{new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  )
}

export default Header
