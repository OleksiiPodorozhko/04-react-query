import { useState } from "react";
import "../styles/App.module.css";

export default function App() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <>
      <h1>Hello, world!</h1>
      <button onClick={handleClick}>Clicked {count} times</button>
    </>
  );
}
