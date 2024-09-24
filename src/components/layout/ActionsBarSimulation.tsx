import { useState } from "react";
import styles from "./ActionsBar.module.css";

interface ActionsBarSimulationProps {
  clearRegisters: () => void;
  changeClock: (value: number) => void;
}

const clockOptions = [
  4100, 2000, 1000, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25,
];

function ActionsBarSimulation({
  clearRegisters,
  changeClock,
}: ActionsBarSimulationProps) {
  const [showMenu, setShowMenu] = useState(false);

  const clock = () => {
    setShowMenu(!showMenu);
  };

  const changeClockTo = (value: number) => {
    changeClock(value);
    setShowMenu(false);
  };

  return (
    <div className={styles.actionBar}>
      <div className={styles.leftActions}>
        <button
          className={styles.emojiButton}
          onClick={clearRegisters}
          title="Resetar registradores"
        >
          <span className="material-symbols-outlined">restart_alt</span>
        </button>
        <button
          className={styles.emojiButton}
          onClick={clock}
          title="Alterar clock"
        >
          <span className="material-symbols-outlined">schedule</span>
        </button>
        {showMenu && (
          <div className={styles.menu}>
            <ul>
              {clockOptions.map((option) => (
                <li key={option}>
                  <button
                    className={styles.clockOption}
                    onClick={() => changeClockTo(option)}
                  >
                    {option >= 1000 ? (option / 1000).toLocaleString() : option}{" "}
                    {option >= 1000 ? "KHz" : "Hz"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className={styles.rightActions}></div>
    </div>
  );
}

export default ActionsBarSimulation;
