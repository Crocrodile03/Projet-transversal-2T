import { useEffect, useState } from "react"
import Dispositif from "../types/dispositif"
import styles from "./css/Dispositifs.module.css"

interface Mesure {
  topic: string
  valeur: string
  heure: string
}

function Dispositifs() {
  const [dispositifs, setDispositifs] = useState<Array<Dispositif>>([])
  const [selected, setSelected] = useState<string | null>(null)

  const selectedDev = dispositifs.find(d => d.getNom() === selected) ?? null

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:54333/api/pico/data')
        if (!res.ok) return
        const data: Mesure[] = await res.json()
        const noms = [...new Set(
          data
            .filter(m => m.topic === 'pico/distance')
            .map(m => m.valeur.split(':')[0].trim())
        )]
        setDispositifs(prev => {
          const stateMap = new Map(prev.map(d => [d.getNom(), d.getOn()]))
          const saved: Record<string, boolean> = JSON.parse(localStorage.getItem('dispositifs-state') ?? '{}')
          return noms.map((nom, i) => {
            const d = new Dispositif(i + 1, nom)
            if (stateMap.has(nom)) d.setOn(stateMap.get(nom)!)
            else if (saved[nom] !== undefined) d.setOn(saved[nom])
            return d
          })
        })
      } catch {}
    }
    fetchData()
    const interval = setInterval(fetchData, 2000)
    return () => clearInterval(interval)
  }, [])

  function toggle() {
    if (selected === null) return
    setDispositifs(prev =>
      prev.map(d => {
        if (d.getNom() !== selected) return d
        const updated = new Dispositif(d.getId(), d.getNom())
        updated.setOn(!d.getOn())
        const saved: Record<string, boolean> = JSON.parse(localStorage.getItem('dispositifs-state') ?? '{}')
        saved[d.getNom()] = updated.getOn()
        localStorage.setItem('dispositifs-state', JSON.stringify(saved))
        toggleLed(updated.getOn())
        return updated
      })
    )
  }

  const toggleLed = async (led: boolean) => {
    const response = await fetch('http://localhost:54333/api/pico-led', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ led }),
    })
    const data = await response.json()
    console.log(data)
  }

  return (
    <div className={styles.page}>
      <div className={styles.title}>📡 Dispositifs</div>
      <ul className={styles.list}>
        {dispositifs.map((dispositif) => (
          <li
            key={dispositif.getNom()}
            className={`${styles.item} ${selected === dispositif.getNom() ? styles.itemSelected : ""}`}
            onClick={() => setSelected(dispositif.getNom())}
          >
            <span className={styles.name}>{dispositif.getNom()}</span>
            <span className={dispositif.getOn() ? styles.statusOn : styles.statusOff}>
              {dispositif.getOn() ? "● Allumé" : "● Éteint"}
            </span>
          </li>
        ))}
      </ul>
      <div className={styles.controls}>
        {selectedDev ? (
          <>
            <span className={styles.controlsName}>{selectedDev.getNom()}</span>
            <button
              className={selectedDev.getOn() ? styles.btnOff : styles.btnOn}
              onClick={toggle}
            >
              {selectedDev.getOn() ? "⏹ Éteindre" : "▶ Allumer"}
            </button>
          </>
        ) : (
          <span className={styles.controlsHint}>Sélectionne un dispositif</span>
        )}
      </div>
    </div>
  )
}

export default Dispositifs
