import { useEffect } from "react";
import Home from ".";

export default function Error({ statusCode }) {
  useEffect(() => {
    window.history.pushState({}, null, "/");
    setTimeout(() => {
      alert(`Sorry, a ${statusCode} error occurred!`);
    }, 500);
  }, []);
  return <Home />;
}
