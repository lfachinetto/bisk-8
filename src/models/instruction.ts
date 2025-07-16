import Memory from "./memory";
import RegisterFile from "./registerFile";

class Instruction {
  opcode: number;
  mnemonic: string;
  requiresAddress: boolean;
  operation: ((file: RegisterFile, memory: Memory) => string)[];
  operationDescr: string;
  affectFlags: boolean;

  constructor(
    opcode: number,
    mnemonic: string,
    requiresAddress: boolean,
    operation: ((file: RegisterFile, memory: Memory) => string)[],
    operationDescr: string,
    affectFlags: boolean
  ) {
    this.opcode = opcode;
    this.mnemonic = mnemonic;
    this.requiresAddress = requiresAddress;
    this.operation = operation;
    this.operationDescr = operationDescr;
    this.affectFlags = affectFlags;
  }

  getHexOpcode(): string {
    return this.opcode.toString(16).toUpperCase().padStart(2, "0");
  }

  getBinOpcode(): string {
    return this.opcode.toString(16).toUpperCase().padStart(8, "0");
  }
}

export default Instruction;
