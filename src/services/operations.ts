import RegisterFile from "../models/registerFile";

// Busca instrução (ciclo 0 a 3)
export function searchInstruction(
  file: RegisterFile,
  memory: number[],
  step?: number
): string[] {
  // 0	MAR <- PC
  // 1	MDR <- MEM[MAR]
  // 2	PC <- PC + 1
  // 3	IR <- MDR

  const rtl: string[] = [];

  if (step == 0 || step == null) {
    file.registers["MAR"].value = file.registers["PC"].value;
    rtl.push("MAR <- PC");
  }

  if (step == 1 || step == null) {
    file.registers["MDR"].value = memory[file.registers["MAR"].value];
    rtl.push("MDR <- MEM[MAR]");
  }

  if (step == 2 || step == null) {
    file.registers["PC"].value += 1;
    rtl.push("PC <- PC + 1");
  }

  if (step == 3 || step == null) {
    file.registers["IR"].value = file.registers["MDR"].value;
    rtl.push("IR <- MDR");
  }

  return rtl;
}

// Busca endereço (ciclo 4 a 6, intruções com endereço)
export function searchAddress(
  file: RegisterFile,
  memory: number[],
  step?: number
): string[] {
  // 4	MAR <- PC
  // 5	MDR <- MEM[MAR]
  // 6	PC <- PC + 1
  const rtl: string[] = [];

  if (step == 0 || step == null) {
    file.registers["MAR"].value = file.registers["PC"].value;
    rtl.push("MAR <- PC");
  }

  if (step == 1 || step == null) {
    file.registers["MDR"].value = memory[file.registers["MAR"].value];
    rtl.push("MDR <- MEM[MAR]");
  }

  if (step == 2 || step == null) {
    file.registers["PC"].value += 1;
    rtl.push("PC <- PC + 1");
  }

  return rtl;
}

