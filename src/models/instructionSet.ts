import * as operations from "../services/operations";
import Instruction from "./instruction";

class InstructionSet {
  instructions: { [binary: number]: Instruction };

  constructor() {
    this.instructions = {
      0b0000: new Instruction(0b0000, "NOP", false),
      0b0001: new Instruction(0b0001, "LDA", true),
      0b0010: new Instruction(0b0010, "STA", true),
      0b0011: new Instruction(0b0011, "ADD", true, operations.add),
      0b0100: new Instruction(0b0100, "SUB", true),
      0b0101: new Instruction(0b0101, "MUL", true),
      0b0110: new Instruction(0b0110, "DIV", true),
      0b0111: new Instruction(0b0111, "NOT", false),
      0b1000: new Instruction(0b1000, "AND", true),
      0b1001: new Instruction(0b1001, "OR", true),
      0b1010: new Instruction(0b1010, "XOR", true),
      0b1011: new Instruction(0b1011, "JMP", true),
      0b1100: new Instruction(0b1100, "JZF", false),
      0b1101: new Instruction(0b1101, "JSF", false),
      0b1110: new Instruction(0b1110, "TST", false),
      0b1111: new Instruction(0b1111, "HLT", false),
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
