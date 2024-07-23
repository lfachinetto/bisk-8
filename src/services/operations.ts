import RegisterBank from "../models/registerBank";

export function searchInstruction(
  registers: RegisterBank,
  memory: number[],
  step?: number
): string[] {
  // 0	MAR <- PC
  // 1	MDR <- MEM[MAR]
  // 2	PC <- PC + 1
  // 3	IR <- MDR

  const rtl: string[] = [];

  if (step == 0 || step == null) {
    registers.findByName("MAR")!.value = registers.findByName("PC")!.value;
    rtl.push("MAR <- PC");
  }

  if (step == 1 || step == null) {
    registers.findByName("MDR")!.value =
      memory[registers.findByName("MAR")!.value];
    rtl.push("MDR <- MEM[MAR]");
  }

  if (step == 2 || step == null) {
    registers.findByName("PC")!.value += 1;
    rtl.push("PC <- PC + 1");
  }

  if (step == 3 || step == null) {
    registers.findByName("IR")!.value = registers.findByName("MDR")!.value;
    rtl.push("IR <- MDR");
  }

  return rtl;
}

export function searchAddress(
  registers: RegisterBank,
  memory: number[],
  step?: number
): string[] {
  // 4	MAR <- PC
  // 5	MDR <- MEM[MAR]
  // 6	PC <- PC + 1
  const rtl: string[] = [];

  if (step == 0 || step == null) {
    registers.findByName("MAR")!.value = registers.findByName("PC")!.value;
    rtl.push("MAR <- PC");
  }

  if (step == 1 || step == null) {
    registers.findByName("MDR")!.value =
      memory[registers.findByName("MAR")!.value];
    rtl.push("MDR <- MEM[MAR]");
  }

  if (step == 2 || step == null) {
    registers.findByName("PC")!.value += 1;
    rtl.push("PC <- PC + 1");
  }

  return rtl;
}

export function add(
  registers: RegisterBank,
  memory: number[],
  step?: number
): string[] {
  // 7	MAR <- MDR
  // 8	MDR <- MEM[MAR]
  // 9	ACC <- ACC & MDR
  const rtl: string[] = [];

  if (step == 0 || step == null) {
    registers.findByName("MAR")!.value = registers.findByName("MDR")!.value;
    rtl.push("MAR <- MDR");
  }

  if (step == 1 || step == null) {
    registers.findByName("MDR")!.value =
      memory[registers.findByName("MAR")!.value];
    rtl.push("MDR <- MEM[MAR]");
  }

  if (step == 2 || step == null) {
    console.log(registers.findByName("ACC")!.value);
    registers.findByName("ACC")!.value += registers.findByName("MDR")!.value;

    console.log(registers.findByName("ACC")!.value);
    rtl.push("ACC <- ACC + MDR");
  }

  return rtl;
}
