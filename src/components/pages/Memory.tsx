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
    <MemoryTable
      memory={memory}
      setMemory={setMemory}
      file={file}
      setCurrentField={setCurrentField}
    />
  );
}

export default Memory;
