import Memory from "./memory";
import RegisterFile from "./registerFile";

class Instruction {
  opcode: number;
  mnemonic: string;
  requiresAddress: boolean;
  operation: ((file: RegisterFile, memory: Memory) => string)[];

  constructor(
    opcode: number,
    mnemonic: string,
    requiresAddress: boolean,
    operation: ((file: RegisterFile, memory: Memory) => string)[],
  ) {
    this.opcode = opcode;
    this.mnemonic = mnemonic;
    this.requiresAddress = requiresAddress;
    this.operation = operation;
  }

  getHexOpcode(): string {
    return this.opcode.toString(16).toUpperCase();
  }
}

export default Instruction;
