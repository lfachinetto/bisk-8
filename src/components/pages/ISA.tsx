import { useEffect, useRef } from "react";
import InstructionSet from "../../models/instructionSet";
//import styles from "./ISATable.module.css";

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
    <div>
      <div style={{ "height": "35px",  "backgroundColor": "lightgray"}}></div>
      <h3>ISA</h3>
      <table>
        <thead>
          <tr>
            <th>Instr</th>
            <th>Bin</th>
            <th>Hex</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(isa.instructions).map((_, i) => {
            const instruction = isa.instructions[i];
            const isCurrent = field !== undefined && (field & 0x0f) === instruction.opcode;

            return (
              <tr
                key={i}
                // ref={isCurrent ? isaRef : undefined}
                // style={{
                //   color:
                //     isCurrent
                //       ? "blue"
                //       : undefined,
                // }}
              >
                <td>{instruction.mnemonic + (instruction.requiresAddress ? " op" : "")}</td>
                <td>
                  {instruction.opcode
                    .toString(2)
                    .padStart(8, "0")
                    .toUpperCase()}
                </td>
                <td>{instruction.getHexOpcode().padStart(2, "0")}</td>
                {/* <td>{instruction.requiresAddress ? "✓" : ""}</td> */}
                 <td>ACC ← ACC + MEM[op]</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ISATable;
