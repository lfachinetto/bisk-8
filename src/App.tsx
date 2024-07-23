import Navbar from "./components/layout/Navbar";
import Memory from "./components/pages/Memory";
import { useState } from "react";
import RegisterBank from "./models/registerBank";
import InstructionSet from "./models/instructionSet";

function App() {
  // const [count, setCount] = useState(0);

  const [registers, setRegisters] = useState<RegisterBank>(new RegisterBank());
  const isa = new InstructionSet();
  const [memory, setMemory] = useState<number[]>(new Array(256).fill(0));

  // const registers = new RegisterBank();
  // const isa = new InstructionSet();
  // const memory = new Array(256).fill(0);

  // isa.findByMnemonic("add")!.operation!(registers, memory);

  return (
    <>
      <Navbar />
      <Memory memory={memory} setMemory={setMemory} isa={isa} />
    </>
  );
}

export default App;
