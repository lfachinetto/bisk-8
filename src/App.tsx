import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import RegisterBank from './models/register_bank';
import InstructionSet from './models/instruction_set';

function App() {
  const [count, setCount] = useState(0);
  
  const registers = new RegisterBank();
  const isa = new InstructionSet();
  const memory = new Array(256).fill(0);

  const rtl = isa.findByMnemonic('add')!.operation!(registers, memory);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test
          {rtl.map((line) => (
            <p>{line}</p>
          ))}
          {registers.registers.map((register) => register.value)}
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
