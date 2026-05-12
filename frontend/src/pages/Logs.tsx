import { useState } from "react"
import Log from "../types/log"
import styles from "./css/Logs.module.css"

const initialLogs: Array<Log> = [
  new Log("Paris",     new Date("2024-01-01")),
  new Log("Lyon",      new Date("2024-02-15")),
  new Log("Marseille", new Date("2024-03-10"))
]

type SortKey = "endroit" | "date"
type SortDir = "asc" | "desc"

function Logs() {
  const [sortKey, setSortKey] = useState<SortKey>("date")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("asc") }
  }

  const sorted = [...initialLogs].sort((a, b) => {
    const cmp = sortKey === "date"
      ? a.getTimestamp() - b.getTimestamp()
      : a.getEndroit().localeCompare(b.getEndroit())
    return sortDir === "asc" ? cmp : -cmp
  })

  const arrow = (key: SortKey) => sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : ""

  return (
    <div className={styles.page}>
      <div className={styles.title}>📋 Logs</div>
      <div className={styles.header}>
        <button className={styles.colBtn} onClick={() => handleSort("endroit")}>
          Endroit{arrow("endroit")}
        </button>
        <button className={styles.colBtn} onClick={() => handleSort("date")}>
          Date{arrow("date")}
        </button>
      </div>
      <ul className={styles.list}>
        {sorted.map((log, index) => (
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
