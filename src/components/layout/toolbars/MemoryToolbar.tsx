import styles from "./Toolbar.module.css";

interface MemoryToolbarProps {
  clear: () => void;
  uploadMemory: () => void;
  save: () => void;
  runAll: (() => void) | null;
  runInstByInst: (() => void) | null;
  runCicleByCicle: () => void;
  stop: () => void;
}

function MemoryToolbar({
  clear,
  uploadMemory,
  save,
  runAll,
  runInstByInst,
  runCicleByCicle,
  stop,
}: MemoryToolbarProps) {
  return (
    <div className={styles.actionBar}>
      <div className={styles.leftActions}>
        <button className={styles.button} onClick={clear} title="Limpar">
          <span className="material-symbols-outlined">delete</span>
        </button>
        <button
          className={styles.button}
          onClick={uploadMemory}
          title="Abrir arquivo de memória"
        >
          <span className="material-symbols-outlined">upload_file</span>
        </button>
        <button className={styles.button} onClick={save} title="Salvar memória">
          <span className="material-symbols-outlined">save</span>
        </button>
      </div>
      <div className={styles.rightActions}>
        {runAll ? (
          <button
            className={styles.button}
            onClick={runAll}
            title="Executar tudo"
          >
            <span className="material-symbols-outlined">play_arrow</span>
          </button>
        ) : (
          <button className={styles.button} onClick={stop} title="Parar">
            <span className="material-symbols-outlined">stop</span>
          </button>
        )}
        {runInstByInst ? (
          <button
            className={styles.button}
            onClick={runInstByInst}
            title="Executar instrução por instrução"
          >
            <span className="material-symbols-outlined">step_over</span>
          </button>
        ) : (
          ""
        )}
        <button
          className={styles.button}
          onClick={runCicleByCicle}
          title="Executar ciclo por ciclo"
        >
          <span className="material-symbols-outlined">step_into</span>
        </button>
      </div>
    </div>
  );
}

export default MemoryToolbar;
