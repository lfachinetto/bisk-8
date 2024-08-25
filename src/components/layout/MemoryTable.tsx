import React, { useState } from "react";
import InstructionSet from "../../models/instructionSet";
import styles from "./MemoryTable.module.css";

interface DataTableRow {
  address: string;
  binary: string;
  hexa: string;
}

interface MemoryTableProps {
  memory: number[];
  setMemory: (memory: number[]) => void;
  isa: InstructionSet;
}

function MemoryTable({ memory, setMemory }: MemoryTableProps) {
  const initialTable = memory.map((value, index) => {
    return {
      address: index.toString(16).padStart(2, "0").toUpperCase(),
      binary: value.toString(2).padStart(8, "0"),
      hexa: value.toString(16).padStart(2, "0").toUpperCase(),
    };
  });
  const [memoryTable, setMemoryTable] = useState<DataTableRow[]>(initialTable);

  // Trata mudanças na tabela de memória
  function onDataTableChange(column: string, address: string, value: string) {
    // Valida input
    switch (column) {
      case "binary":
        if (!/^[01]/.test(value)) return;
        else if (parseInt(value, 2) > 255) return;
        break;
      case "hexa":
        if (!/^[0-9A-Fa-f]/.test(value)) return;
        else if (parseInt(value, 16) > 255) return;
        break;
    }

    const newLine = {
      address: address,
      binary:
        column === "binary"
          ? parseInt(value, 2).toString(2).padStart(8, "0")
          : parseInt(value, 16).toString(2).padStart(8, "0"),
      hexa:
        column === "hexa"
          ? parseInt(value, 16).toString(16).padStart(2, "0").toUpperCase()
          : parseInt(value, 2).toString(16).padStart(2, "0").toUpperCase(),
    };

    // Cria nova tabela de memória
    const newMemoryTable: DataTableRow[] = memoryTable.map((row) =>
      row.address === address ? newLine : row
    );

    setMemoryTable(newMemoryTable);

    setMemory(newMemoryTable.map((row) => parseInt(row.binary, 2)));
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    address: string,
    field: keyof DataTableRow
  ) => {
    onDataTableChange(field, address, e.target.value);
  };

  return (
    <table>
      <thead>
        <tr>
          <th className={styles.address}>Endereço</th>
          <th>Binário</th>
          <th>Hexadecimal</th>
        </tr>
      </thead>
      <tbody>
        {memoryTable.map((row) => (
          <tr key={row.address}>
            <td className={styles.addresshexa}>{row.address}</td>
            <td>
              <input
                type="text"
                value={row.binary}
                onChange={(e) => handleChange(e, row.address, "binary")}
              />
            </td>
            <td>
              <input
                type="text"
                value={row.hexa}
                onChange={(e) => handleChange(e, row.address, "hexa")}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default MemoryTable;
