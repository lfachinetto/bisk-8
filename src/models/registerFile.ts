import Register from "./register";

class RegisterFile {
  registers: { [name: string]: Register };

  constructor() {
    this.registers = {
      "MAR": new Register("MAR", 8, 0b0),
      "PC": new Register("PC", 8, 0b0),
      "MDR": new Register("MDR", 8, 0b0),
      "IR": new Register("IR", 8, 0b0),
      "ACC": new Register("ACC", 8, 0b0),
      "PSR": new Register("PSR", 2, 0b0),
      "HALT": new Register("HALT", 1, 0b0),
    };
  }

  clear() {
    for (const register in this.registers) {
      this.registers[register].value = 0b0;
    }
  }
}

export default RegisterFile;
