import * as operations from '../services/operations';
import Instruction from './instruction';

class InstructionSet {
  instructions: Instruction[];

  constructor() {
    this.instructions = [
      new Instruction(0b0000, 'NOP', false),
      new Instruction(0b0001, 'LDA', true),
      new Instruction(0b0010, 'STA', true),
      new Instruction(0b0011, 'ADD', true, operations.add),
      new Instruction(0b0100, 'SUB', true),
      new Instruction(0b0101, 'MUL', true),
      new Instruction(0b0110, 'DIV', true),
      new Instruction(0b0111, 'NOT', false),
      new Instruction(0b1000, 'AND', true),
      new Instruction(0b1001, 'OR', true),
      new Instruction(0b1010, 'XOR', true),
      new Instruction(0b1011, 'JMP', true),
      new Instruction(0b1100, 'JZF', false),
      new Instruction(0b1101, 'JSF', false),
      new Instruction(0b1110, 'TST', false),
      new Instruction(0b1111, 'HLT', false),
    ];
  }

  findByMnemonic(mnemonic: string) {
    return this.instructions.find((instruction) => instruction.mnemonic.toLowerCase() === mnemonic.toLowerCase());
  }

  findByOpcode(opcode: number) {
    return this.instructions.find((instruction) => instruction.opcode === opcode);
  }
}

export default InstructionSet;
