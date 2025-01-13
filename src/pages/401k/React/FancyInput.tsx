import React, { useMemo, useState } from "react";
import styles from "./FancyInput.module.css";

interface NumberInputProps {
  label?: string;
  InputType?: React.ComponentType;
  prefix?: string;
  suffix?: string;
  inputProps?: React.ComponentProps<any>;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const FancyInput: React.FC<NumberInputProps> = ({
  label,
  InputType,
  children,
  prefix,
  suffix,
  inputProps,
  style,
}) => {
  const [error, setError] = useState("");

  const inputComponent = useMemo(() => {
    if (children) return children;
    return (
      <InputType
        {...inputProps}
        // @ts-ignore
        onError={(err) => {
          setError(err);
        }}
      />
    );
  }, [InputType, children, inputProps]);

  return (
    <div
      className={styles.container + (error ? " " + styles.error : "")}
      style={{
        ...style,
        borderColor: error ? "red !important" : "transparent",
      }}
    >
      {label && <div className={styles.label}>{label}</div>}
      {error && <div className={styles.errorLabel}>{error}</div>}
      <div className={styles.row}>
        {prefix ? <div className={styles.prefix}>{prefix}</div> : null}
        <div className={styles.input}>{inputComponent}</div>
        {suffix ? <div className={styles.suffix}>{suffix}</div> : null}
      </div>
    </div>
  );
};

export default FancyInput;
