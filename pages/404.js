import { useEffect } from "react";
import Home from ".";

export default function NotFound(props) {
  useEffect(() => {
    window.history.pushState({}, null, "/");
    setTimeout(() => {
      alert("Sorry, that page doesn't appear to exist!");
    }, 500);
  }, []);
  return <Home />;
}
