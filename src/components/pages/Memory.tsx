import InstructionSet from "../../models/instructionSet";
import CodeSegmentTable from "../layout/CodeSegmentTable";
import DataSegmentTable from "../layout/DataSegmentTable";
import "./Memory.module.css";

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
      <br />
      <h1>Memória</h1>
      <br />
      <h2>Segmento de Código</h2>
      <CodeSegmentTable
        memory={memory.slice(0, 128)}
        setMemory={setCodeSegmentMemory}
        isa={isa}
      />
      <h2>Segmento de Dados</h2>
      <DataSegmentTable
        memory={memory.slice(128, 256)}
        setMemory={setDataSegmentMemory}
        isa={isa}
      />
    </div>
  );
}

export default Memory;
