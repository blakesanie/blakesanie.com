import React, { useEffect } from "react";
import Home from "../Home";

export default function NotFound(props) {
  useEffect(() => {
    // props.history.push("/");
    alert("Hmm... that page is not found!");
  }, []);

  return <Home />;
}
