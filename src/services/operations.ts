import RegisterFile from "../models/registerFile";

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
    file.registers["MDR"].value =
      memory[file.registers["MAR"].value];
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
   file.registers["MDR"].value =
      memory[file.registers["MAR"].value];
    rtl.push("MDR <- MEM[MAR]");
  }

  if (step == 2 || step == null) {
    file.registers["PC"].value += 1;
    rtl.push("PC <- PC + 1");
  }

  return rtl;
}

export function add(
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
    file.registers["MDR"].value =
      memory[file.registers["MAR"].value];
    rtl.push("MDR <- MEM[MAR]");
  }

  if (step == 2 || step == null) {
    console.log(file.registers["ACC"].value);
    file.registers["ACC"].value += file.registers["MDR"].value;

    console.log(file.registers["ACC"]!.value);
    rtl.push("ACC <- ACC + MDR");
  }

  return rtl;
}
