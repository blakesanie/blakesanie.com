import React from "react";
import HeaderAndFooter from "../../components/HeaderAndFooter";
import styles from "./index.module.css";

export default function Resume(props) {
  return (
    <HeaderAndFooter>
      <iframe
        src="./resume.pdf"
        frameborder="0"
        title="resume"
        className={styles.iframe}
      ></iframe>
    </HeaderAndFooter>
  );
}
