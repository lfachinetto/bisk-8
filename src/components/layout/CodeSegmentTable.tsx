import React, { useState } from "react";
import styles from "./CodeSegmentTable.module.css";
import InstructionSet from "../../models/instructionSet";

interface MemoryTableRow {
  address: number;
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
      address: index,
      binary: value.toString(2).padStart(8, "0"),
      hexa: value.toString(16).padStart(2, "0").toUpperCase(),
      mnemonic: isa.findByOpcode(value)?.mnemonic,
      valid: true,
      isAddress: false,
    };
  });
  const [memoryTable, setMemoryTable] =
    useState<MemoryTableRow[]>(initialTable);

  // Trata mudanças na tabela de memória
  function onMemoryTableChange(column: string, address: number, value: string) {
    // Testa se é endereço
    let isAddress = false;
    if (
      memoryTable[address - 1]?.mnemonic != "endereço" &&
      isa.findByOpcode(memory[address - 1])?.requiresAddress
    ) {
      isAddress = true;
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
    // Se é endereço pega valor anterior exceto se estiver editando esse campo
    if (isAddress) {
      newLine = {
        address: address,
        binary: column === "binary" ? value : memoryTable[address].binary,
        hexa: column === "hexa" ? value : memoryTable[address].hexa,
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
        binary: column === "binary" ? value : memoryTable[address].binary,
        hexa: column === "hexa" ? value : memoryTable[address].hexa,
        mnemonic: column === "mnemonic" ? value : memoryTable[address].mnemonic,
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
        isa.findByMnemonic(newMemoryTable[i].mnemonic ?? "")?.requiresAddress
      ) {
        nextIsAddress = true;
        newMemoryTable[i].isAddress = false;
      } else {
        newMemoryTable[i].isAddress = false;
      }
    }
    console.log("aaa");

    setMemoryTable(newMemoryTable);

    // Atualiza memória se instrução válida ou endereço
    if (mnmemonic !== null || isAddress) {
      setMemory(newMemoryTable.map((row) => parseInt(row.binary, 2)));
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    address: number,
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
          <th>Endereço</th>
          <th>Binário</th>
          <th>Hexadecimal</th>
          <th>Mnemônico</th>
        </tr>
      </thead>
      <tbody>
        {memoryTable.map((row, idx) => (
          <tr
            className={!row.valid ? styles.invalid : undefined}
            key={row.address}
          >
            <td onClick={() => handleCellClick(idx, "address")}>
              {editIdx === idx && editField === "address" ? (
                <input
                  type="text"
                  value={row.address}
                  onChange={(e) => handleChange(e, row.address, "address")}
                  onBlur={handleBlur}
                  autoFocus
                />
              ) : (
                row.address
              )}
            </td>
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
            <td onClick={() => handleCellClick(idx, "mnemonic")}>
              {row.isAddress ? (
                "endereço"
              ) : editIdx === idx && editField === "mnemonic" ? (
                <input
                  type="text"
                  value={row.mnemonic}
                  onChange={(e) => handleChange(e, row.address, "mnemonic")}
                  onBlur={handleBlur}
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
