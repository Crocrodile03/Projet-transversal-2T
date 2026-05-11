import Log from "../types/log"
import styles from "./css/Logs.module.css"

const logs: Array<Log> = [
    new Log("Paris", new Date("2024-01-01")),
    new Log("Lyon", new Date("2024-02-15")),
    new Log("Marseille", new Date("2024-03-10"))
]

function Logs() {
  return (
    <div className={styles.page}>
        <h1 className={styles.title}>Logs</h1>
        <ul className={styles.list}>
          {logs.map((log, index) => (
            <li key={index} className={styles.item}>
              <span className={styles.location}>{log.getEndroit()}</span>
              <span className={styles.date}>{log.getDateString()}</span>
            </li>
          ))}
        </ul>
    </div>
  )
}

export default Logs
