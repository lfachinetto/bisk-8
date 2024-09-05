import Navbar from "./components/layout/Navbar";
import Memory from "./components/pages/Memory";
import { useState } from "react";
import RegisterFile from "./models/registerFile";
import InstructionSet from "./models/instructionSet";
import { searchAddress, searchInstruction } from "./services/operations";
import styles from "./App.module.css";
import Simulation from "./components/pages/Simulation";

function App() {
  const [registers, setRegisters] = useState<RegisterFile>(new RegisterFile());
  const [memory, setMemory] = useState<number[]>(new Array(256).fill(0));
  const [rtl, setRtl] = useState<string[]>([]);
  const isa = new InstructionSet();

  function runAll() {
    const newRegisters = new RegisterFile();
    const newMemory = [...memory];
    const newRtl: string[] = [];

    while (newRegisters.registers["PC"].value < 256) {
      newRtl.push("#Ciclo de busca da instrução");
      // Realiza etapas de busca de instrução
      searchInstruction.forEach((cicle) => {
        newRtl.push(cicle(newRegisters, newMemory));
      });

      const instruction = isa.instructions[newRegisters.registers["IR"].value];

      if (instruction) {
        // Realiza etapas de busca de endereço (instruções de 2 bytes)
        if (instruction.requiresAddress) {
          newRtl.push("#Ciclo de busca do endereço");
          searchAddress.forEach((cicle) => {
            newRtl.push(cicle(newRegisters, newMemory));
          });
        }

        newRtl.push("#Ciclo de execução da instrução");
        // Executa operação da instrução
        instruction.operation.forEach((cicle) => {
          newRtl.push(cicle(newRegisters, newMemory));
        });
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
    setRtl(newRtl);
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
