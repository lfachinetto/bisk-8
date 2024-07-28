import React, { useState } from "react";
import styles from "./CodeSegmentTable.module.css";
import InstructionSet from "../../models/instructionSet";

interface MemoryTableRow {
  address: string;
  binary: string;
  hexa: string;
  mnemonic?: string;
  valid: boolean;
  isAddress: boolean;
}

interface CodeSegmentTableProps {
  memory: number[];
  setMemory: (memory: number[]) => void;
  isa: InstructionSet;
}

function CodeSegmentTable({ memory, setMemory, isa }: CodeSegmentTableProps) {
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editField, setEditField] = useState<keyof MemoryTableRow | null>(null);

  const initialTable = memory.map((value, index) => {
    return {
      address: index.toString(16).toUpperCase().padStart(2, "0"),
      binary: value.toString(2).padStart(8, "0"),
      hexa: value.toString(16).padStart(2, "0").toUpperCase(),
      mnemonic: isa.findByOpcode(value)?.mnemonic,
      valid: true,
      isAddress: false,
    };
  });
  const [memoryTable, setMemoryTable] =
    useState<MemoryTableRow[]>(initialTable);

  // Validate input
  function validateInput(column: string, value: string) {
    switch (column) {
      case "binary":
        return /^[01]/.test(value);
      case "hexa":
        return /^[0-9A-Fa-f]/.test(value);
      case "mnemonic":
        return /^[a-zA-Z]/.test(value);
    }
  }

  // Trata mudanças na tabela de memória
  function onMemoryTableChange(column: string, address: string, value: string) {
    // Valida input
    // if (!validateInput(column, value)) {
    //   return;
    // }

    // Testa se é endereço
    let isAddress = false;
    if (
      !memoryTable[parseInt(address, 16) - 1]?.isAddress &&
      isa.findByOpcode(memory[parseInt(address, 16) - 1])?.requiresAddress
    ) {
      isAddress = true;
    }

    // Valida input
    switch (column) {
      case "binary":
        if (!/^[01]/.test(value)) return;
        else if (!isAddress && parseInt(value, 2) > 15) return;
        else if (isAddress && parseInt(value, 2) > 255) return;
        break;
      case "hexa":
        if (!/^[0-9A-Fa-f]/.test(value)) return;
        else if (!isAddress && parseInt(value, 16) > 15) return;
        else if (isAddress && parseInt(value, 16) > 255) return;
        break;
      case "mnemonic":
        if (!/^[a-zA-Z]/.test(value)) return;
        break;
    }

    // Valida mnemônico
    let mnmemonic = null;
    switch (column) {
      case "binary":
        if (isa.findByOpcode(parseInt(value, 2)) !== undefined) {
          mnmemonic = isa.findByOpcode(parseInt(value, 2))!.mnemonic;
        }
        break;
      case "hexa":
        if (isa.findByOpcode(parseInt(value, 16)) !== undefined) {
          mnmemonic = isa.findByOpcode(parseInt(value, 16))!.mnemonic;
        }
        break;
      case "mnemonic":
        if (isa.findByMnemonic(value) !== undefined) {
          mnmemonic = value;
        }
        break;
    }

    let newLine;
    if (isAddress) {
      newLine = {
        address: address,
        binary:
          column === "binary"
            ? parseInt(value, 2).toString(2).padStart(8, "0")
            : parseInt(value, 16).toString(2).padStart(8, "0"),
        hexa:
          column === "hexa"
            ? parseInt(value, 16).toString(16).padStart(2, "0").toUpperCase()
            : parseInt(value, 2).toString(16).padStart(2, "0").toUpperCase(),
        valid: true,
        isAddress: true,
      };
      // Se identificou mnemônico na edição preenche linha conforme instrução
    } else if (mnmemonic !== null) {
      newLine = {
        address: address,
        binary: isa
          .findByMnemonic(mnmemonic)!
          .opcode.toString(2)
          .padStart(8, "0"),
        hexa: isa
          .findByMnemonic(mnmemonic)!
          .opcode.toString(16)
          .padStart(2, "0")
          .toUpperCase(),
        mnemonic: mnmemonic.toUpperCase(),
        valid: true,
        isAddress: false,
      };
    }
    // Se não pega valor anterior exceto se estiver editando esse campo
    else {
      newLine = {
        address: address,
        binary:
          column === "binary"
            ? value
            : memoryTable[parseInt(address, 16)].binary,
        hexa:
          column === "hexa" ? value : memoryTable[parseInt(address, 16)].hexa,
        mnemonic:
          column === "mnemonic"
            ? value
            : memoryTable[parseInt(address, 16)].mnemonic,
        valid: false,
        isAddress: false,
      };
    }

    // Cria nova tabela de memória
    const newMemoryTable: MemoryTableRow[] = memoryTable.map((row) =>
      row.address === address ? newLine : row
    );

    // Determina campos de endereço
    let nextIsAddress = false;
    for (let i = 0; i < newMemoryTable.length; i++) {
      if (nextIsAddress) {
        newMemoryTable[i].isAddress = true;
        nextIsAddress = false;
      } else if (
        newMemoryTable[i].mnemonic != undefined &&
        isa.findByMnemonic(newMemoryTable[i].mnemonic!)?.requiresAddress
      ) {
        nextIsAddress = true;
        newMemoryTable[i].isAddress = false;
      } else {
        newMemoryTable[i].isAddress = false;
      }
    }

    setMemoryTable(newMemoryTable);

    // Atualiza memória se instrução válida ou endereço
    if (mnmemonic !== null || isAddress) {
      setMemory(newMemoryTable.map((row) => parseInt(row.binary, 2)));
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    address: string,
    field: keyof MemoryTableRow
  ) => {
    onMemoryTableChange(field, address, e.target.value);
  };

  const handleCellClick = (idx: number, field: keyof MemoryTableRow) => {
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
          <th>Mnemônico</th>
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
            <td
              className={row.isAddress ? styles.addressrow : ""}
              onClick={() => handleCellClick(idx, "mnemonic")}
            >
              {row.isAddress ? (
                "endereço"
              ) : editIdx === idx && editField === "mnemonic" ? (
                <input
                  type="text"
                  value={row.mnemonic}
                  onChange={(e) => handleChange(e, row.address, "mnemonic")}
                  onBlur={handleBlur}
                  maxLength={3}
                  autoFocus
                />
              ) : (
                row.mnemonic
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CodeSegmentTable;
