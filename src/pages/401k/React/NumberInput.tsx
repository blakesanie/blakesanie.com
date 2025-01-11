import React, { useCallback, useEffect, useRef, useState } from "react";

interface NumberInputProps {
  defaultValue: number;
  min?: number;
  max?: number;
  onBlur?: (n: number, e: React.FocusEvent | undefined) => void;
  prefix?: string;
  suffix?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
  defaultValue,
  min,
  max,
  onBlur,
  prefix,
  suffix,
}) => {
  const [value, setValue] = useState("");
  const [trailingDot, setTrailingDot] = useState(false);
  const [hasInteraction, setHasInteraction] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  const minExists = min !== undefined;
  const maxExists = max !== undefined;

  function checkBounds(val: number | undefined) {
    console.log("check bounds");

    if (val !== undefined) {
      if (minExists && val < min) {
        setError("Must be at least " + min);
        return true;
      } else if (maxExists && val > max) {
        setError("Must be at most " + max);
        return true;
      } else {
        setError("");
      }
    }
    return false;
  }

  useEffect(() => {
    if (hasInteraction) clip(undefined);
  }, [min, max, hasInteraction]);

  const val = hasInteraction ? value : "" + defaultValue;
  const dotSplit = val.split(".");
  let display = prefix || "";
  display += val.length ? parseInt(dotSplit[0]).toLocaleString() : "";
  if (dotSplit.length == 2) {
    display += "." + dotSplit[1];
  }
  if (suffix) display += suffix;

  const clip = useCallback(
    (e: React.FocusEvent | undefined) => {
      let floatVal = 0;
      if (val.length) {
        floatVal = parseFloat(val);
        floatVal = Math.max(
          Math.min(floatVal, maxExists ? max : Infinity),
          minExists ? min : -Infinity,
        );
        setValue("" + floatVal);
      } else {
        setValue("" + (min || 0));
      }
      setError("");
      if (onBlur) onBlur(floatVal, e);
    },
    [min, max, val, onBlur],
  );

  return (
    <>
      <input
        value={display}
        onChange={(e) => {
          // if (!e.target.value.length) {
          //   setValue(undefined);
          //   return;
          //
          setHasInteraction(true);
          const num = e.target.value.replace(/[^0-9.]/g, "");
          console.log("should err", checkBounds(parseFloat(num)));
          setValue(num);
        }}
        onBlur={clip}
        style={{
          outlineStyle: "none",
          boxShadow: "none",
          // border-color: transparent;
          border: "none",
          padding: "0.4em 0.4em",
        }}
      />
      {error && (
        <label
          style={{
            // position: "absolute",
            // top: 0,
            // left: "0.5em",
            color: "red",
            lineHeight: "0.6em",
            transform: `translateY(50%)`,
            fontSize: 12,
            padding: "0 0.3em",
            background: "white",
            marginTop: "-0.6em",
            marginLeft: "0.3em",
          }}
        >
          {error}
        </label>
      )}
    </>
  );
};

export default NumberInput;
