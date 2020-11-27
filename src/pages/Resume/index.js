import React, { useEffect } from "react";
import "./styles.css";
export default function Resume(props) {
  useEffect(() => {
    document.getElementsByTagName("html")[0].style.backgroundColor = "white";
    document.getElementsByTagName("header")[0].classList.remove("dark");
  }, []);
  return <iframe src="./resume.pdf" frameborder="0"></iframe>;
}
