import MemoryModel from "../../models/memory";
import RegisterFile from "../../models/registerFile";
import MemoryTable from "../layout/memory/MemoryTable";
import { useState } from "react";

interface MemoryProps {
  memory: MemoryModel;
  setMemory: (memory: MemoryModel) => void;
  file: RegisterFile;
}

function Memory({ memory, setMemory, file }: MemoryProps) {
  const [currentField, setCurrentField] = useState<number | undefined>(
    undefined
  );

  return (
    <div>
      <h3>Memória</h3>

      <MemoryTable
        memory={memory}
        setMemory={setMemory}
        file={file}
        setCurrentField={setCurrentField}
      />
    </div>
  );
}

export default Memory;
