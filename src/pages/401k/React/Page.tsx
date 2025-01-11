import React, { useMemo, useState } from "react";
import type { AppState } from "./Types";
import styles from "./Page.module.css"; // import MenuItem from '@mui/material/MenuItem';
import NumberInput from "./NumberInput"; // import MenuItem from '@mui/material/MenuItem';
import simulate, { daysInMonth } from "./simulation"; // import MenuItem from '@mui/material/MenuItem';
import FancyInput from "./FancyInput";
import MatchAmount from "./MatchAmount";
import OptimalPlot from "./OptimalPlot";
import BreakdownPlot from "./BreakdownPlot";
import ResultTable from "./ResultTable";

// import MenuItem from '@mui/material/MenuItem';

function dateToNumber(date: Date): number {
    return (
        (date.getMonth() + 1) * 10000 +
        date.getDate() * 1000 +
        (date.getFullYear() % 100)
    );
}

function dateNumberToElements(num: number) {
    const month = Math.floor(num / 10000);
    const day = Math.floor(num / 1000);
    const year = Math.floor(num % 100);
    return [month, day, year];
}

// interface DateInputProps {
//     defaultValue: number;
// }
//
// const DateInput: React.FC<MatchAmountProps> = ({
//
// })

const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

function App() {
  const [appState, setAppState] = useState<AppState>({
    MPC: 23500,
    MTC: 70000,
    G: 4900,
    PP: 26,
    B: 3,
    M: [
      [100, 3],
      [50, 3],
    ],
    YTD: 0,
    YTDT: 0,
    m: new Date().getMonth(),
    d: new Date().getDate(),
    TU: 0,
  });

  const [highlightedContribution, setHighlightedContribution] = useState(50);

  console.log("appstate", appState);

  const results = useMemo(() => simulate(appState), [appState]);
  // console.log("results", results);

  // const maxPersonalContribution = useMemo(
  //   () => (
  //     <NumericFormat
  //       value={appState.MPC}
  //       onChange={(e) => {
  //         appState.MPC = e.target.value;
  //         setAppState({ ...appState });
  //       }}
  //       customInput={(props) => <TextField {...props} />}
  //       thousandSeparator
  //       valueIsNumericString
  //       variant="standard"
  //       label="react-number-format"
  //     />
  //   ),
  //   [appState.MPC]
  // );

  const optimalPlot = useMemo(() => {
    if (!results) {
      return null;
    }
    return (
      <OptimalPlot
        results={results}
        onHighlight={(i) => {
          setHighlightedContribution(i);
        }}
      />
    );
  }, [results]);

  const breakdownPlot = useMemo(() => {
    if (!results || !results[highlightedContribution]) return null;

    return <BreakdownPlot result={results[highlightedContribution]} />;
  }, [highlightedContribution, results]);

  const resultTable = useMemo(() => {
    return <ResultTable result={results[highlightedContribution]} />;
  }, [highlightedContribution, results]);

  return (
    <div
      className={styles.app}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.target.dispatchEvent(new Event("blur"));
        }
      }}
    >
      <h2>Calculator Parameters</h2>
      <table className={styles.paramSection}>
        <tbody>
          <tr className={styles.paramGroup}>
            <td className={styles.paramSectionName}>Restrictions</td>
            <td className={styles.inputGroup}>
              <FancyInput
                label={"Max Personal Contribution"}
                prefix={"$"}
                inputProps={{
                  defaultValue: appState.MPC,
                  min: 0,
                  max: appState.MTC,
                  onBlur: (x) => {
                    setAppState({ ...appState, MPC: x });
                  },
                }}
                InputType={NumberInput}
              ></FancyInput>

              <FancyInput label={"Max Total Contribution"}>
                <NumberInput
                  defaultValue={appState.MTC}
                  min={0}
                  onBlur={(x) => {
                    setAppState({ ...appState, MTC: x });
                  }}
                  prefix={"$ "}
                />
              </FancyInput>
            </td>
          </tr>
          <tr className={styles.paramGroup}>
            <td className={styles.paramSectionName}>Contribution</td>
            <td className={styles.inputGroup}>
              <FancyInput label={"Gross Paycheck"}>
                <NumberInput
                  defaultValue={appState.G}
                  label={"Gross Paycheck"}
                  min={0}
                  onBlur={(x) => {
                    setAppState({ ...appState, G: x });
                  }}
                  prefix={"$ "}
                />
              </FancyInput>
              <FancyInput label={"Pay Periods"}>
                <NumberInput
                  defaultValue={appState.PP}
                  min={1}
                  onBlur={(x) => {
                    setAppState({ ...appState, PP: x });
                  }}
                  prefix={"$ "}
                />
              </FancyInput>
            </td>
          </tr>
          <tr className={styles.paramGroup}>
            <td className={styles.paramSectionName}>Timeline</td>
            <td className={styles.inputGroup}>
              <span>Start simulation on</span>
              <FancyInput label={"Month"}>
                <select>
                  {months.map((mo, i) => (
                    <option value={i}>{mo}</option>
                  ))}
                </select>
              </FancyInput>
              <FancyInput label={"Day"}>
                <NumberInput
                  defaultValue={appState.m}
                  min={1}
                  max={daysInMonth(appState.m)}
                  onBlur={(x) => {
                    setAppState({ ...appState, m: x });
                  }}
                />
              </FancyInput>

              <span>With a prior personal contribution of</span>
              <FancyInput label={"Prior Personal Contribution"}>
                <NumberInput
                  defaultValue={appState.YTD}
                  min={0}
                  max={appState.MPC}
                  onBlur={(x) => {
                    setAppState({ ...appState, YTD: x });
                  }}
                  prefix={"$"}
                />
              </FancyInput>
              <span>making a total contribution of</span>
              <FancyInput label={"Prior Total Contribution"}>
                <NumberInput
                  defaultValue={appState.YTDT}
                  min={0}
                  max={appState.MTC}
                  onBlur={(x) => {
                    setAppState({ ...appState, YTDT: x });
                  }}
                  prefix={"$ "}
                />
              </FancyInput>
            </td>
          </tr>
          <tr className={styles.paramGroup}>
            <td className={styles.paramSectionName}>Match</td>
            <td className={styles.inputGroup}>
              <MatchAmount
                matchPercentage={appState.B}
                index={-1}
                onBlur={(matchPercent, _) => {
                  if (matchPercent !== undefined) {
                    appState.B = matchPercent;
                    setAppState({ ...appState });
                  }
                }}
              />
              {appState.M.map(([matchPetcentage, payPercentage], i) => (
                <MatchAmount
                  matchPercentage={matchPetcentage}
                  payPercentage={payPercentage}
                  index={i}
                  onBlur={(matchPercent, payPercent) => {}}
                />
              ))}
            </td>
          </tr>
        </tbody>
      </table>
      {optimalPlot}
      {breakdownPlot}
      {resultTable}
    </div>
  );
}

export default App;
