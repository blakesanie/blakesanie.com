import React, { useState, useLayoutEffect, useContext } from "react";
import "./styles.css";

export default function BubbleElement(props) {
  return (
    <div
      style={{
        backgroundColor: props.color,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
      }}
    >
      {props.bubbleSize > 100 ? <p>Some data</p> : null}
    </div>
  );
}
