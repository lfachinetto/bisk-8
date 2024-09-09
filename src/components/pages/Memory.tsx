import InstructionSet from "../../models/instructionSet";
import RegisterFile from "../../models/registerFile";
import ISATable from "../layout/ISATable";
import MemoryTable from "../layout/MemoryTable";
import styles from "./Memory.module.css";
import React, { useState } from "react";

interface MemoryProps {
  memory: number[];
  setMemory: React.Dispatch<React.SetStateAction<number[]>>;
  file: RegisterFile;
  isa: InstructionSet;
}

function Memory({ memory, setMemory, file, isa }: MemoryProps) {
  const [currentField, setCurrentField] = useState<number | undefined>(
    undefined
  );
  const [showISA, setShowISA] = useState<boolean>(false);

  return (
    <div>
      {" "}
      <h2>
        Memória
        <button
          className={styles.emojiButton}
          onClick={() => setShowISA(!showISA)}
          title="Visualizar ISA"
        >
          <span className="material-symbols-outlined">info</span>
        </button>
      </h2>
      <div className={styles.container}>
        <center>
          <div className={styles.tableContainer}>
            <MemoryTable
              memory={memory}
              setMemory={setMemory}
              file={file}
              setCurrentField={setCurrentField}
            />
          </div>
          {showISA ? <ISATable isa={isa} field={currentField} /> : ""}
        </center>
      </div>
    </div>
  );
}

export default Memory;
