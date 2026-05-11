import { useState } from "react"
import Dispositif from "../types/dispositif"
import styles from "./css/Dispositifs.module.css"

function Dispositifs() {
  const [dispositifs, setDispositifs] = useState<Array<Dispositif>>([
    new Dispositif(1, "Londres"),
    new Dispositif(2, "Kinshasa"),
    new Dispositif(3, "Ephec")
  ])
  const [selected, setSelected] = useState<number | null>(null)

  const selectedDev = dispositifs.find(d => d.getId() === selected) ?? null

  function toggle() {
    if (selected === null) return
    setDispositifs(prev =>
      prev.map(d => {
        if (d.getId() !== selected) return d
        const updated = new Dispositif(d.getId(), d.getNom())
        updated.setOn(!d.getOn())
        return updated
      })
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.title}>📡 Dispositifs</div>
      <ul className={styles.list}>
        {dispositifs.map((dispositif) => (
          <li
            key={dispositif.getId()}
            className={`${styles.item} ${selected === dispositif.getId() ? styles.itemSelected : ""}`}
            onClick={() => setSelected(dispositif.getId())}
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