// Instrução NOP
export function nop(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _file: RegisterFile,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _memory: number[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _step?: number
): string[] {

  const rtl: string[] = [];
  
  return rtl;
}

// Instrução LDA
export function lda(
  file: RegisterFile,
  memory: number[],
  step?: number
): string[] {
  // 7	MAR <- MDR
  // 8	MDR <- MEM[MAR]
  // 9	ACC  <- MDR

  const rtl: string[] = [];

  if (step == 0 || step == null) {
    file.registers["MAR"].value = file.registers["MDR"].value;
    rtl.push("MAR <- MDR");
  }

  if (step == 1 || step == null) {
    file.registers["MDR"].value = memory[file.registers["MAR"].value];
    rtl.push("MDR <- MEM[MAR]");
  }

  if (step == 2 || step == null) {
    file.registers["ACC"].value = file.registers["MDR"].value;
    rtl.push("ACC <- MDR");
  }

  return rtl;
}

// Instrução STA
export function sta(
  file: RegisterFile,
  memory: number[],
  step?: number
): string[] {
  // 7	MAR <- MDR
  // 8	MDR <- ACC
  // 9	MEM[MAR] <- MDR

  const rtl: string[] = [];

  if (step == 0 || step == null) {
    file.registers["MAR"].value = file.registers["MDR"].value;
    rtl.push("MAR <- MDR");
  }

  if (step == 1 || step == null) {
    file.registers["MDR"].value = file.registers["ACC"].value;
    rtl.push("MDR <- ACC");
  }

  if (step == 2 || step == null) {
    memory[file.registers["MAR"].value] = file.registers["MDR"].value;
    rtl.push("MEM[MAR] <- MDR");
  }

  return rtl;
}

// Instrução ADD
export function add(
  file: RegisterFile,
  memory: number[],
  step?: number
): string[] {
  // 7	MAR <- MDR
  // 8	MDR <- MEM[MAR]
  // 9	ACC <- ACC + MDR
  const rtl: string[] = [];

  if (step == 0 || step == null) {
    file.registers["MAR"].value = file.registers["MDR"].value;
    rtl.push("MAR <- MDR");
  }

  if (step == 1 || step == null) {
    file.registers["MDR"].value = memory[file.registers["MAR"].value];
    rtl.push("MDR <- MEM[MAR]");
  }

  if (step == 2 || step == null) {
    console.log(file.registers["ACC"].value);
    file.registers["ACC"].value += file.registers["MDR"].value;
    testFlags(file);
    rtl.push("ACC <- ACC + MDR");
  }

  return rtl;
}

// Instrução SUB
export function sub(
  file: RegisterFile,
  memory: number[],
  step?: number
): string[] {
  // 7	MAR <- MDR
  // 8	MDR <- MEM[MAR]
  // 9	ACC <- ACC - MDR
  const rtl: string[] = [];

  if (step == 0 || step == null) {
    file.registers["MAR"].value = file.registers["MDR"].value;
    rtl.push("MAR <- MDR");
  }

  if (step == 1 || step == null) {
    file.registers["MDR"].value = memory[file.registers["MAR"].value];
    rtl.push("MDR <- MEM[MAR]");
  }

  if (step == 2 || step == null) {
    file.registers["ACC"].value -= file.registers["MDR"].value;
    testFlags(file);
    rtl.push("ACC <- ACC - MDR");
  }

  return rtl;
}

// Instrução MUL
export function mul(
  file: RegisterFile,
  memory: number[],
  step?: number
): string[] {
  // 7	MAR <- MDR
  // 8	MDR <- MEM[MAR]
  // 9	ACC <- ACC * MDR

  const rtl: string[] = [];

  if (step == 0 || step == null) {
    file.registers["MAR"].value = file.registers["MDR"].value;
    rtl.push("MAR <- MDR");
  }

  if (step == 1 || step == null) {
    file.registers["MDR"].value = memory[file.registers["MAR"].value];
    rtl.push("MDR <- MEM[MAR]");
  }

  if (step == 2 || step == null) {
    file.registers["ACC"].value *= file.registers["MDR"].value;
    testFlags(file);
    rtl.push("ACC <- ACC * MDR");
  }

  return rtl;
}

// Instrução DIV
export function div(
  file: RegisterFile,
  memory: number[],
  step?: number
): string[] {
  // 7	MAR <- MDR
  // 8	MDR <- MEM[MAR]
  // 9	ACC <- ACC / MDR
  const rtl: string[] = [];

  if (step == 0 || step == null) {
    file.registers["MAR"].value = file.registers["MDR"].value;
    rtl.push("MAR <- MDR");
  }

  if (step == 1 || step == null) {
    file.registers["MDR"].value = memory[file.registers["MAR"].value];
    rtl.push("MDR <- MEM[MAR]");
  }

  if (step == 2 || step == null) {
    file.registers["ACC"].value /= file.registers["MDR"].value;
    testFlags(file);
    rtl.push("ACC <- ACC / MDR");
  }

  return rtl;
}

// Instrução NOT
export function not(
  file: RegisterFile,
  _memory: number[],
  step?: number
): string[] {
  // 4 ACC <- !ACC
  const rtl: string[] = [];

  if (step == 0 || step == null) {
    file.registers["ACC"].value = ~file.registers["ACC"].value;
    testFlags(file);
    rtl.push("ACC <- !ACC");
  }

  return rtl;
}

// Instrução AND
export function and(
  file: RegisterFile,
  memory: number[],
  step?: number
): string[] {
  // 7	MAR <- MDR
  // 8	MDR <- MEM[MAR]
  // 9	ACC <- ACC & MDR

  const rtl: string[] = [];

  if (step == 0 || step == null) {
    file.registers["MAR"].value = file.registers["MDR"].value;
    rtl.push("MAR <- MDR");
  }

  if (step == 1 || step == null) {
    file.registers["MDR"].value = memory[file.registers["MAR"].value];
    rtl.push("MDR <- MEM[MAR]");
  }

  if (step == 2 || step == null) {
    file.registers["ACC"].value &= file.registers["MDR"].value;
    testFlags(file);
    rtl.push("ACC <- ACC & MDR");
  }

  return rtl;
}

// Instrução OR
export function or(
  file: RegisterFile,
  memory: number[],
  step?: number
): string[] {
  // 7	MAR <- MDR
  // 8	MDR <- MEM[MAR]
  // 9	ACC <- ACC | MDR

  const rtl: string[] = [];

  if (step == 0 || step == null) {
    file.registers["MAR"].value = file.registers["MDR"].value;
    rtl.push("MAR <- MDR");
  }

  if (step == 1 || step == null) {
    file.registers["MDR"].value = memory[file.registers["MAR"].value];
    rtl.push("MDR <- MEM[MAR]");
  }

  if (step == 2 || step == null) {
    file.registers["ACC"].value |= file.registers["MDR"].value;
    testFlags(file);
    rtl.push("ACC <- ACC | MDR");
  }

  return rtl;
}

// Instrução XOR
export function xor(
  file: RegisterFile,
  memory: number[],
  step?: number
): string[] {
  // 7	MAR <- MDR
  // 8	MDR <- MEM[MAR]
  // 9	ACC <- ACC ^ MDR

  const rtl: string[] = [];

  if (step == 0 || step == null) {
    file.registers["MAR"].value = file.registers["MDR"].value;
    rtl.push("MAR <- MDR");
  }

  if (step == 1 || step == null) {
    file.registers["MDR"].value = memory[file.registers["MAR"].value];
    rtl.push("MDR <- MEM[MAR]");
  }

  if (step == 2 || step == null) {
    file.registers["ACC"].value ^= file.registers["MDR"].value;
    testFlags(file);
    rtl.push("ACC <- ACC ^ MDR");
  }

  return rtl;
}

// Instrução JMP
export function jmp(
  file: RegisterFile,
  _memory: number[],
  step?: number
): string[] {
  // 7	PC <- MDR

  const rtl: string[] = [];

  if (step == 0 || step == null) {
    file.registers["PC"].value = file.registers["MDR"].value;
    rtl.push("PC <- MDR");
  }

  return rtl;
}

// Instrução JZF
export function jzf(
  file: RegisterFile,
  _memory: number[],
  step?: number
): string[] {
  // 7	Se (ZF==1) PC <- MDR

  const rtl: string[] = [];

  if (step == 0 || step == null) {
    if (file.registers["PSR"].value & 0b01) {
      file.registers["PC"].value = file.registers["MDR"].value;
      rtl.push("Se (ZF==1) PC <- MDR");
    }
  }

  return rtl;
}

// Instrução JSF
export function jsf(
  file: RegisterFile,
  _memory: number[],
  step?: number
): string[] {
  // 7	Se (SF==1) PC <- MDR

  const rtl: string[] = [];

  if (step == 0 || step == null) {
    if (file.registers["PSR"].value & 0b10) {
      file.registers["PC"].value = file.registers["MDR"].value;
      rtl.push("Se (SF==1) PC <- MDR");
    }
  }

  return rtl;
}

// Instrução TST
export function tst(
  file: RegisterFile,
  _memory: number[],
  step?: number
): string[] {
  // 7	_ <- AC

  const rtl: string[] = [];

  if (step == 0 || step == null) {
    testFlags(file);
    rtl.push("_ <- AC");
  }

  return rtl;
}

// Instrução HLT
export function hlt(
  _file: RegisterFile,
  _memory: number[],
  step?: number
): string[] {
  // 7	HLT <- 1

  const rtl: string[] = [];

  if (step == 0 || step == null) {
    rtl.push("HLT <- 1");
  }

  return rtl;
}

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
