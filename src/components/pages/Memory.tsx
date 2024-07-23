import InstructionSet from "../../models/instructionSet";
import CodeSegmentTable from "../layout/CodeSegmentTable";

interface MemoryProps {
  memory: number[];
  setMemory: React.Dispatch<React.SetStateAction<number[]>>;
  isa: InstructionSet;
}

function Memory({ memory, setMemory, isa }: MemoryProps) {
  const codeSegmnentMemory = memory.slice(0, 16);

  function setCodeSegmentMemory(newMemory: number[]) {
    setMemory([...newMemory, ...memory.slice(16)]);
  }

  return (
    <div>
      <h1>Memória</h1>
      <h2>Segmento de Código</h2>
      <CodeSegmentTable memory={codeSegmnentMemory} setMemory={setCodeSegmentMemory} isa={isa} />      
    </div>
  );
}

export default Memory;
