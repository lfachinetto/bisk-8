import RegisterFile from "../../models/registerFile";
import InstructionSet from "../../models/instructionSet";
import RegisterTable from "../layout/RegisterTable";
import RTLTable from "../layout/RTLTable";
import "./Simulation.module.css";

interface SimulationProps {
  registers: RegisterFile;
  isa: InstructionSet;
  rtl: string[];
}

function Simulation({ registers, isa, rtl }: SimulationProps) {
  return (
    <>
      <RegisterTable file={registers} isa={isa} />
      <br />
      <RTLTable rtlLog={rtl} />
    </>
  );
}

export default Simulation;
