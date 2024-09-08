import "./RegisterTable.module.css";
import RegisterFile from "../../models/registerFile";
import InstructionSet from "../../models/instructionSet";

interface RegisterTableProps {
  file: RegisterFile;
  isa: InstructionSet;
}

function RegisterTable({ file, isa }: RegisterTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Registrador</th>
          <th>Binário</th>
          <th>Hexadecimal</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(file.registers).map((registerName) => {
          const register = file.registers[registerName];
          return (
            <tr key={Math.random()}>
              <td>{register.name}</td>
              <td>
                {register.value
                  .toString(2)
                  .padStart(register.bitLength, "0")
                  .toUpperCase()}
              </td>
              <td>
                {(() => {
                  if (register.name == "IR") {
                    const instruction = isa.instructions[register.value];
                    return instruction.mnemonic;
                  }

                  if (register.name === "HLT") {
                    return (
                      "Halted " +
                      (register.value === 1
                        ? String.fromCodePoint(0x1f7e2)
                        : String.fromCodePoint(0x1f534))
                    );
                  }

                  if (register.name === "PSR") {
                    const sinal =
                      register.value & 0b10
                        ? String.fromCodePoint(0x1f7e2)
                        : String.fromCodePoint(0x1f534);

                    const zero =
                      register.value & 0b01
                        ? String.fromCodePoint(0x1f7e2)
                        : String.fromCodePoint(0x1f534);

                    return `Sinal ${sinal} Zero ${zero}`;
                  }

                  return register.value
                    .toString(16)
                    .padStart(Math.ceil(register.bitLength / 4), "0")
                    .toUpperCase();
                })()}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default RegisterTable;
