import React, { useState } from "react";
import "./techUsedStyles.css";

const filenames = {
  IFTTT: "IFTTT.jpeg",
  tensorflow: "tensorflow.png",
  xCode: "xCode.png",
  yahooFinance: "yahooFinance.png",
  heroku: "heroku.png",
  gameKit: "gameKit.png",
  alphaVantage: "alphaVantage.png",
  python: "python.png",
  npm: "npm.png",
  fireStore: "fireStore.png",
  reactNative: "reactNative.png",
  expo: "expo.png",
  jQuery: "jQuery.png",
  github: "github.png",
  firebase: "firebase.png",
  java: "java.png",
  express: "express.png",
  aws: "aws.png",
  js: "js.png",
  keras: "keras.png",
  ec2: "ec2.jpeg",
  placesAPI: "placesAPI.png",
  matPlotLib: "matPlotLib.png",
  googleCloudPlatform: "googleCloudPlatform.png",
  postgreSQL: "postgreSQL.png",
  cmu: "cmu.png",
  twitterDev: "twitterDev.png",
  html: "html.png",
  quantopian: "quantopian.png",
  selenium: "selenium.png",
  spotifyDev: "spotifyDev.png",
  projectGutenburg: "projectGutenburg.png",
  swift: "swift.png",
  scikitLearn: "scikitLearn.png",
  appStoreConnect: "appStoreConnect.png",
  stripe: "stripe.png",
  newsAPI: "newsAPI.png",
  css: "css.png",
  alpaca: "alpaca.png",
  nodejs: "nodejs.png",
};

let wideImages = new Set(["express"]);

export default function TechUsed(props) {
  const [current, setCurrent] = useState("");

  const clearCurrent = () => {
    setCurrent("");
  };

  return (
    <div style={props.style} className="techUsed">
      <div className="techRow">
        {props.techUsed.map((name) => {
          return (
            <div
              className={`imgContainer ${wideImages.has(name) ? "wide" : ""}`}
            >
              <img
                src={`/images/cs/techUsed/${filenames[name]}`}
                onMouseEnter={() => {
                  setCurrent(name);
                }}
                onTouchStart={() => {
                  setCurrent(name);
                }}
                onMouseLeave={clearCurrent}
                onTouchEnd={clearCurrent}
              ></img>
            </div>
          );
        })}
      </div>
      <p className="currentTechnology">{current}</p>
    </div>
  );
}
