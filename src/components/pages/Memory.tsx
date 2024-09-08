import RegisterFile from "../../models/registerFile";
import MemoryTable from "../layout/MemoryTable";
import styles from "./Memory.module.css";
import React from "react";

interface MemoryProps {
  memory: number[];
  setMemory: React.Dispatch<React.SetStateAction<number[]>>;
  file: RegisterFile;
}

function Memory({ memory, setMemory, file }: MemoryProps) {
  return (
    <div>
      <div className={styles.container}>
        <center>
          <div className={styles.tableContainer}>
            <MemoryTable memory={memory} setMemory={setMemory} file={file} />
          </div>
        </center>
      </div>
    </div>
  );
}

export default Memory;
