
import './App.css';
import { useState } from 'react';

function App() {
  const [counter,setcounter] = useState(0); // use state hook returns two value setcounter function that updates the state and counter which is state
  
  return (
    <div>
      <div>Counter App</div>
      <div><button onClick={()=>{
        setcounter(counter+1);
      }}>counter</button></div>
      <div>{counter}</div>

    </div>
  );
}

export default App;
