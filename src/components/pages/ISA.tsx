import ISATable from "../layout/ISA/ISATable";
import InstructionSet from "../../models/instructionSet";

interface ISAProps {
  isa: InstructionSet;
  field: number | undefined;
}

function ISA({ isa, field }: ISAProps) {
  return (
    <ISATable isa={isa} field={0} />
  );
}

export default ISA;
