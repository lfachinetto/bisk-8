import React, { useState } from "react";
import InstructionSet from "../../models/instructionSet";
import styles from "./DataSegmentTable.module.css";

interface DataTableRow {
  address: string;
  binary: string;
  hexa: string;
}

interface DataSegmentTableProps {
  memory: number[];
  setMemory: (memory: number[]) => void;
  isa: InstructionSet;
}

function DataSegmentTable({ memory, setMemory, isa }: DataSegmentTableProps) {
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editField, setEditField] = useState<keyof DataTableRow | null>(null);

  const initialTable = memory.map((value, index) => {
    return {
      address: (index + 128).toString(16).padStart(2, "0").toUpperCase(),
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

  const handleCellClick = (idx: number, field: keyof DataTableRow) => {
    setEditIdx(idx);
    setEditField(field);
  };

  const handleBlur = () => {
    setEditIdx(null);
    setEditField(null);
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
        {memoryTable.map((row, idx) => (
          <tr key={row.address}>
            <td className={styles.addresshexa}>{row.address}</td>
            <td onClick={() => handleCellClick(idx, "binary")}>
              {editIdx === idx && editField === "binary" ? (
                <input
                  type="text"
                  value={row.binary}
                  onChange={(e) => handleChange(e, row.address, "binary")}
                  onBlur={handleBlur}
                  autoFocus
                />
              ) : (
                row.binary
              )}
            </td>
            <td onClick={() => handleCellClick(idx, "hexa")}>
              {editIdx === idx && editField === "hexa" ? (
                <input
                  type="text"
                  value={row.hexa}
                  onChange={(e) => handleChange(e, row.address, "hexa")}
                  onBlur={handleBlur}
                  autoFocus
                />
              ) : (
                row.hexa
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataSegmentTable;
