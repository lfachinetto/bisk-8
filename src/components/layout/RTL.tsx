import React from "react";

interface RTLProps {
  strings: string[];
}

function Rtl({ strings }: RTLProps) {
  return (
    <div>
      <center><h3> Ciclo de busca da instrução</h3></center>
      <br />
      {strings.map((string) => (
        <center>{string}</center>
      ))}
    </div>
  );
}

export default Rtl;
