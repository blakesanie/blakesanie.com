import React, { useCallback, useEffect, useRef, useState } from "react";

interface NumberInputProps {
  defaultValue: number;
  min?: number;
  max?: number;
  onBlur?: (n: number, e: React.FocusEvent | undefined) => void;
  prefix?: string;
  suffix?: string;
  onError?: (err: string) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({
  defaultValue,
  min,
  max,
  onBlur,
  prefix,
  suffix,
  onError,
}) => {
  const [value, setValue] = useState("");
  const [trailingDot, setTrailingDot] = useState(false);
  const [hasInteraction, setHasInteraction] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const minExists = min !== undefined;
  const maxExists = max !== undefined;

  function checkBounds(val: number | undefined) {
    console.log("check bounds");

    if (val !== undefined && onError) {
      if (minExists && val < min) {
        onError("Must be at least " + min);
        return true;
      } else if (maxExists && val > max) {
        onError("Must be at most " + max);
        return true;
      } else {
        onError("");
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
      if (onError) onError("");
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
        }}
      />
    </>
  );
};

export default NumberInput;
