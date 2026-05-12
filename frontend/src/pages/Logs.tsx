import { useEffect, useState } from "react"
import styles from "./css/Logs.module.css"

interface Mesure {
  topic: string
  valeur: string
  heure: string
}

type SortKey = "valeur" | "heure"
type SortDir = "asc" | "desc"

function Logs() {
  const [mesures, setMesures] = useState<Mesure[]>([])
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
        if (res.ok) setMesures((await res.json()).filter((m: Mesure) => m.topic === 'pico/distance'))
      } catch {}
    }
    fetchData()
    const interval = setInterval(fetchData, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.title}>📋 Logs</div>
      <div className={styles.header}>
        <button className={styles.colBtn} onClick={() => handleSort("valeur")}>
          Radar{arrow("valeur")}
        </button>
        <button className={styles.colBtn} onClick={() => handleSort("heure")}>
          Date d'activation{arrow("heure")}
        </button>
      </div>
      <ul className={styles.list}>
        {[...mesures].sort((a, b) => {
          const cmp = a[sortKey].localeCompare(b[sortKey])
          return sortDir === "asc" ? cmp : -cmp
        }).map((mesure, index) => (
          <li key={index} className={styles.item}>
            <span className={styles.location}>{mesure.valeur.split(':')[0].trim()}</span>
            <span className={styles.mouvement}>Mouvement détecté ! </span>
            <span className={styles.date}>{mesure.heure}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Logs
