import style from "./ReadOnlyInput.module.css";
export function Counter({count}) {
    return (
        <label>
            <input type="number" className={style["readonly-input"]} value={count} readOnly /> bulbs
        </label>
    );
}