import React, { useState, useLayoutEffect, useContext } from "react";
import SizeContext from "./SizeProvider";

export default function UseSize(props) {
  const size = useContext(SizeContext);
  return <React.Fragment>{props.children}</React.Fragment>;
}
