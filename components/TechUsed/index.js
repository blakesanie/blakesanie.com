import React, { useState } from "react";
import styles from "./index.module.css";

export default function TechUsed(props) {
  const [current, setCurrent] = useState("");

  const clearCurrent = () => {
    setCurrent("");
  };

  return (
    <div style={props.style} className={styles.techUsed}>
      <div className={styles.techRow}>
        {props.techUsed.map((name) => {
          let split = name.split("-");
          name = split[0];
          const secondary = split.length > 1 ? styles[split[1]] : "";
          return (
            <div className={`${styles.imgContainer} ${secondary}`}>
              <img
                src={`/images/cs/techUsed/${name}.png`}
                onMouseEnter={() => {
                  setCurrent(name);
                }}
                onTouchStart={() => {
                  setCurrent(name);
                }}
                onMouseLeave={clearCurrent}
                onTouchEnd={clearCurrent}
              ></img>
            </div>
          );
        })}
      </div>
      <p className={styles.currentTechnology}>{current}</p>
    </div>
  );
}
