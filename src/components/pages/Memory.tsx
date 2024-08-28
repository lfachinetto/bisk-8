import InstructionSet from "../../models/instructionSet";
import MemoryTable from "../layout/MemoryTable";
import styles from "./Memory.module.css";
import React from "react";

interface MemoryProps {
  memory: number[];
  setMemory: React.Dispatch<React.SetStateAction<number[]>>;
  isa: InstructionSet;
}

function Memory({ memory, setMemory, isa }: MemoryProps) {

  return (
    <div>
      <div className={styles.container}>
        <center>
          <div className={styles.tableContainer}>
            <MemoryTable
              memory={memory}
              setMemory={setMemory}
              isa={isa}
            />
          </div>
        </center>
      </div>
    </div>
  );
}

export default Memory;
