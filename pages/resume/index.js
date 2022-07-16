import React from "react";
import HeaderAndFooter from "../../components/HeaderAndFooter";
import styles from "./index.module.css";
import { NextSeo } from "next-seo";
import Div100vh, { use100vh } from "react-div-100vh";

export default function Resume(props) {
  return (
    <HeaderAndFooter>
      <NextSeo
        title="Resume"
        description="My professional experience, academic achievements, demonstrated skill set, leadership roles, and career objective."
      />
      <Div100vh className={styles.divWrapper}>
        <iframe
          src="/resume.pdf"
          frameBorder="0"
          title="resume"
          className={styles.iframe}
        ></iframe>
      </Div100vh>
    </HeaderAndFooter>
  );
}
