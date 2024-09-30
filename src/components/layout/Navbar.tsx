import styles from "./Navbar.module.css";

interface NavbarProps {
  openConnection: (() => Promise<void>) | null;
  connected: boolean;
}

function Navbar({ openConnection, connected }: NavbarProps) {
  return (
    <div className={styles.navbar}>
      <div className={styles.leftActions}>
        {openConnection && (
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
        )}
      </div>
      <p className={styles.title}>Bisk-8 Simulator</p>
      <div className={styles.rightActions}>{/* Configurações e ajuda */}</div>
    </div>
  );
}

export default Navbar;
