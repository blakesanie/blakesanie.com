import React, { useState } from "react";
import styles from "./index.module.css";
import Image from "next/image";

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
          const specifiedSize = split.length > 1 ? split[1] : "";
          const secondary = split.length > 1 ? styles[split[1]] : "";
          return (
            <div className={`${styles.imgContainer} ${secondary}`}>
              <Image
                src={`/images/cs/techUsed/${name}.png`}
                onMouseEnter={() => {
                  setCurrent(name);
                }}
                onTouchStart={() => {
                  setCurrent(name);
                }}
                layout="fixed"
                width={specifiedSize == "wide" ? "70" : "30"}
                height="30"
                objectFit="contain"
                onMouseLeave={clearCurrent}
                onTouchEnd={clearCurrent}
                loading="eager"
              ></Image>
            </div>
          );
        })}
      </div>
      <p className={styles.currentTechnology}>{current}</p>
    </div>
  );
}
