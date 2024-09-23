import styles from "./ActionsBar.module.css";

interface ActionsBarSimulationProps {
  clearRegisters: () => void;
}

function ActionsBarSimulation({ clearRegisters }: ActionsBarSimulationProps) {
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
      </div>
      <div className={styles.rightActions}></div>
    </div>
  );
}

export default ActionsBarSimulation;
