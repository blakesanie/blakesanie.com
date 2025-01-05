// // @ts-ignore
// const headerVars = window.headerVars;
//
// export default {
//   isHome: headerVars.isHome as Boolean,
//   hoverZoneBehind: headerVars.hoverZoneBehind as Boolean,
//   menuExpanded: false,
// };

export interface HeaderVars {
  mobileHeaderHeight: number;
  headerHeightTransitionDuration: number;
  headerPositionTransitionDuration: number;
  mobileMaxWidth: number;
  navPadding: number;
  noTab: boolean;
  hoverZoneBehind: boolean;
}
