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
  steps: number;

  constructor(
    opcode: number,
    mnemonic: string,
    requiresAddress: boolean,
    operation: (
      registers: RegisterFile,
      memory: number[],
      step?: number
    ) => string[],
    steps: number
  ) {
    this.opcode = opcode;
    this.mnemonic = mnemonic;
    this.requiresAddress = requiresAddress;
    this.operation = operation;
    this.steps = steps;
  }

  getHexaOpcode(): string {
    return this.opcode.toString(16).toUpperCase();
  }
}

export default Instruction;
