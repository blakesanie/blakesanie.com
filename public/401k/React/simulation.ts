import type { AppState } from "./Types";

export function daysInMonth(month: number) {
  switch (month + 1) {
    case 1: // January
    case 3: // March
    case 5: // May
    case 7: // July
    case 8: // August
    case 10: // October
    case 12: // December
      return 31;
    case 4: // April
    case 6: // June
    case 9: // September
    case 11: // November
      return 30;
    case 2: // February
      return 29; //(year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
    default:
      return -1; // Invalid month
  }
}

export type SimulationResult = {
  contribution: number;
  YTDContribution: number;
  match: number;
  YTDMatch: number;
  growth: number;
  worth: number;
};

export type SimulationResults = {
  x: number[];
  y: SimulationResult[];
};

function makeResult(
  appState: AppState,
  amount: number,
  potentialPersonalContribution: number,
  potentialTotalContribution: number,
  payPeriodsRemaining: number,
  payPeriodRoi: number,
) {
  const snapshots: SimulationResult[] = [];
  let remainingPersonalContribution = potentialPersonalContribution;
  let remainingTotalContribution = potentialTotalContribution;

  for (let i = 0; i < payPeriodsRemaining; i++) {
    const result: SimulationResult = {
      contribution: 0,
      YTDContribution: 0,
      match: 0,
      YTDMatch: 0,
      growth: 0,
      worth: 0,
    };
    let contributionAmount = Math.min(amount, remainingPersonalContribution);
    result.contribution = contributionAmount;
    remainingPersonalContribution -= result.contribution;
    remainingTotalContribution -= result.contribution;
    result.match += (appState.B / 100) * appState.G;
    for (const [matchPercent, payPercent] of appState.M) {
      const matchAmount =
        (matchPercent / 100) *
        Math.min((appState.G * payPercent) / 100, contributionAmount);
      result.match += matchAmount;
      contributionAmount -= matchAmount;
    }
    result.match = Math.min(
      result.match,
      remainingTotalContribution - contributionAmount,
    );
    remainingTotalContribution -= result.match;
    result.YTDContribution = result.contribution;
    result.YTDMatch = result.match;
    result.worth = result.growth + result.contribution + result.match;
    if (i > 0) {
      const last = snapshots[i - 1];
      result.growth = payPeriodRoi * last.worth;
      result.YTDContribution += last.YTDContribution;
      result.YTDMatch += last.YTDMatch;
      result.worth += last.worth + result.growth;
    }
    snapshots.push(result);
  }
  return snapshots;
}

export default function simulate(appState: AppState) {
  let daysSoFar = 0;
  for (let i = 0; i < appState.m; i++) {
    daysSoFar += daysInMonth(i);
  }
  daysSoFar += appState.d;
  const daysInPayPeriod = 365 / appState.PP;
  const payPeriodsSoFar = daysSoFar / daysInPayPeriod;
  const payPeriodsRemaining = appState.PP - payPeriodsSoFar;

  const roi = 0.1;
  const payPeriodRoi = Math.pow(1 + roi, 1 / appState.PP) - 1;

  const potentialPersonalContribution = appState.MPC - appState.YTD;
  const potentialTotalContribution = appState.MTC;
  const results: SimulationResults = {};
  for (
    let amount = 50;
    amount <= potentialPersonalContribution;
    amount = Math.ceil(amount * 1.1)
  ) {
    const result = makeResult(
      appState,
      amount,
      potentialPersonalContribution,
      potentialTotalContribution,
      payPeriodsRemaining,
      payPeriodRoi,
    );
    results[amount] = result;
  }

  function searchForMaxPoint(
    lowerX: number,
    lowerY: number,
    lowerR: SimulationResult[],
    upperX: number,
    upperY: number,
    upperR: SimulationResult[],
  ): [x: number, y: number, r: SimulationResult[]] {
    let bestX = lowerX;
    let bestY = lowerY;
    let bestResult = lowerR;
    if (upperY > bestY) {
      bestY = upperY;
      bestX = upperX;
      bestY = upperY;
    }

    while (Math.abs(upperY - lowerY) > 1 && Math.abs(upperX - lowerX) > 1) {
      const midX = Math.round((lowerX + upperX) / 2);
      bestResult = makeResult(
        appState,
        midX,
        potentialPersonalContribution,
        potentialTotalContribution,
        payPeriodsRemaining,
        payPeriodRoi,
      );
      const midY = bestResult[bestResult.length - 1].worth;

      if (midY > bestY) {
        const [x1, y1, r1] = searchForMaxPoint(
          lowerX,
          lowerY,
          lowerR,
          midX,
          midY,
          bestResult,
        );
        const [x2, y2, r2] = searchForMaxPoint(
          midX,
          midY,
          bestResult,
          upperX,
          upperY,
          upperR,
        );
        if (y1 > y2) {
          return [x1, y1, r1];
        }
        return [x2, y2, r2];
      }
      if (lowerY > upperY) {
        upperX = midX;
        upperY = midY;
      } else {
        lowerX = midX;
        lowerY = midY;
      }
    }
    return [bestX, bestY, bestResult];
  }

  const keys = Object.keys(results);
  const vals = Object.values(results);
  const [bestX, bestY, bestR] = searchForMaxPoint(
    parseFloat(keys[0]),
    vals[0][vals[0].length - 1].worth,
    vals[0],
    parseFloat(keys[keys.length - 1]),
    vals[vals.length - 1][vals[vals.length - 1].length - 1].worth,
    vals[vals.length - 1],
  );
  results[bestX] = bestR;

  return results;
}

/*
function searchForMaxPoint(
    lowerX: number,
    lowerY: number,
    lowerR: SimulationResult[],
    upperX: number,
    upperY: number,
    upperR: SimulationResult[],
  ): [x: number, y: number, r: SimulationResult[]] {
    let bestX = lowerX;
    let bestY = lowerY;
    let bestResult = lowerR;
    if (upperY > bestY) {
      bestY = upperY;
      bestX = upperX;
      bestY = upperY;
    }

    while (Math.abs(upperY - lowerY) > 1 && Math.abs(upperX - lowerX) > 1) {
      const midX = (lowerX + upperX) / 2;
      bestResult = makeResult(
        appState,
        midX,
        potentialPersonalContribution,
        potentialTotalContribution,
        payPeriodsRemaining,
        payPeriodRoi,
      );
      const midY = bestResult[bestResult.length - 1].worth;

      if (midY > bestY) {
        const [x1, y1, r1] = searchForMaxPoint(
          lowerX,
          lowerY,
          lowerR,
          midX,
          midY,
          bestResult,
        );
        const [x2, y2, r2] = searchForMaxPoint(
          midX,
          midY,
          bestResult,
          upperX,
          upperY,
          upperR,
        );
        if (y1 > y2) {
          return [x1, y1, r1];
        }
        return [x2, y2, r2];
      }
      if (lowerY > upperY) {
        upperX = midX;
        upperY = midY;
      } else {
        lowerX = midX;
        lowerY = midY;
      }
    }
    return [bestX, bestY, bestResult];
  }

  const keys = Object.keys(results);
  const vals = Object.values(results);
  const [bestX, bestY, bestR] = searchForMaxPoint(
    parseFloat(keys[0]),
    vals[0][vals[0].length - 1].worth,
    vals[0],
    parseFloat(keys[keys.length - 1]),
    vals[vals.length - 1][vals[vals.length - 1].length - 1].worth,
    vals[vals.length - 1],
  );
  results[bestX] = bestR

  return results;
}
 */
