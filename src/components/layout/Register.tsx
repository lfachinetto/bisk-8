import React from "react";
import "./Register.module.css";
import InstructionSet from "../../models/instructionSet";

interface RegisterProps {
  name: string;
  value: number;
  isa: InstructionSet;
}

function Register({ name, value, isa }: RegisterProps) {
  return (
    <div className="table-container">
      <table className="custom-table">
        <tbody>
          <tr>
            <td className="label-cell">{name}</td>
            <td className="value-cell">
              {name === "IR"
                ? isa.instructions[value].mnemonic
                : value.toString(16).padStart(2, "0").toUpperCase()}
            </td>
          </tr>
          {name !== "PSR" ? (
            <tr>
              <td colSpan={2} className="large-cell">
                {value.toString(2).padStart(8, "0")}
              </td>

              {/* { {name === "PSR" ? (
              <td colSpan={2} className="large-cell">
                {value.toString(2).padStart(8, "0")}
              </td>
            ) : null} } */}
            </tr>
          ) : (
            <>
              <tr>
                <td>Sinal</td>
                <td>{value & 0b10 ? 1 : 0}</td>
              </tr>
              <tr>
                <td>Zero</td>
                <td>{value & 0b01 ? 1 : 0}</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Register;
//
