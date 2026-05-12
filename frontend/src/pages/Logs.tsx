import { useEffect, useState } from "react"
import styles from "./css/Logs.module.css"

interface Mesure {
  topic: string
  valeur: string
  heure: string
}

interface DeviceLog {
  nom: string
  etat: boolean
  heure: string
}

type LogEntry =
  | { type: 'mouvement'; label: string; heure: string }
  | { type: 'dispositif'; label: string; etat: boolean; heure: string }

type SortKey = "label" | "heure"
type SortDir = "asc" | "desc"

function Logs() {
  const [entries, setEntries] = useState<LogEntry[]>([])
  const [sortKey, setSortKey] = useState<SortKey>("heure")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("asc") }
  }

  const arrow = (key: SortKey) => sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : ""

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:54333/api/pico/data')
        const mesures: Mesure[] = res.ok ? await res.json() : []
        const mouvements: LogEntry[] = mesures
          .filter(m => m.topic === 'pico/distance')
          .map(m => ({ type: 'mouvement', label: m.valeur.split(':')[0].trim(), heure: m.heure }))
        const deviceLogs: DeviceLog[] = JSON.parse(localStorage.getItem('dispositifs-logs') ?? '[]')
        const cleanLogs = deviceLogs.filter(l => !/AM|PM/i.test(l.heure))
        localStorage.setItem('dispositifs-logs', JSON.stringify(cleanLogs))
        const dispositifs: LogEntry[] = cleanLogs.map(l => ({ type: 'dispositif', label: l.nom, etat: l.etat, heure: l.heure }))
        setEntries([...mouvements, ...dispositifs])
      } catch {}
    }
    fetchData()
    const interval = setInterval(fetchData, 2000)
    return () => clearInterval(interval)
  }, [])

  const sorted = [...entries].sort((a, b) => {
    const cmp = a[sortKey].localeCompare(b[sortKey])
    return sortDir === "asc" ? cmp : -cmp
  })

  return (
    <div className={styles.page}>
      <div className={styles.title}>📋 Logs</div>
      <div className={styles.header}>
        <button className={styles.colBtn} onClick={() => handleSort("label")}>
          Radar{arrow("label")}
        </button>
        <button className={styles.colBtn} onClick={() => handleSort("heure")}>
          Date d'activation{arrow("heure")}
        </button>
      </div>
      <ul className={styles.list}>
        {sorted.map((entry, index) => (
          <li key={index} className={styles.item}>
            <span className={styles.location}>{entry.label}</span>
            {entry.type === 'mouvement' ? (
              <span className={styles.mouvement}>Mouvement détecté !</span>
            ) : (
              <span className={entry.etat ? styles.allume : styles.eteint}>
                {entry.etat ? '● Allumé' : '● Éteint'}
              </span>
            )}
            <span className={styles.date}>{entry.heure}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Logs
