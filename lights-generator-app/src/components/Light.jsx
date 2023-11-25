import { useState } from "react";
import styles from "./Light.module.css";
export function Light({color}) {
    const [on, setOn] = useState("");
    const onClick = () => setOn(on?"":color);
    
    return (<button className={styles.light} onClick={onClick} data-state={on}></button>);
}