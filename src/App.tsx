import Navbar from "./components/layout/Navbar";
import Memory from "./components/pages/Memory";
import { useState } from "react";
import RegisterFile from "./models/registerFile";
import InstructionSet from "./models/instructionSet";
import { searchAddress, searchInstruction } from "./services/operations";

function App() {
  // const [count, setCount] = useState(0);

  const [registers, setRegisters] = useState<RegisterFile>(new RegisterFile());
  const isa = new InstructionSet();
  const [memory, setMemory] = useState<number[]>(new Array(256).fill(0));

  // const registers = new RegisterFile();
  // const isa = new InstructionSet();
  // const memory = new Array(256).fill(0);

  // isa.findByMnemonic("add")!.operation!(registers, memory);

  function runAll() {
    for (let i = 0; i < 1; i++) {
      const rtl = searchInstruction(registers, memory);
      console.log(rtl);
      if (
        registers.registers["IR"].value != 0b0 &&
        registers.registers["IR"].value != 0b0111 &&
        registers.registers["IR"].value != 0b1111
      ) {
        const rtl = searchAddress(registers, memory);
        console.log(rtl);
      }
      const instruction = isa.instructions[memory[i]];
      if (instruction?.mnemonic === "HLT") break;
      else if (instruction && instruction.operation) {
        const rtl = instruction.operation!(registers, memory);
        console.log(rtl);
        setRegisters(registers);
        setMemory(memory);
        console.log(registers);
        console.log(memory);
      } else
        throw new Error(
          `Opcode ${memory[i].toString(2).padStart(8, "0")} not found`
        );
    }
  }

  return (
    <>
      <Navbar />
      <button onClick={runAll}>Run All</button>
      <Memory memory={memory} setMemory={setMemory} isa={isa} />
    </>
  );
}

export default App;
