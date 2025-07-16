import { useEffect, useRef } from "react";
import sharedStyles from "../../shared.module.css"
import styles from "./ISATable.module.css"
import InstructionSet from "../../../models/instructionSet";

interface ISATableProps {
  isa: InstructionSet;
  field: number | undefined;
}

function ISATable({ isa, field }: ISATableProps) {
  const isaRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    isaRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [field]);

  return (
    <table className={styles.ISAtable}>
      <caption>
        Conjunto de Instruções
      </caption>
      <thead>
        <tr>
          <th>Instr</th>
          <th>Bin</th>
          <th>Hex</th>
          <th>🚩</th>
          <th className={sharedStyles.left}>Operação</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(isa.instructions).map((_, i) => {
          const instruction = isa.instructions[i];
          const isCurrent = field !== undefined && (field & 0x0f) === instruction.opcode;

          return (
            <tr
              key={i}
              ref={isCurrent ? isaRef : undefined}
            // style={{ color: isCurrent ? "blue" : undefined }}
            >
              <td className={sharedStyles.left}>{instruction.mnemonic + (instruction.requiresAddress ? " op" : "")}</td>
              <td>{instruction.getBinOpcode()}</td>
              <td>{instruction.getHexOpcode()}</td>
              <td>{instruction.affectFlags ? "✔" : ""}</td>
              <td className={sharedStyles.left}>{instruction.operationDescr}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ISATable;
