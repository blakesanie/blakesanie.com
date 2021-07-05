import React from "react";
import HeaderAndFooter from "../../components/HeaderAndFooter";
import styles from "./index.module.css";
import { NextSeo } from "next-seo";

export default function Resume(props) {
  return (
    <HeaderAndFooter>
      <NextSeo title="Blake Sanie - Résumé" />
      <iframe
        src="/resume.pdf"
        frameBorder="0"
        title="resume"
        className={styles.iframe}
      ></iframe>
    </HeaderAndFooter>
  );
}
