import styles from "./RegisterTable.module.css";
import RegisterFile from "../../../models/registerFile";
import InstructionSet from "../../../models/instructionSet";
import Register from "../../../models/register";

interface RegisterTableProps {
  file: RegisterFile;
  isa: InstructionSet;
}

function RegisterTable({ file, isa }: RegisterTableProps) {
  function registerText(register: Register): string {
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

    return (register.value & 0xff)
      .toString(16)
      .padStart(Math.ceil(register.bitLength / 4), "0")
      .toUpperCase();
  }

  return (
    <div className={styles.tableContainer}>
      <table>
        <thead>
          <tr>
            <th>Registrador</th>
            <th>Binário</th>
            <th>Hexa</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(file.registers).map((registerName, i) => {
            const register = file.registers[registerName];
            return (
              <tr key={i}>
                <td>{register.name}</td>
                <td className={styles.right}>
                  {(register.value & 0xff)
                    .toString(2)
                    .padStart(register.bitLength, "0")
                    .toUpperCase()}
                </td>
                <td>{registerText(register)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default RegisterTable;
