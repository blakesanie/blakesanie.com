import React from "react";

interface NumberInputProps {
  label?: string;
  children: React.ReactNode;
  prefix?: string;
  suffix?: string;
}

const FancyInput: React.FC<NumberInputProps> = ({
  label,
  children,
  prefix,
  suffix,
}) => {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        border: "1px solid black",
        padding: "0 0.6em",
      }}
    >
      {label && (
        <label
          style={{
            // position: "absolute",
            // top: 0,
            // left: "0.5em",
            height: "0.6em",
            lineHeight: "0.6em",
            marginBottom: "-0.6em",
            transform: `translateY(-50%)`,
            fontSize: 12,
            padding: "0 0.4em",
            marginLeft: "-0.4em",
            background: "white",
            zIndex: 2,
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {prefix ? <div>{prefix}</div> : null}
        {children}
        {suffix ? <div>{suffix}</div> : null}
      </div>
    </div>
  );
};

export default FancyInput;
