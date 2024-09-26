import RegisterFile from "../../models/registerFile";
import InstructionSet from "../../models/instructionSet";
import RegisterTable from "../layout/simulation/RegisterTable";
import RTLTable from "../layout/simulation/RTLTable";

interface SimulationProps {
  registers: RegisterFile;
  isa: InstructionSet;
  rtl: string[];
}

function Simulation({ registers, isa, rtl }: SimulationProps) {
  return (
    <>
      <h2>Simulação</h2>
      <RegisterTable file={registers} isa={isa} />
      <br />
      {rtl.length > 0 ? <h3>Log de execução</h3> : ""}
      <br />
      <RTLTable rtlLog={rtl} />
    </>
  );
}

export default Simulation;
