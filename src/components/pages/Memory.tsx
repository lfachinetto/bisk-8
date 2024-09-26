import InstructionSet from "../../models/instructionSet";
import RegisterFile from "../../models/registerFile";
import ISATable from "../layout/memory/ISATable";
import MemoryTable from "../layout/memory/MemoryTable";
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
      <h2>
        Memória
        <button
          className={styles.button}
          onClick={() => setShowISA(!showISA)}
          title="Visualizar ISA"
        >
          <span className="material-symbols-outlined">info</span>
        </button>
      </h2>

      <center>
        <MemoryTable
          memory={memory}
          setMemory={setMemory}
          file={file}
          setCurrentField={setCurrentField}
          height={showISA ? "40" : "75"}
        />
        {showISA ? (
          <>
            <br />
            <h3>ISA</h3>
            <br />
            <ISATable isa={isa} field={currentField} />
          </>
        ) : (
          ""
        )}
      </center>
    </div>
  );
}

export default Memory;
