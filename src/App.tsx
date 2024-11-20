import Navbar from "./components/layout/Navbar";
import Memory from "./components/pages/Memory";
import { useEffect, useState } from "react";
import RegisterFile from "./models/registerFile";
import InstructionSet from "./models/instructionSet";
import { searchAddress, searchInstruction } from "./services/operations";
import styles from "./App.module.css";
import Simulation from "./components/pages/Simulation";
import SimulationToolbar from "./components/layout/simulation/SimulationToolbar";
import MemoryToolbar from "./components/layout/memory/MemoryToolbar";
import MemoryModel from "./models/memory";

enum Phase {
  searchInstruction,
  searchAddress,
  executeInstruction,
}

let phase: Phase = Phase.searchInstruction;
let cicle: number = 0;
let inMiddleInst: boolean = false;
let unsavedChanges: boolean = false;

let fsHandle: FileSystemFileHandle;

// Variáveis com uso mais frequente que renderização
let currentMemory = new MemoryModel();
let currentRunning = false;
let currentClock = 1;
let currentIOBegin = 0xf0;
let currentIOEnd = 0xff;

let port: SerialPort | null = null;
let reader: ReadableStreamDefaultReader<string> | null = null;
let writer: WritableStreamDefaultWriter<string> | null = null;

function App() {
  const [registers, setRegisters] = useState<RegisterFile>(new RegisterFile());
  const [memory, setMemory] = useState<MemoryModel>(new MemoryModel());
  const [rtl, setRtl] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [clock, setClock] = useState(1);
  const [connected, setConnected] = useState(false);
  const [IOBegin, setIOBegin] = useState<number>(0xf0);
  const [IOEnd, setIOEnd] = useState<number>(0xff);
  const isa = new InstructionSet();

  function runCicleByCicle() {
    if (registers.registers["HLT"].value === 1) {
      alert("Halted!");
      return;
    }

    const newRegisters = registers.clone();
    const newRtl: string[] = [...rtl];
    inMiddleInst = true;

    if (phase === Phase.searchInstruction) {
      const length = searchInstruction.length;
      if (cicle == 0) newRtl.push("#Ciclo de busca da instrução");

      newRtl.push(searchInstruction[cicle](newRegisters, currentMemory));

      // Testa se terminou fase
      if (cicle === length - 1) {
        // Determina instrução para saber se precisa buscar endereço
        const instruction =
          isa.instructions[newRegisters.registers["IR"].value];

        cicle = 0;
        if (instruction.requiresAddress) {
          phase = Phase.searchAddress;
        } else {
          phase = Phase.executeInstruction;
        }
      } else {
        cicle++;
      }
    } else if (phase === Phase.searchAddress) {
      const length = searchAddress.length;
      if (cicle == 0) newRtl.push("#Ciclo de busca do endereço");

      newRtl.push(searchAddress[cicle](newRegisters, currentMemory));

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

      newRtl.push(instruction.operation[cicle](newRegisters, currentMemory));

      // Testa se terminou fase
      if (cicle === length - 1) {
        cicle = 0;
        phase = Phase.searchInstruction;
        inMiddleInst = false;
      } else {
        cicle++;
      }
    }

    // Atualiza estado para refletir na interface
    setRegisters(newRegisters);
    setMemory(currentMemory);
    setRtl(newRtl);
  }

  function runInstByInst() {
    if (registers.registers["HLT"].value === 1) {
      alert("Halted!");
      return;
    }
    const newRegisters = registers.clone();
    const newRtl: string[] = [...rtl];

    runInstruction(newRegisters, currentMemory, newRtl);

    // Atualiza estado para refletir na interface
    setRegisters(newRegisters);
    setMemory(currentMemory);
    setRtl(newRtl);
  }

  function hasState(): boolean {
    // Identifica se algum registrador tem valor
    for (const register in registers.registers) {
      if (registers.registers[register].value !== 0) return true;
    }
    return false;
  }

  async function runAll() {
    const newRegisters = new RegisterFile();
    const newRtl: string[] = [];

    // Confirma limpeza de estado
    if (
      hasState() &&
      !window.confirm(
        "Ao executar tudo, os registradores serão resetados. Deseja continuar?"
      )
    ) {
      return;
    }

    // Ativa flag de executando

    setRunning(true);
    currentRunning = true;

    do {
      const startTime = performance.now();
      runInstruction(newRegisters, currentMemory, newRtl);
      const elapsedTime = performance.now() - startTime;

      const clockPeriod = 1000 / currentClock;
      const delayTime = clockPeriod - elapsedTime;

      // Clock
      await new Promise((resolve) =>
        setTimeout(resolve, Math.max(0, delayTime))
      );

      // Atualiza estado para refletir na interface
      setRegisters(newRegisters);
      setMemory(currentMemory);
      // Mostra apenas 100 últimos passos
      setRtl(newRtl.slice(-100));
    } while (newRegisters.registers["HLT"].value !== 1 && currentRunning);
  }

  function runInstruction(
    newRegisters: RegisterFile,
    newMemory: MemoryModel,
    newRtl: string[]
  ) {
    newRtl.push("#Ciclo de busca da instrução");
    // Realiza etapas de busca de instrução
    searchInstruction.forEach((cicle) => {
      newRtl.push(cicle(newRegisters, newMemory));
    });

    const instruction = isa.instructions[newRegisters.registers["IR"].value];

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
  }

  function clear() {
    inMiddleInst = false;
    setRegisters(new RegisterFile());
    currentMemory.clear();
    setMemory(currentMemory);
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

    if (!fsHandle)
      fsHandle = await window.showSaveFilePicker({
        suggestedName: "Bisk-8 Memory " + getCurrentDateTime() + ".json",
        types: [
          {
            description: "Memória do Bisk-8",
            accept: {
              "application/json": [".json"],
            },
          },
        ],
        excludeAcceptAllOption: true,
      });

    const writable = await fsHandle.createWritable();
    await writable.write(JSON.stringify(memory));
    await writable.close();

    unsavedChanges = false;
  }

  // Função caso navegador não suporte save
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
    // Confirma limpeza de estado
    if (
      (hasState() || memory.data.some((value) => value !== 0)) &&
      !window.confirm(
        "Ao fazer upload, os registradores e memória serão resetados. Deseja continuar?"
      )
    ) {
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (e) => {
          try {
            const text = e.target?.result as string;
            const newMemory = JSON.parse(text);
            setMemoryChange(new MemoryModel(newMemory.data));
            clearRegisters();
          } catch (e) {
            alert("Ocorreu um erro ao fazer upload do arquivo!");
          }
        };
      }
    };
    input.click();
  }

  function clearRegisters() {
    inMiddleInst = false;
    setRegisters(new RegisterFile());
    setRtl([]);
  }

  async function openConnection() {
    if (port) {
      reader!.cancel();
      writer!.close();

      setTimeout(async () => {
        await port!.close();
        setConnected(false);
        port = null;
        writer = null;
        reader = null;
      }, 100);

      return;
    }
    try {
      port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });

      const textEncoder = new TextEncoderStream();
      textEncoder.readable.pipeTo(port.writable!);
      writer = textEncoder.writable.getWriter();

      const textDecoder = new TextDecoderStream();
      port.readable!.pipeTo(textDecoder.writable);
      reader = textDecoder.readable.getReader();

      setConnected(true);

      readSerialData();
    } catch (error) {
      if ((error as DOMException).name == "NotFoundError") return;

      setConnected(false);
      alert("Erro ao abrir conexão serial!");
      console.error("Error connecting to serial port:", error);
    }
  }

  async function readSerialData() {
    if (!reader) return;

    try {
      let buffer = "";

      while (port!.readable) {
        const { value, done } = await reader.read();
        if (done) {
          reader.releaseLock();
          break;
        }

        if (value) {
          buffer += value;

          let newlineIndex = buffer.indexOf("\n");
          while (newlineIndex !== -1 && port!.readable) {
            const message = buffer.slice(0, newlineIndex).trim();
            handleSerialRequest(message);
            buffer = buffer.slice(newlineIndex + 1);
            newlineIndex = buffer.indexOf("\n");
          }
        }
      }
    } catch (error) {
      setConnected(false);
      console.error("Error reading serial data:", error);
    }
  }

  function handleSerialRequest(message: string) {
    // Operação (0 read, 1 write) + endereço 8 bits hexa
    // + [valor 8 bits hexa] e \n no final

    // Regex para validar mensagem
    const regex = /^(0[\da-fA-F]{2}|1[\da-fA-F]{4})$/;

    if (regex.test(message)) {
      const data = message.split("");

      // Endereço para escrita ou leitura com offset do início de IO
      const operation = parseInt(data[0]);
      const address = currentIOBegin + parseInt(data[1] + data[2], 16);

      if (address < currentIOBegin || address > currentIOEnd) {
        console.error(`Endereço fora do intervalo de IO: ${address}!`);
        return;
      }

      // Escrita
      if (operation === 0x01 && data.length >= 4) {
        const value = parseInt(data[3] + data[4], 16);

        const newMemory = currentMemory.clone();
        newMemory.data[address] = value;

        setMemoryChange(newMemory);

        // console.log(`Write: Memory[${address}] = ${value}`);
      }
      // Leitura
      else if (operation === 0x00) {
        const valueToSend: number = currentMemory.data[address];
        sendDataToSerial(
          `${valueToSend.toString(16).padStart(2, "0").toUpperCase()}\n`
        );

        // console.log(`Read: Memory[${address}] = ${valueToSend}`);
      }
    } else {
      console.error(`Invalid message received: ${message}`);
    }
  }

  async function sendDataToSerial(data: string) {
    if (writer) {
      await writer.write(data);
    }
  }

  function setMemoryChange(memory: MemoryModel) {
    currentMemory = memory;
    setMemory(currentMemory);
  }

  // Avisa de saída sem salvar
  useEffect(() => {
    unsavedChanges = true;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        event.preventDefault();
        return "Você tem certeza que deseja sair?";
      }
    };

    if (memory.data.some((value) => value !== 0))
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
      <Navbar
        openConnection={"serial" in navigator ? openConnection : null}
        connected={connected}
        IOBegin={IOBegin}
        setIOBegin={(begin) => {
          setIOBegin(begin);
          currentIOBegin = begin;
        }}
        IOEnd={IOEnd}
        setIOEnd={(end) => {
          setIOEnd(end);
          currentIOEnd = end;
        }}
      />
      <div className={styles.container}>
        <div className={styles.left}>
          <MemoryToolbar
            clear={clear}
            uploadMemory={uploadMemory}
            save={save}
            runAll={running ? null : runAll}
            stop={() => {
              setRunning(false);
              currentRunning = false;
            }}
            runInstByInst={inMiddleInst ? null : runInstByInst}
            runCicleByCicle={runCicleByCicle}
          />
          <Memory
            memory={memory}
            setMemory={setMemoryChange}
            file={registers}
            isa={isa}
          />
        </div>
        <div className={styles.right}>
          <SimulationToolbar
            clearRegisters={clearRegisters}
            changeClock={(value) => {
              setClock(value);
              currentClock = value;
            }}
            clock={clock}
          />
          <Simulation registers={registers} isa={isa} rtl={rtl} />
        </div>
      </div>
    </>
  );
}

export default App;
