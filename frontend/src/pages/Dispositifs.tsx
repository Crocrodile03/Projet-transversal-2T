import { useEffect, useState } from "react"
import Dispositif from "../types/dispositif"
import { API_URL } from "../config"
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
<<<<<<< HEAD
        const res = await fetch('/api/pico/data')
=======
        const res = await fetch(`${API_URL}/api/pico/data`)
>>>>>>> origin/main
        if (!res.ok) return
        const data: Mesure[] = await res.json()
        const noms = [...new Set(
          data
            .filter(m => m.topic === 'pico/distance')
            .map(m => m.valeur.split(':')[0].trim())
        )]
        setDispositifs(() => {
          const saved: Record<string, boolean> = JSON.parse(localStorage.getItem('dispositifs-state') ?? '{}')
          return noms.map((nom, i) => {
            const d = new Dispositif(i + 1, nom)
            if (saved[nom] !== undefined) d.setOn(saved[nom])
            return d
          })
        })
      } catch {}
    }
    fetchData()
    const interval = setInterval(fetchData, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handler = () => {
      const heure = new Date().toLocaleTimeString('fr-BE', { hour12: false })
      setDispositifs(prev => {
        const saved: Record<string, boolean> = JSON.parse(localStorage.getItem('dispositifs-state') ?? '{}')
        const logs: { nom: string; etat: boolean; heure: string }[] = JSON.parse(localStorage.getItem('dispositifs-logs') ?? '[]')
        const updated = prev.map(d => {
          if (d.getOn()) return d
          const u = new Dispositif(d.getId(), d.getNom())
          u.setOn(true)
          saved[d.getNom()] = true
          logs.unshift({ nom: d.getNom(), etat: true, heure })
          return u
        })
        localStorage.setItem('dispositifs-state', JSON.stringify(saved))
        localStorage.setItem('dispositifs-logs', JSON.stringify(logs.slice(0, 50)))
        return updated
      })
    }
    window.addEventListener('demarrer', handler)
    return () => window.removeEventListener('demarrer', handler)
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
        const logs: { nom: string; etat: boolean; heure: string }[] = JSON.parse(localStorage.getItem('dispositifs-logs') ?? '[]')
        logs.unshift({ nom: d.getNom(), etat: updated.getOn(), heure: new Date().toLocaleTimeString('fr-BE', { hour12: false }) })
        localStorage.setItem('dispositifs-logs', JSON.stringify(logs.slice(0, 50)))
        toggleLed(updated.getOn())
        return updated
      })
    )
  }

  const toggleLed = async (led: boolean) => {
    const response = await fetch('/api/pico-led', {
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
