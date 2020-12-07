import React from "react";
import "./styles.css";
import { Helmet } from "react-helmet";
export default function Redirect(props) {
  window.location.href = props.href;
  return (
    <React.Fragment>
      <Helmet>
        <title>Redirecting</title>
        <meta http-equiv="refresh" content={`0; URL=${props.href}`} />
      </Helmet>
      <h1 className="redirectLabel">Redirecting to {props.name}...</h1>
    </React.Fragment>
  );
}
