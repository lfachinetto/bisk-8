import Navbar from "./components/layout/Navbar";
import Memory from "./components/pages/Memory";
import { useEffect, useState } from "react";
import RegisterFile from "./models/registerFile";
import InstructionSet from "./models/instructionSet";
import { searchAddress, searchInstruction } from "./services/operations";
import styles from "./App.module.css";
import Simulation from "./components/pages/Simulation";
import ActionsBar from "./components/layout/ActionsBar";

enum Phase {
  searchInstruction,
  searchAddress,
  executeInstruction,
}

let phase: Phase = Phase.searchInstruction;
let cicle: number = 0;

let fHnd: FileSystemFileHandle;

function App() {
  const [registers, setRegisters] = useState<RegisterFile>(new RegisterFile());
  const [memory, setMemory] = useState<number[]>(new Array(256).fill(0));
  const [rtl, setRtl] = useState<string[]>([]);
  const isa = new InstructionSet();

  function runCicleByCicle() {
    if (registers.registers["HLT"].value === 1) {
      console.log("Halted!");
      return;
    }

    const newRegisters = registers.clone();
    const newMemory = [...memory];
    const newRtl: string[] = [...rtl];

    if (phase === Phase.searchInstruction) {
      const length = searchInstruction.length;
      if (cicle == 0) newRtl.push("#Ciclo de busca da instrução");

      newRtl.push(searchInstruction[cicle](newRegisters, newMemory));

      // Testa se terminou fase
      if (cicle === length - 1) {
        // Determina instrução para saber se precisa buscar endereço
        const instruction =
          isa.instructions[newRegisters.registers["IR"].value];

        if (instruction) {
          cicle = 0;
          if (instruction.requiresAddress) {
            phase = Phase.searchAddress;
          } else {
            phase = Phase.executeInstruction;
          }
        } else
          throw new Error(
            `Opcode ${newMemory[newRegisters.registers["PC"].value].toString(2).padStart(8, "0")} not found`
          );
      } else {
        cicle++;
      }
    } else if (phase === Phase.searchAddress) {
      const length = searchAddress.length;
      if (cicle == 0) newRtl.push("#Ciclo de busca do endereço");

      newRtl.push(searchAddress[cicle](newRegisters, newMemory));

      // Testa se terminou fase
      if (cicle === length - 1) {
        cicle = 0;
        phase = Phase.executeInstruction;
      } else {
        cicle++;
      }
    } else {
      const instruction = isa.instructions[newRegisters.registers["IR"].value];

      const length = instruction.operation.length;

      if (cicle == 0) newRtl.push("#Ciclo de execução da instrução");

      newRtl.push(
        isa.instructions[newRegisters.registers["IR"].value].operation[cicle](
          newRegisters,
          newMemory
        )
      );

      // Testa se terminou fase
      if (cicle === length - 1) {
        cicle = 0;
        phase = Phase.searchInstruction;
      } else {
        cicle++;
      }
    }

    // Atualiza estado para refletir na interface
    setRegisters(newRegisters);
    setMemory(newMemory);
    setRtl(newRtl);
  }

  function runInstByInst() {
    if (registers.registers["HLT"].value === 1) {
      console.log("Halted!");
      return;
    }
    const newRegisters = registers.clone();
    const newMemory = [...memory];
    const newRtl: string[] = [...rtl];

    runInstruction(newRegisters, newMemory, newRtl);

    // Atualiza estado para refletir na interface
    setRegisters(newRegisters);
    setMemory(newMemory);
    setRtl(newRtl);
  }

  function runAll() {
    const newRegisters = new RegisterFile();
    const newMemory = [...memory];
    const newRtl: string[] = [];

    while (newRegisters.registers["PC"].value < 256) {
      runInstruction(newRegisters, newMemory, newRtl);
      if (newRegisters.registers["HLT"].value === 1) {
        break;
      }
    }

    // Atualiza estado para refletir na interface
    setRegisters(newRegisters);
    setMemory(newMemory);
    setRtl(newRtl);
  }

  function runInstruction(
    newRegisters: RegisterFile,
    newMemory: number[],
    newRtl: string[]
  ) {
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
  }

  function clear() {
    setRegisters(new RegisterFile());
    setMemory(new Array(256).fill(0));
    setRtl([]);
  }

  function getCurrentDateTime() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}-${minutes}`;
  }

  async function save() {
    if (!("showOpenFilePicker" in self)) {
      downloadMemory();
      return;
    }

    if (fHnd) {
      const writable = await fHnd.createWritable();
      await writable.write(JSON.stringify(memory));
      await writable.close();
    } else
      fHnd = await window.showSaveFilePicker({
        suggestedName: "Bisk-8 Memory " + getCurrentDateTime() + ".json",
        types: [
          {
            description: "Memória do Bisk-8",
            accept: {
              "application/json": [".json"],
            },
          },
        ],
      });
  }

  function downloadMemory() {
    // create file in browser
    const fileName = "Bisk-8 Memory " + getCurrentDateTime();
    const json = JSON.stringify(memory);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }

  function uploadMemory() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (e) => {
          const text = e.target?.result as string;
          const newMemory = JSON.parse(text);
          setMemory(newMemory);
        };
      }
    };
    input.click();
  }

  // Avisa de saída sem salvar
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      return "Você tem certeza que deseja sair?";
    };

    if (memory.some((value) => value !== 0))
      window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [memory]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      <Navbar />
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.buttons}>
            <ActionsBar
              clear={clear}
              uploadMemory={uploadMemory}
              save={save}
              downloadMemory={downloadMemory}
              runAll={runAll}
              runInstByInst={runInstByInst}
              runCicleByCicle={runCicleByCicle}
            />
          </div>
       
          <Memory
            memory={memory}
            setMemory={setMemory}
            file={registers}
            isa={isa}
          />
        </div>
        <div className={styles.right}>
          <br />
          <br />
          <h2>Simulação</h2>
          <Simulation registers={registers} isa={isa} rtl={rtl} />
        </div>
      </div>
    </>
  );
}

export default App;
