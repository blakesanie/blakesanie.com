import React, { useState, useLayoutEffect } from "react";
import BubbleUI from "./BubbleUI";
import Bubble from "./BubbleElement";
import "./styles.css";

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const colors = [];
for (var i = 0; i < 200; i++) {
  colors.push(getRandomColor());
}

export default function (props) {
  let components = [];
  for (var i = 0; i < 200; i++) {
    // const theme = useContext(ThemeContext);
    components.push(<Bubble color={colors[i]} />);
  }
  return (
    <BubbleUI
      shouldTranslate
      roundCorners={false}
      gutter={5}
      width={12}
      innerRadius={320}
      outerRadius={600}
      translationFactor={0.35}
      provideProps
    >
      {components}
    </BubbleUI>
  );
}
