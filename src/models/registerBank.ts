import Register from "./register";

class RegisterBank {
  registers: Register[];
  
  constructor() {
    this.registers = [
      new Register("PC", 8, 0b0),
      new Register("MAR", 8, 0b0),
      new Register("MDR", 8, 0b0),
      new Register("IR", 8, 0b0),
      new Register("ACC", 8, 0b0),
      new Register("PSR", 2, 0b0),
    ];
  }

  findByName(name: string) {
    return this.registers.find((register) => register.name === name);
  }

  clear() {
    this.registers.forEach((register) => (register.value = 0b0));
  }
}

export default RegisterBank;