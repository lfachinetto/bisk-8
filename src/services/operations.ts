import Memory from "../models/memory";
import RegisterFile from "../models/registerFile";

// Busca instrução (ciclo 0 a 3)
// 0 MAR ← PC
// 1 MDR ← MEM[MAR]
// 2 PC ← PC + 1
// 3 IR ← MDR
export const searchInstruction = [
  (file: RegisterFile): string => {
    file.registers["MAR"].value = file.registers["PC"].value;
    return "MAR ← PC";
  },
  (file: RegisterFile, memory: Memory): string => {
    file.registers["MDR"].value = memory.data[file.registers["MAR"].value];
    return "MDR ← MEM[MAR]";
  },
  (file: RegisterFile): string => {
    // Se PC chegou ao fim, volta para o início
    if (file.registers["PC"].value === 2 ** file.registers["PC"].bitLength - 1)
      file.registers["PC"].value = 0;
    else file.registers["PC"].value += 1;
    return "PC ← PC + 1";
  },
  (file: RegisterFile): string => {
    file.registers["IR"].value = file.registers["MDR"].value & 0x0f;
    return "IR ← MDR";
  },
];

// Busca endereço (ciclo 4 a 6, intruções com endereço)
// 4 MAR ← PC
// 5 MDR ← MEM[MAR]
// 6 PC ← PC + 1
export const searchAddress = [
  (file: RegisterFile): string => {
    file.registers["MAR"].value = file.registers["PC"].value;
    return "MAR ← PC";
  },
  (file: RegisterFile, memory: Memory): string => {
    file.registers["MDR"].value = memory.data[file.registers["MAR"].value];
    return "MDR ← MEM[MAR]";
  },
  (file: RegisterFile): string => {
    // Se PC chegou ao fim, volta para o início
    if (file.registers["PC"].value === 2 ** file.registers["PC"].bitLength)
      file.registers["PC"].value = 0;
    else file.registers["PC"].value += 1;
    return "PC ← PC + 1";
  },
];

// Instrução NOP
export const nop = [
  (): string => {
    return "-";
  },
];

// Instrução LDA
// 7 MAR ← MDR
// 8 MDR ← MEM[MAR]
// 9 ACC  ← MDR
export const lda = [
  (file: RegisterFile): string => {
    file.registers["MAR"].value = file.registers["MDR"].value;
    return "MAR ← MDR";
  },
  (file: RegisterFile, memory: Memory): string => {
    file.registers["MDR"].value = memory.data[file.registers["MAR"].value];
    return "MDR ← MEM[MAR]";
  },
  (file: RegisterFile): string => {
    file.registers["ACC"].value = file.registers["MDR"].value;
    return "ACC ← MDR";
  },
];

// Instrução STA
// 7 MAR ← MDR
// 8 MDR ← ACC
// 9 MEM[MAR] ← MDR
export const sta = [
  (file: RegisterFile): string => {
    file.registers["MAR"].value = file.registers["MDR"].value;
    return "MAR ← MDR";
  },
  (file: RegisterFile): string => {
    file.registers["MDR"].value = file.registers["ACC"].value;
    return "MDR ← ACC";
  },
  (file: RegisterFile, memory: Memory): string => {
    memory.data[file.registers["MAR"].value] = file.registers["MDR"].value;
    return "MEM[MAR] ← MDR";
  },
];

// Instrução ADD
// 7 MAR ← MDR
// 8 MDR ← MEM[MAR]
// 9 ACC ← ACC + MDR
export const add = [
  (file: RegisterFile): string => {
    file.registers["MAR"].value = file.registers["MDR"].value;
    return "MAR ← MDR";
  },
  (file: RegisterFile, memory: Memory): string => {
    file.registers["MDR"].value = memory.data[file.registers["MAR"].value];
    return "MDR ← MEM[MAR]";
  },
  (file: RegisterFile): string => {
    file.registers["ACC"].value = toSigned8Bit(
      file.registers["ACC"].value + file.registers["MDR"].value
    );
    testFlags(file);
    return "ACC ← ACC + MDR";
  },
];

// Instrução SUB
// 7 MAR ← MDR
// 8 MDR ← MEM[MAR]
// 9 ACC ← ACC - MDR
export const sub = [
  (file: RegisterFile): string => {
    file.registers["MAR"].value = file.registers["MDR"].value;
    return "MAR ← MDR";
  },
  (file: RegisterFile, memory: Memory): string => {
    file.registers["MDR"].value = memory.data[file.registers["MAR"].value];
    return "MDR ← MEM[MAR]";
  },
  (file: RegisterFile): string => {
    file.registers["ACC"].value = toSigned8Bit(
      file.registers["ACC"].value - file.registers["MDR"].value
    );
    testFlags(file);
    return "ACC ← ACC - MDR";
  },
];

// Instrução MUL
// 7 MAR ← MDR
// 8 MDR ← MEM[MAR]
// 9 ACC ← ACC * MDR
export const mul = [
  (file: RegisterFile): string => {
    file.registers["MAR"].value = file.registers["MDR"].value;
    return "MAR ← MDR";
  },
  (file: RegisterFile, memory: Memory): string => {
    file.registers["MDR"].value = memory.data[file.registers["MAR"].value];
    return "MDR ← MEM[MAR]";
  },
  (file: RegisterFile): string => {
    file.registers["ACC"].value = toSigned8Bit(
      file.registers["ACC"].value * file.registers["MDR"].value
    );
    testFlags(file);
    return "ACC ← ACC * MDR";
  },
];

