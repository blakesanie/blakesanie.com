import NumberInput from "./NumberInput";
import FancyInput from "./FancyInput";
import React from "react";

interface MatchAmountProps {
  matchPercentage: number;
  payPercentage?: number;
  index: number;
  onBlur: (n: number | undefined, m: number | undefined) => void;
}

const MatchAmount: React.FC<MatchAmountProps> = ({
  matchPercentage,
  payPercentage,
  index,
  ...props
}) => {
  return (
    <>
      <FancyInput
        label="Match Percent"
        suffix="%"
        inputProps={{
          defaultValue: matchPercentage,
          min: 0,
          onBlur: (x, _) => props.onBlur(x, undefined),
        }}
        InputType={NumberInput}
      ></FancyInput>
      {index < 0 ? (
        <span>of my pay, upfront</span>
      ) : (
        <>
          <span>{`of the ${index == 0 ? "first" : "next"}`}</span>
          <FancyInput
            label="Pay Percent"
            suffix="%"
            inputProps={{
              defaultValue: payPercentage || 0,
              min: 0,
              onBlur: (x) => props.onBlur(undefined, x),
            }}
            InputType={NumberInput}
          ></FancyInput>
        </>
      )}
    </>
  );
};

export default MatchAmount;
