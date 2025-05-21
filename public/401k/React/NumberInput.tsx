import React, { useCallback, useEffect, useRef, useState } from "react";

interface NumberInputProps {
  defaultValue: number;
  min?: number;
  max?: number;
  onBlur?: (n: number, e: React.FocusEvent | undefined) => void;
  onError?: (err: string) => void;
  formatValue?: (str: string) => string;
  detectError?: (x: number) => string;
  placeholder?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
  defaultValue,
  min,
  max,
  onBlur,
  onError,
  formatValue,
  detectError,
  placeholder,
}) => {
  const [value, setValue] = useState("");
  const [trailingDot, setTrailingDot] = useState(false);
  const [hasInteraction, setHasInteraction] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const minExists = min !== undefined;
  const maxExists = max !== undefined;

  function checkBounds(val: number | undefined): string {
    if (minExists && val < min) {
      return "Must be at least " + min;
    } else if (maxExists && val > max) {
      return "Must be at most " + max;
    }
    return "";
  }

  useEffect(() => {
    if (hasInteraction) clip(undefined);
  }, [min, max, hasInteraction]);

  const val = hasInteraction ? value : "" + defaultValue;
  let display = "";
  if (formatValue) {
    display = formatValue(val);
  } else {
    const dotSplit = val.split(".");
    display += val.length ? parseInt(dotSplit[0]).toLocaleString() : "";
    if (dotSplit.length == 2) {
      display += "." + dotSplit[1];
    }
  }

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
        min && setValue("" + min);
      }
      if (onError) onError("");
      if (onBlur) onBlur(floatVal, e);
    },
    [min, max, val, onBlur],
  );

  return (
    <>
      <input
        placeholder={placeholder}
        value={display}
        onChange={(e) => {
          // if (!e.target.value.length) {
          //   setValue(undefined);
          //   return;
          //
          setHasInteraction(true);
          const num = e.target.value.replace(/[^0-9.]/g, "");
          const f = parseFloat(num);
          if (onError && f !== undefined) {
            onError(detectError ? detectError(f) : checkBounds(f));
          }
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
