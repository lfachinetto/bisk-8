import styles from "./ActionsBar.module.css";

interface ActionsBarProps {
  clear: () => void;
  uploadMemory: () => void;
  save: () => void;
  downloadMemory: () => void;
  runAll: () => void;
  runInstByInst: () => void;
  runCicleByCicle: () => void;
}

function ActionsBar({
  clear,
  uploadMemory,
  save,
  downloadMemory,
  runAll,
  runInstByInst,
  runCicleByCicle,
}: ActionsBarProps) {
  return (
    <div>
      <button className={styles.emojiButton} onClick={clear} title="Limpar">
        <span className="material-symbols-outlined">draft</span>
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
      <button
        className={styles.emojiButton}
        onClick={downloadMemory}
        title="Baixar memória"
      >
        <span className="material-symbols-outlined">download</span>
      </button>
      <button
        className={styles.emojiButton}
        onClick={runAll}
        title="Executar tudo"
      >
        <span className="material-symbols-outlined">play_arrow</span>
      </button>
      <button
        className={styles.emojiButton}
        onClick={runInstByInst}
        title="Executar instrução por instrução"
      >
        <span className="material-symbols-outlined">step_over</span>
      </button>
      <button
        className={styles.emojiButton}
        onClick={runCicleByCicle}
        title="Executar ciclo por ciclo"
      >
        <span className="material-symbols-outlined">step_into</span>
      </button>
    </div>
  );
}

export default ActionsBar;
