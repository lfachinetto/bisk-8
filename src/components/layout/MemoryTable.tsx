import RegisterFile from "../../models/registerFile";
import styles from "./MemoryTable.module.css";

enum Column {
  binary,
  hexa,
}

interface MemoryTableProps {
  memory: number[];
  setMemory: (memory: number[]) => void;
  file: RegisterFile;
}

function MemoryTable({ memory, setMemory, file }: MemoryTableProps) {
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

    setMemory(
      memory.map((memoryValue, index) => {
        return index === address
          ? column === Column.binary
            ? parseInt(value, 2)
            : parseInt(value, 16)
          : memoryValue;
      })
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    column: Column,
    address: number
  ) => {
    onDataTableChange(column, address, e.target.value);
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
        {memory.map((row, index) => (
          <tr
            key={"memory" + index}
            style={{
              backgroundColor:
                file.registers["PC"].value === index ? "lightblue" : undefined,
            }}
          >
            <td className={styles.addresshexa}>
              {index.toString(16).padStart(2, "0").toUpperCase()}
            </td>
            <td>
              <input
                type="text"
                value={row.toString(2).padStart(8, "0")}
                onChange={(e) => handleChange(e, Column.binary, index)}
              />
            </td>
            <td>
              <input
                type="text"
                value={row.toString(16).padStart(2, "0").toUpperCase()}
                onChange={(e) => handleChange(e, Column.hexa, index)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default MemoryTable;
