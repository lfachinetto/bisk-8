import RegisterFile from "../../models/registerFile";
import InstructionSet from "../../models/instructionSet";
import RegisterTable from "../layout/simulation/RegisterTable";
import LogTable from "../layout/simulation/LogTable";

interface SimulationProps {
  registers: RegisterFile;
  isa: InstructionSet;
  rtl: string[];
}

function Simulation({ registers, isa, rtl }: SimulationProps) {
  return (
    <>
      <h3>Simulação</h3>
      <RegisterTable file={registers} isa={isa} />
      <LogTable rtlLog={rtl} />
    </>
  );
}

export default Simulation;
