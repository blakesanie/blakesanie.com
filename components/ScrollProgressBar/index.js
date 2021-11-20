import React, { useState, useEffect } from "react";

export default function ScrollProgressBar(props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      if (props.visible) {
        setProgress(
          window.scrollY / (document.body.scrollHeight - window.innerHeight)
        );
      }
    };
    document.addEventListener("scroll", handler);
    window.addEventListener("resize", handler);
    return () => {
      document.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  });

  return (
    <div
      style={{
        position: "fixed",
        width: props.pageWidth || "100%",
        top: 0,
        overflow: "hidden",
        display: props.visible ? "block" : "none",
      }}
    >
      <div
        style={{
          backgroundColor: props.color || "black",
          height: props.height || 4,
          width: "100%",
          transform: `translateX(calc(${progress * 100 - 100}%))`,
          zIndex: 99999,
          borderBottomRightRadius: 100,
        }}
      ></div>
    </div>
  );
}
