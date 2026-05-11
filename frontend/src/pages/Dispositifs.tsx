import Dispositif from "../types/dispositif"
import styles from "./css/Dispositifs.module.css"

const dispositifs: Array<Dispositif> = [
    new Dispositif(1, "Londres"),
    new Dispositif(2, "Kinshasa"),
    new Dispositif(3, "Ephec")
]

function Dispositifs() {
  return (
    <div className={styles.page}>
      <div className={styles.title}>📡 Dispositifs</div>
      <ul className={styles.list}>
        {dispositifs.map((dispositif, index) => (
          <li key={index} className={styles.item}>
            <span className={styles.name}>{dispositif.getNom()}</span>
            <span className={dispositif.getOn() ? styles.statusOn : styles.statusOff}>
              {dispositif.getOn() ? "● Allumé" : "● Éteint"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Dispositifs
