import InstructionSet from "../../models/instructionSet";
import CodeSegmentTable from "../layout/CodeSegmentTable";
import DataSegmentTable from "../layout/DataSegmentTable";
import styles from "./Memory.module.css";
import React from "react";

interface MemoryProps {
  memory: number[];
  setMemory: React.Dispatch<React.SetStateAction<number[]>>;
  isa: InstructionSet;
}

function Memory({ memory, setMemory, isa }: MemoryProps) {
  function setCodeSegmentMemory(newMemory: number[]) {
    setMemory([...newMemory, ...memory.slice(128)]);
    console.log("Memory", [...newMemory, ...memory.slice(128)]);
  }

  function setDataSegmentMemory(newMemory: number[]) {
    setMemory([...memory.slice(0, 128), ...newMemory]);
    console.log("Memory", [...memory.slice(0, 128), ...newMemory]);
  }

  return (
    <div>
      <div className={styles.container}>
        <h2>Segmento de Código</h2>
        <br />
        <div className={styles.tableContainer}>
          <CodeSegmentTable
            memory={memory.slice(0, 128)}
            setMemory={setCodeSegmentMemory}
            isa={isa}
          />
        </div>
        <br />
        <h2>Segmento de Dados</h2>
        <br />
        <div className={styles.tableContainer}>
          <DataSegmentTable
            memory={memory.slice(128, 256)}
            setMemory={setDataSegmentMemory}
            isa={isa}
          />
        </div>
      </div>
    </div>
  );
}

export default Memory;
