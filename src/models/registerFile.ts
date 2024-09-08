import Register from "./register";

class RegisterFile {
  registers: { [name: string]: Register };

  constructor() {
    this.registers = {
      IR: new Register("IR", 4, 0b0),
      PC: new Register("PC", 8, 0b0),
      MAR: new Register("MAR", 8, 0b0),
      MDR: new Register("MDR", 8, 0b0),
      ACC: new Register("ACC", 8, 0b0),
      PSR: new Register("PSR", 2, 0b0),
      HLT: new Register("HLT", 1, 0b0),
    };
  }

  clear() {
    for (const register in this.registers) {
      this.registers[register].value = 0b0;
    }
  }

  clone(): RegisterFile {
    const newRegisterFile = new RegisterFile();

    for (const registerName in this.registers) {
      const originalRegister = this.registers[registerName];

      newRegisterFile.registers[registerName] = new Register(
        originalRegister.name,
        originalRegister.bitLength,
        originalRegister.value
      );
    }

    return newRegisterFile;
  }
}

export default RegisterFile;
