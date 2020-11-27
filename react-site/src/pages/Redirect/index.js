import React from "react";
import "./styles.css";
export default function Redirect(props) {
  window.location.href = props.href;
  return <h1 className="redirectLabel">Redirecting...</h1>;
}
