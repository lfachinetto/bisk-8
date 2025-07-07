import ISATable from "../layout/ISA/ISATable";
import InstructionSet from "../../models/instructionSet";

interface ISAProps {
  isa: InstructionSet;
  field: number | undefined;
}

function ISA({ isa, field }: ISAProps) {
  return (
    <>
      <div style={{ "height": "35px", "backgroundColor": "lightgray" }}></div>
      <h3>Conjunto de Instruções</h3>
      <ISATable isa={isa} field={0} />
    </>
  );
}

export default ISA;
