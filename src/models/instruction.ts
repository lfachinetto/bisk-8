import RegisterFile from "./registerFile";

class Instruction {
  opcode: number;
  mnemonic: string;
  requiresAddress: boolean;
  operation?: (
    registers: RegisterFile,
    memory: number[],
    step?: number
  ) => string[];

  constructor(
    opcode: number,
    mnemonic: string,
    requiresAddress: boolean,
    operation?: (
      registers: RegisterFile,
      memory: number[],
      step?: number
    ) => string[]
  ) {
    this.opcode = opcode;
    this.mnemonic = mnemonic;
    this.requiresAddress = requiresAddress;
    this.operation = operation;
  }

  getHexaOpcode(): string {
    return this.opcode.toString(16).toUpperCase();
  }
}

export default Instruction;
