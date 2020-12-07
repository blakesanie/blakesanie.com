import React from "react";
import "./styles.css";
import { Helmet } from "react-helmet";
export default function Resume(props) {
  return (
    <React.Fragment>
      <Helmet>
        <title>Résumé | Blake Sanie</title>
      </Helmet>
      <iframe src="./resume.pdf" frameborder="0" title="resume"></iframe>
    </React.Fragment>
  );
}
