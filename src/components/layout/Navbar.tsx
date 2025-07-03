import styles from "./Navbar.module.css";

interface NavbarProps {
  openConnection: (() => Promise<void>) | null;
  connected: boolean;
  IOBegin: number;
  setIOBegin: (begin: number) => void;
  IOEnd: number;
  setIOEnd: (end: number) => void;
}

function Navbar({
  openConnection,
  connected,
  IOBegin,
  setIOBegin,
  IOEnd,
  setIOEnd,
}: NavbarProps) {
  return (
    <div className={styles.navbar}>
      {/* <div className={styles.leftActions}>
        {openConnection && (
          <div className={styles.serial}>
            <button
              className={styles.button}
              onClick={openConnection}
              title="Conexão serial"
            >
              <span className="material-symbols-outlined">usb</span>
              <span className={styles.circleConnected}>
                {connected
                  ? String.fromCodePoint(0x1f7e2)
                  : String.fromCodePoint(0x1f534)}
              </span>
            </button>
            {connected ? (
              <>
                {"   "}
                <input
                  className={styles.input}
                  value={IOBegin.toString(16).padStart(2, "0").toUpperCase()}
                  onChange={(e) => {
                    if (e.target.value.length === 0) return setIOBegin(0);
                    const value = parseInt(e.target.value, 16);
                    if (value > 255) return;
                    setIOBegin(parseInt(e.target.value, 16));
                  }}
                />
                {"a"}
                <input
                  className={styles.input}
                  value={IOEnd.toString(16).padStart(2, "0").toUpperCase()}
                  onChange={(e) => {
                    if (e.target.value.length === 0) return setIOEnd(0);
                    const value = parseInt(e.target.value, 16);
                    if (value > 255) return;
                    setIOEnd(value);
                  }}
                />
              </>
            ) : (
              ""
            )}
          </div>
        )}
      </div> */}
      <p className={styles.title}>Bisk-8 Simulator</p>
      <div className={styles.rightActions}>
        {/* Configurações e ajuda */}
      </div>
    </div>
  );
}

export default Navbar;
