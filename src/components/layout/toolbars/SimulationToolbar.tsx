import styles from "./Toolbar.module.css";

interface SimulationToolbarProps {
  clearRegisters: () => void;
  changeClock: (value: number) => void;
  clock: number;
}

const clockOptions = [
  4100, 2000, 1000, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25,
];

function SimulationToolbar({
  clearRegisters,
  changeClock,
  clock,
}: SimulationToolbarProps) {
  const changeClockTo = (value: number) => {
    changeClock(value);
  };

  return (
    <header>
      <div className={styles.leftActions}>
        <button
          className={styles.button}
          onClick={clearRegisters}
          title="Resetar registradores"
        >
          <span className="material-symbols-outlined">restart_alt</span>
        </button>
        <div className={styles.dropdown}>
          <button className={styles.button} title="Alterar clock">
            <span className="material-symbols-outlined">schedule</span>
          </button>

          <div className={styles.dropdownContent}>
            {clockOptions.map((option) => (
              <a
                key={option}
                className={option == clock ? styles.selected : ""}
                onClick={() => changeClockTo(option)}
              >
                {option >= 1000 ? (option / 1000).toLocaleString() : option}
                <span> </span>
                {option >= 1000 ? "KHz" : "Hz"}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.rightActions}></div>
    </header>
  );
}

export default SimulationToolbar;
