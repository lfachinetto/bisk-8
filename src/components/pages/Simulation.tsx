// import styles from "./Simulation.module.css";
import React from "react";
import Register from "../layout/Register";
import RegisterFile from "../../models/registerFile";
import InstructionSet from "../../models/instructionSet";
import RTL from "../layout/RTL";

interface SimulationProps {
  registers: RegisterFile;
  isa: InstructionSet;
  rtl: string[];
}

function Simulation({ registers, isa, rtl }: SimulationProps) {
  return (
    <>
      {Object.entries(registers.registers).map(([name, value]) => (
        <Register key={name} name={name} value={value.value} isa={isa} />
      ))}
      <RTL strings={rtl} />
    </>
  );
}

export default Simulation;
