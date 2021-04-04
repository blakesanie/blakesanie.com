import React from "react";
import reportWebVitals from "./reportWebVitals";
import Root from "./Root";
import { render } from "react-snapshot";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Bookmarks from "./pages/Bookmarks";
import { routes } from "./routes";

let paths = new Set(Object.keys(routes));
paths.delete("/");
paths = Array.from(paths);

render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route exact path="/bookmarks" component={Bookmarks} />
        <Route path={paths.concat(["/redirect"])} component={Root} />
        <Route exact path="/" component={Root} />
        <Route path={["/", "/404"]}>
          <Root notFound />
        </Route>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
