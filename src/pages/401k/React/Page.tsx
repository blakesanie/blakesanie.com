import {useMemo, useState} from "react";
import type {AppState} from "./Types";
import simulate from "./simulation";
import styles from "./Page.module.css"; // import MenuItem from '@mui/material/MenuItem';

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
        m: new Date().getMonth(),
        d: new Date().getDate(),
        TU: 0
    });

    const [highlightedContribution, setHighlightedContribution] = useState(0);

    console.log("appstate", appState);

    const results = useMemo(() => simulate(appState), [appState]);
    console.log("results", results);


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

    return (
        <div
            className={styles.app}
            onKeyDown={(event) => {
                if (event.key === "Enter") {
                    event.target.dispatchEvent(new Event("blur"));
                }
            }}
        >
            <p>from react</p>
        </div>
    );
}

export default App;
