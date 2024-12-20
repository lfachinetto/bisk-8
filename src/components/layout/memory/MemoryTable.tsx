import { useEffect, useRef } from "react";
import RegisterFile from "../../../models/registerFile";
import styles from "./MemoryTable.module.css";
import Memory from "../../../models/memory";

enum Column {
  binary,
  hexa,
}

interface MemoryTableProps {
  memory: Memory;
  setMemory: (memory: Memory) => void;
  file: RegisterFile;
  setCurrentField: React.Dispatch<React.SetStateAction<number | undefined>>;
  height?: string;
}

function MemoryTable({
  memory,
  setMemory,
  file,
  setCurrentField,
  height,
}: MemoryTableProps) {
  // Trata mudanças na tabela de memória
  function onDataTableChange(column: Column, address: number, value: string) {
    // Valida input
    switch (column) {
      case Column.binary:
        if (!/^[01]/.test(value)) return;
        else if (parseInt(value, 2) > 255) return;
        break;
      case Column.hexa:
        if (!/^[0-9A-Fa-f]/.test(value)) return;
        else if (parseInt(value, 16) > 255) return;
        break;
    }

    memory.data = memory.data.map((memoryValue, index) => {
      return index === address
        ? column === Column.binary
          ? parseInt(value, 2)
          : parseInt(value, 16)
        : memoryValue;
    });

    setMemory(memory);

    // Atualiza campo atual
    setCurrentField(
      column === Column.binary ? parseInt(value, 2) : parseInt(value, 16)
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    column: Column,
    address: number
  ) => {
    onDataTableChange(column, address, e.target.value);
  };

  const currentRowRef = useRef<HTMLTableRowElement>(null);

  const scrollToRow = () => {
    if (currentRowRef.current) {
      currentRowRef.current.scrollIntoView({
        behavior: "instant",
        block: "nearest",
      });
    }
  };

  useEffect(() => {
    scrollToRow();
  }, [file]);

  return (
    <>
      <div className={styles.tableContainer} style={{ height: `${height}vh` }}>
        <table>
          <thead>
            <tr>
              <th className={styles.address}>Endereço</th>
              <th>Binário</th>
              <th>Hexadecimal</th>
            </tr>
          </thead>
          <tbody>
            {memory.data.map((row, index) => (
              <tr
                ref={
                  index === file.registers["PC"].value ? currentRowRef : null
                }
                key={"memory" + index}
                style={{
                  backgroundColor:
                    file.registers["PC"].value === index
                      ? "lightblue"
                      : undefined,
                }}
              >
                <td className={styles.addresshexa}>
                  {index.toString(16).padStart(2, "0").toUpperCase()}
                </td>
                <td>
                  <input
                    className={styles.input}
                    type="text"
                    value={row.toString(2).padStart(8, "0")}
                    onChange={(e) => handleChange(e, Column.binary, index)}
                    onBlur={() => setCurrentField(undefined)}
                    onFocus={() => setCurrentField(row)}
                  />
                </td>
                <td>
                  <input
                    className={styles.input}
                    type="text"
                    value={row.toString(16).padStart(2, "0").toUpperCase()}
                    onChange={(e) => handleChange(e, Column.hexa, index)}
                    onBlur={() => setCurrentField(undefined)}
                    onFocus={() => setCurrentField(row)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default MemoryTable;
