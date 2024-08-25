import InstructionSet from "../../models/instructionSet";
import DataSegmentTable from "../layout/MemoryTable";
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
            <DataSegmentTable
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
