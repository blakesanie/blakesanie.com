import React, { useState, useEffect } from "react";

export default function ScrollProgressBar(props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      if (
        props.visible &&
        document.body.scrollHeight - window.innerHeight > 200
      ) {
        setProgress(
          window.scrollY / (document.body.scrollHeight - window.innerHeight)
        );
      } else {
        setProgress(0);
      }
    };
    document.addEventListener("scroll", handler);
    window.addEventListener("resize", handler);
    return () => {
      document.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        width: props.pageWidth === "100%" ? "200%" : "calc(200% - 440px)",
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
          transform: `translateX(calc(${progress * 50 - 100}%))`,
          zIndex: 99999,
          borderBottomRightRadius: 100,
        }}
      ></div>
    </div>
  );
}
