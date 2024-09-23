import styles from "./ActionsBar.module.css";

interface ActionsBarProps {
  clear: () => void;
  uploadMemory: () => void;
  save: () => void;
  runAll: () => void;
  runInstByInst: (() => void) | null;
  runCicleByCicle: () => void;
}

function ActionsBar({
  clear,
  uploadMemory,
  save,
  runAll,
  runInstByInst,
  runCicleByCicle,
}: ActionsBarProps) {
  return (
    <div className={styles.actionBar}>
      <div className={styles.leftActions}>
        <button className={styles.emojiButton} onClick={clear} title="Limpar">
          <span className="material-symbols-outlined">delete</span>
        </button>
        <button
          className={styles.emojiButton}
          onClick={uploadMemory}
          title="Abrir arquivo de memória"
        >
          <span className="material-symbols-outlined">upload_file</span>
        </button>
        <button
          className={styles.emojiButton}
          onClick={save}
          title="Salvar memória"
        >
          <span className="material-symbols-outlined">save</span>
        </button>       
      </div>
      <div className={styles.rightActions}>
        <button
          className={styles.emojiButton}
          onClick={runAll}
          title="Executar tudo"
        >
          <span className="material-symbols-outlined">play_arrow</span>
        </button>
        {runInstByInst ? (
          <button
            className={styles.emojiButton}
            onClick={runInstByInst}
            title="Executar instrução por instrução"
          >
            <span className="material-symbols-outlined">step_over</span>
          </button>
        ) : (
          ""
        )}
        <button
          className={styles.emojiButton}
          onClick={runCicleByCicle}
          title="Executar ciclo por ciclo"
        >
          <span className="material-symbols-outlined">step_into</span>
        </button>
      </div>
    </div>
  );
}

export default ActionsBar;
