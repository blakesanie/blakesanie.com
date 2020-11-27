import React, { useEffect } from "react";
import "./styles.css";
export default function Redirect(props) {
  useEffect(() => {
    document.getElementsByTagName("html")[0].style.backgroundColor = "white";
    document.getElementsByTagName("header")[0].classList.remove("dark");
  }, []);
  window.location.href = props.href;
  return <h1 className="redirectLabel">Redirecting...</h1>;
}
