import { useState } from "react";
import "./App.css";
import { Counter } from "./components/Counter";
import { NumberInput } from "./components/NumberInput";
import { Light } from "./components/Light";

const colors = [
  "blue",
  "green",
  "orange",
  "pink",
  "red",
  "yellow",
];

// app state management
const defaultState = { rows: 0, columns: 0 };
let size, setSize;
function decrement({target}) {
  if (size[target.name] == 0) {
    return;
  }
  size[target.name]--;
  setSize(Object.create(size));
}
function increment({target}) {
  if (target.name == "columns") {
    if (size.columns > 8) {
      return;
    }
  }
  size[target.name]++;
  setSize(Object.create(size));
}
const stateSetters = { decrement, increment };
const lights = [];

export default function App() {
  [size, setSize] = useState(defaultState);
  const count = size.rows * size.columns;

  for (let i = 0; i < count; i++) {
    const ci = Math.floor(Math.random() * colors.length);
    lights[i] = (<Light key={i} color={colors[ci]} />);
  }
  lights.length = count;

  return <>
    <header className={"header"}>
      <Counter count={count} />
      <div className={"controls"}>
        <NumberInput label="rows" name="rows" value={size.rows} {...stateSetters} />
        <NumberInput label="columns" name="columns" value={size.columns} {...stateSetters} />
      </div>
    </header>
    <main className={"lights"} style={{"--cols": size.columns}}>
      {lights}
    </main>
  </>;
}
