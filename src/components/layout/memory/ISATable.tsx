import { useEffect, useRef } from "react";
import InstructionSet from "../../../models/instructionSet";
import styles from "./ISATable.module.css";

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
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Mnemônico</th>
              <th>Binário</th>
              <th>Hexa</th>
              <th>Endereço?</th>
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
