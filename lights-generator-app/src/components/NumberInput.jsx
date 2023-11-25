import readonlyStyle from "./ReadOnlyInput.module.css";
import style from "./NumberInput.module.css";

export function NumberInput({label, value, name, decrement, increment}) {
    return (
        <label className={style["number-input"]}>
            <input type="number" name={name} className={readonlyStyle["readonly-input"]} value={value} readOnly /> {label}
            <button onClick={decrement} name={name}>Decrease</button>
            <button onClick={increment} name={name}>Increase</button>
        </label>
    );
}