import Navbar from "./components/layout/Navbar";
import Memory from "./components/pages/Memory";
import { useState } from "react";
import RegisterFile from "./models/registerFile";
import InstructionSet from "./models/instructionSet";
import { searchAddress, searchInstruction } from "./services/operations";
import styles from "./App.module.css";
import Simulation from "./components/pages/Simulation";

function App() {
  // const [count, setCount] = useState(0);

  const [registers, setRegisters] = useState<RegisterFile>(new RegisterFile());
  const [memory, setMemory] = useState<number[]>(new Array(256).fill(0));
  const [rtl, setRtl] = useState<string[]>([]);
  const isa = new InstructionSet();

  // const registers = new RegisterFile();
  // const isa = new InstructionSet();
  // const memory = new Array(256).fill(0);

  // isa.findByMnemonic("add")!.operation!(registers, memory);

  function runAll() {
    const newRegisters = new RegisterFile();
    const newMemory = [...memory];      
    let newRtl: string[] = [];

    while (newRegisters.registers["PC"].value < 256) {
      // Realiza etapas de busca de instrução
      newRtl = newRtl.concat(searchInstruction(newRegisters, newMemory));

      // Realiza etapas de busca de endereço (instruções de 2 bytes)
      if (
        newRegisters.registers["IR"].value != 0b0 &&
        newRegisters.registers["IR"].value != 0b0111 &&
        newRegisters.registers["IR"].value != 0b1110 &&
        newRegisters.registers["IR"].value != 0b1111
      ) {
        newRtl = newRtl.concat(searchAddress(newRegisters, newMemory));
      }

      const instruction = isa.instructions[newRegisters.registers["IR"].value];

      if (instruction) {
        newRtl = newRtl.concat(instruction.operation!(newRegisters, newMemory));
      } else
        throw new Error(
          `Opcode ${newMemory[newRegisters.registers["PC"].value].toString(2).padStart(8, "0")} not found`
        );

      if (newRegisters.registers["HLT"].value === 1) {
        break;
      }
    }

    // Atualiza estado para refletir na interface
    setRegisters(newRegisters);
    setMemory(newMemory);
    // setRtl([...rtl, ...newRtl]);
  }

  return (
    <>
      <Navbar />
      <button onClick={runAll}>Run All</button>
      <div className={styles.container}>
        <div className={styles.left}>
          <Memory memory={memory} setMemory={setMemory} isa={isa} />
        </div>
        <div className={styles.right}>
          <Simulation registers={registers} isa={isa} rtl={rtl} />
        </div>
      </div>
    </>
  );
}

export default App;
