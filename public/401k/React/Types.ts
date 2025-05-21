export interface AppState {
  MPC: number; // max personal contribution
  MTC: number; // max total contribution
  // PC: number; // personal contribution (we are finding this)
  PP: number; // pay periods
  B: number; // base percentage
  M: number[][]; // matching tiers
  YTD: number; // starting personal contribution
  YTDT: number; // total
  m: number; // start month (0 for Jan)
  d: number; // start day
  G: number; // gross pre-tax paycheck
  TU: number; // weeks after end of year
}
