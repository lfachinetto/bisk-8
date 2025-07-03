import * as operations from "../services/operations";
import Instruction from "./instruction";

class InstructionSet {
  instructions: { [binary: number]: Instruction };

  constructor() {
    this.instructions = {
      0b0000: new Instruction(0b0000, "NOP", false, operations.nop, "", false),
      0b0001: new Instruction(0b0001, "LDA", true, operations.lda, "ACC ← MEM[op]", false),
      0b0010: new Instruction(0b0010, "STA", true, operations.sta, "MEM[op] ← ACC", false),
      0b0011: new Instruction(0b0011, "ADD", true, operations.add, "ACC ← ACC + MEM[op]", true),
      0b0100: new Instruction(0b0100, "SUB", true, operations.sub, "ACC ← ACC - MEM[op]", true),
      0b0101: new Instruction(0b0101, "MUL", true, operations.mul, "ACC ← ACC * MEM[op]", true),
      0b0110: new Instruction(0b0110, "DIV", true, operations.div, "ACC ← ACC / MEM[op]", true),
      0b0111: new Instruction(0b0111, "NOT", false, operations.not, "ACC ← ~ACC", true),
      0b1000: new Instruction(0b1000, "AND", true, operations.and, "ACC ← ACC & MEM[op]", true),
      0b1001: new Instruction(0b1001, "OR", true, operations.or, "ACC ← ACC | MEM[op]", true),
      0b1010: new Instruction(0b1010, "XOR", true, operations.xor, "ACC ← ACC ^ MEM[op]", true),
      0b1011: new Instruction(0b1011, "JMP", true, operations.jmp, "PC ← op", false),
      0b1100: new Instruction(0b1100, "JZF", true, operations.jzf, "if ZF: PC ← op", false),
      0b1101: new Instruction(0b1101, "JSF", true, operations.jsf, "if SF: PC ← op", false),
      0b1110: new Instruction(0b1110, "TST", false, operations.tst, "ACC ← ACC", true),
      0b1111: new Instruction(0b1111, "HLT", false, operations.hlt, "Stop", false),
    };
  }

  findByMnemonic(mnemonic: string) {
    for (const key in this.instructions) {
      if (this.instructions[key].mnemonic.toLowerCase() === mnemonic.toLowerCase())
        return this.instructions[key];
    }
  }
}

export default InstructionSet;
