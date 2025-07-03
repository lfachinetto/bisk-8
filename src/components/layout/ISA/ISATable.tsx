import { useEffect, useRef } from "react";
import sharedStyles from "../../shared.module.css"
import InstructionSet from "../../../models/instructionSet";

interface ISATableProps {
  isa: InstructionSet;
  field: number | undefined;
}

function ISATable({ isa, field }: ISATableProps) {
  const isaRef = useRef<HTMLTableRowElement>(null);

  const scrollToPos = () => {
    if (isaRef.current) {
      isaRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  useEffect(() => {
    scrollToPos();
  }, [field]);

  return (
    <div className={sharedStyles.tableContainer}>
      <table>
        <thead>
          <tr>
            <th>Instr</th>
            <th>Bin</th>
            <th>Hex</th>
            <th>Operação</th>
            <th>🚩</th>
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
                style={{
                  color:
                    isCurrent
                      ? "blue"
                      : undefined,
                }}
              >
                <td className={sharedStyles.left}>{instruction.mnemonic + (instruction.requiresAddress ? " op" : "")}</td>
                <td>
                  {instruction.opcode
                    .toString(2)
                    .padStart(8, "0")
                    .toUpperCase()}
                </td>
                <td>{instruction.getHexOpcode()}</td>
                {/* <td>{instruction.requiresAddress ? "✓" : ""}</td> */}
                <td className={sharedStyles.left}>{instruction.operationDescr}</td>
                <td>{instruction.affectFlags ? "✔" : ""}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ISATable;
