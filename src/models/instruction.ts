import RegisterBank from "./register_bank";

class Instruction {
    opcode: number;
    mnemonic: string;
    requiresAddress: boolean;  
    operation?: (registers: RegisterBank, memory: number[], step?: number) => string[];

    constructor(opcode: number, mnemonic: string, requiresAddress: boolean, operation?: (registers: RegisterBank, memory: number[], step?: number) => string[]) {
        this.opcode = opcode;
        this.mnemonic = mnemonic;
        this.requiresAddress = requiresAddress;
        this.operation = operation;
    }
    
    getHexaOpcode() {
        return this.opcode.toString(16).toUpperCase();
    }
}

export default Instruction;