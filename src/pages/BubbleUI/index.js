import React, { useState, useLayoutEffect } from "react";
import BubbleElement from "./BubbleUI.js";
import "./styles.css";

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default function BubbleUI(props) {
  let components = [];
  for (var i = 0; i < 200; i++) {
    components.push(
      <div
        className="bubbleComp"
        style={{
          backgroundColor: getRandomColor(),
          borderRadius: `50%`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h5 key={i}>{i}</h5>
      </div>
    );
  }
  return (
    <BubbleElement shouldTranslate roundCorners={false}>
      {components}
    </BubbleElement>
  );
}