// Instrução DIV
// 7 MAR ← MDR
// 8 MDR ← MEM[MAR]
// 9 ACC ← ACC / MDR
export const div = [
  (file: RegisterFile): string => {
    file.registers["MAR"].value = file.registers["MDR"].value;
    return "MAR ← MDR";
  },
  (file: RegisterFile, memory: Memory): string => {
    file.registers["MDR"].value = memory.data[file.registers["MAR"].value];
    return "MDR ← MEM[MAR]";
  },
  (file: RegisterFile): string => {
    file.registers["ACC"].value = toSigned8Bit(
      file.registers["ACC"].value / file.registers["MDR"].value
    );
    testFlags(file);
    return "ACC ← ACC / MDR";
  },
];

// Instrução NOT
// 4 ACC ← ~ACC
export const not = [
  (file: RegisterFile): string => {
    file.registers["ACC"].value = toSigned8Bit(~file.registers["ACC"].value);
    testFlags(file);
    return "ACC ← ~ACC";
  },
];

// Instrução AND
// 7 MAR ← MDR
// 8 MDR ← MEM[MAR]
// 9 ACC ← ACC & MDR
export const and = [
  (file: RegisterFile): string => {
    file.registers["MAR"].value = file.registers["MDR"].value;
    return "MAR ← MDR";
  },
  (file: RegisterFile, memory: Memory): string => {
    file.registers["MDR"].value = memory.data[file.registers["MAR"].value];
    return "MDR ← MEM[MAR]";
  },
  (file: RegisterFile): string => {
    file.registers["ACC"].value =
      file.registers["ACC"].value & file.registers["MDR"].value;
    testFlags(file);
    return "ACC ← ACC & MDR";
  },
];

// Instrução OR
// 7 MAR ← MDR
// 8 MDR ← MEM[MAR]
// 9 ACC ← ACC | MDR
export const or = [
  (file: RegisterFile): string => {
    file.registers["MAR"].value = file.registers["MDR"].value;
    return "MAR ← MDR";
  },
  (file: RegisterFile, memory: Memory): string => {
    file.registers["MDR"].value = memory.data[file.registers["MAR"].value];
    return "MDR ← MEM[MAR]";
  },
  (file: RegisterFile): string => {
    file.registers["ACC"].value = toSigned8Bit(
      file.registers["ACC"].value | file.registers["MDR"].value
    );
    testFlags(file);
    return "ACC ← ACC | MDR";
  },
];

// Instrução XOR
// 7 MAR ← MDR
// 8 MDR ← MEM[MAR]
// 9 ACC ← ACC ^ MDR
export const xor = [
  (file: RegisterFile): string => {
    file.registers["MAR"].value = file.registers["MDR"].value;
    return "MAR ← MDR";
  },
  (file: RegisterFile, memory: Memory): string => {
    file.registers["MDR"].value = memory.data[file.registers["MAR"].value];
    return "MDR ← MEM[MAR]";
  },
  (file: RegisterFile): string => {
    file.registers["ACC"].value = toSigned8Bit(
      file.registers["ACC"].value ^ file.registers["MDR"].value
    );
    testFlags(file);
    return "ACC ← ACC ^ MDR";
  },
];

// Instrução JMP
// 7 PC ← MDR
export const jmp = [
  (file: RegisterFile): string => {
    file.registers["PC"].value = file.registers["MDR"].value;
    return "PC ← MDR";
  },
];

// Instrução JZF
// 7 Se (ZF==1) PC ← MDR
export const jzf = [
  (file: RegisterFile): string => {
    if (file.registers["PSR"].value & 0b01) {
      file.registers["PC"].value = file.registers["MDR"].value;
      return "Se (ZF==1) PC ← MDR";
    }
    return "";
  },
];

// Instrução JSF
// 7 Se (SF==1) PC ← MDR
export const jsf = [
  (file: RegisterFile): string => {
    if (file.registers["PSR"].value & 0b10) {
      file.registers["PC"].value = file.registers["MDR"].value;
      return "Se (SF==1) PC ← MDR";
    }
    return "";
  },
];

// Instrução TST
// 7 _ ← AC
export const tst = [
  (file: RegisterFile): string => {
    testFlags(file);
    return "_ ← AC";
  },
];

// Instrução HLT
// 7 HLT ← 1
export const hlt = [
  (file: RegisterFile): string => {
    file.registers["HLT"].value = 1;
    return "HLT ← 1";
  },
];

// Realiza testes para atualizar flags
// Origem: operações na ULA ou instrução TST
function testFlags(file: RegisterFile) {
  if (file.registers["ACC"].value == 0) {
    file.registers["PSR"].value |= 0b01;
  } else {
    file.registers["PSR"].value &= 0b10;
  }

  if (file.registers["ACC"].value < 0) {
    file.registers["PSR"].value |= 0b10;
  } else {
    file.registers["PSR"].value &= 0b01;
  }
}

// Função para garantir complemento de 2 de 8 bits
function toSigned8Bit(value: number) {
  const maskedValue = value & 0xff; // Aplica a máscara de 8 bits
  return maskedValue > 127 ? maskedValue - 256 : maskedValue; // Converte para complemento de 2
}
