import InstructionSet from "../../../models/instructionSet";
import styles from "./ISATable.module.css";

interface ISATableProps {
  isa: InstructionSet;
  field: number | undefined;
}

function ISATable({ isa, field }: ISATableProps) {
  return (
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Mnemônico</th>
              <th>Binário</th>
              <th>Hexadecimal</th>
              <th>Endereço?</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(isa.instructions).map((_, i) => {
              const instruction = isa.instructions[i];

              return (
                <tr
                  key={i}
                  style={{
                    color:
                      field !== undefined &&
                      (field & 0x0f) === instruction.opcode
                        ? "blue"
                        : undefined,
                  }}
                >
                  <td>{instruction.mnemonic}</td>
                  <td>
                    {instruction.opcode
                      .toString(2)
                      .padStart(8, "0")
                      .toUpperCase()}
                  </td>
                  <td>{instruction.getHexaOpcode().padStart(2, "0")}</td>
                  <td>{instruction.requiresAddress ? "Sim" : "Não"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
  );
}

export default ISATable;