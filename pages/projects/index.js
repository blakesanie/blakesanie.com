import React from "react";
import styles from "./index.module.css";
import TechUsed from "../../components/TechUsed";
import Copyright from "../../components/Copyright";
import HeaderAndFooter from "../../components/HeaderAndFooter";
import { NextSeo } from "next-seo";
import Image from "next/image";

import InvestivisionImage from "../../public/images/cs/investivision.png";

import UXAIImage from "../../public/images/cs/uxai.png";

import BubbleImage from "../../public/images/cs/bubble.png";

import StockBotImage from "../../public/images/cs/fund_chart.png";

import AcrossImage from "../../public/images/cs/AcrossTheAisle.jpg";
import HeadlinesImage from "../../public/images/cs/headlines.jpg";
import SpotifyImage from "../../public/images/cs/spotify.png";
import CalculessImage from "../../public/images/cs/calculess.jpg";
import TwitterPoetryImage from "../../public/images/cs/TwitterPoetryBot.png";
import TrendingTwitterImage from "../../public/images/cs/twitter.jpg";
import ProximityImage from "../../public/images/cs/proximity.jpg";
import BounceImage from "../../public/images/cs/bounce.jpg";
import StockAnalysisImage from "../../public/images/cs/stockAnalysis.png";

const projects = [
  {
    name: "Investivision",
    desc: "Intelligent stock market investing tools for the long-term. View the market's top investments at a glance, browse our vast array of rankings, and construct your personal portfolio with optimal growth versus volatility characteristics. Available on web, and soon mobile!",
    imageUrl: InvestivisionImage,
    links: [
      {
        text: "Visit Website",
        url: "https://investivision.com",
        external: true,
      },
    ],
    techUsed: [
      "IFTTT",
      "Firebase",
      "Heroku",
      "Yahoo Finance",
      "Tensorflow",
      "Selenium",
      "Stripe",
      "Google Cloud Platform",
      "React Native",
      "PostgreSQL",
    ],
  },
  {
    name: "UX-AI",
    desc: "An web-based AI agent that strengthens user experience by intelligently inferring user behavior status given demonstrated page interactions. With these valuable insights, UX-AI encourages sites to dynamically adjust user experience with the goal of optimizing engagement during casual, fast-paced, and distracted browsing sessions.",
    imageUrl: UXAIImage,
    links: [
      {
        text: "Demo",
        url: "https://uxai.blakesanie.com/#demo",
        external: true,
      },
      {
        text: "Download",
        url: "https://www.npmjs.com/package/ux-ai",
        external: true,
      },
      {
        github: "https://github.com/blakesanie/UX-AI",
      },
    ],
    techUsed: [
      "Tensorflow",
      "Jupyter Notebook",
      "Chome Extension API",
      "JavaScript",
      "NPM",
      "Next.js",
    ],
  },
  {
    name: "React Bubble UI",
    desc: "A highly configurable Bubble UI React.js component, similar to the iconic Apple Watch app layout. This custom element provides a playful and curious feel that trumps dull grid-based webpage layouts. Download this open source package or contribute on GitHub today!",
    imageUrl: BubbleImage,
    links: [
      {
        text: "Demo",
        url: "https://bubbleui.blakesanie.com",
        external: true,
      },
      {
        text: "Download",
        url: "https://www.npmjs.com/package/react-bubble-ui",
        external: true,
      },
      {
        text: "Design Overview",
        url: "https://codeburst.io/deconstructing-the-iconic-apple-watch-bubble-ui-aba68a405689",
        external: true,
      },
      {
        github: "https://github.com/blakesanie/React-Bubble-UI",
      },
    ],
    techUsed: ["Node.js", "React", "NPM"],
  },
  {
    name: "Stock Bot",
    desc: "A fully autonomous stock trading system. LSTM-based neural networks continuously learn from historical data using a genetic algorithm in order to produce weekly portfolios optimized for risk and volatility. Even with zero human oversight, account value grows exponentially!",
    imageUrl: StockBotImage,
    links: [
      {
        text: "Learn More",
        url: "/fund",
        external: true,
      },
    ],
    techUsed: ["Alpaca", "Tensorflow", "Firebase", "Yahoo Finance", "Heroku"],
  },
  {
    name: "Across the Aisle",
    desc: "An app that tries to unite a politically divided America. By housing discussion threads for a variety of controversial political topics, Americans from all over the political spectrum can understand each other's perspectives. Awarded as finalist in 2018 Congressional App Challenge.",
    imageUrl: AcrossImage,
    links: [
      {
        text: "View Submission",
        url: "https://youtu.be/4EqokCJiqnY",
        external: true,
      },
    ],
    techUsed: ["Node.js", "React Native", "Expo", "Firebase"],
  },
  {
    name: "Regression-Based Stock Analysis",
    desc: "An investment-assisting tool that utilizes statistical models to infer and visualize trends in S&P 500 stocks. For each symbol in the index, the program parses historical time series data and quantifies the stock's growth potential and volatility. Findings are outputted to CSV and a public, interactive website.",
    imageUrl: StockAnalysisImage,
    links: [
      {
        github: "https://github.com/blakesanie/Stock-Analysis",
      },
    ],
    techUsed: ["MatPlotLib", "Scikit Learn", "jQuery"],
  },
  {
    name: "Headlines",
    desc: "A remarkably user-friendly news app. As the name implies, notable titles can be browsed with minimal effort. With numerous categories and more than 32 world-renowned news sources to choose from, articles are filtered to fit your interests. If a headline just isn't enough, an article description, photo, and the full article are one press away.",
    imageUrl: HeadlinesImage,
    links: [
      {
        github: "https://github.com/blakesanie/Headlines",
      },
    ],
    techUsed: ["Swift", "Xcode", "News API", "App Store Connect"],
  },
  {
    name: "Twitter Poetry Detection",
    desc: `A NLP-driven bot with an appreciation for poetry. The bot listens to Twitter's tweet stream, continuously searching for updates that contain the subject "life" and maintain a rhyming scheme when reformatted into a quatrain. Selected tweets are automatically retweeted, giving accidental poets a shoutout on the platform.`,
    imageUrl: TwitterPoetryImage,
    links: [
      {
        text: "Twitter",
        url: "https://twitter.com/your_life_poems",
        external: true,
      },
      {
        github: "https://github.com/blakesanie/Twitter-Poetry-Detection",
      },
    ],
    techUsed: ["Node.js", "Twitter Developers", "CMU", "Heroku"],
  },
  {
    name: "Spotify Mosaic",
    desc: "A digital art project. This web app provides a means of visualization one's music taste. Users can authenticate with their Spotify account and build creative mosaics from album covers on their playlists. Exporting and printing features come built in!",
    imageUrl: SpotifyImage,
    links: [
      {
        text: "Launch Web App",
        url: "/spotifyMosaic",
        external: true,
      },
    ],
    techUsed: ["HTML", "CSS", "JavaScript", "Spotify Developers", "jQuery"],
  },
  {
    name: "Calculess.js",
    desc: "An open source javaScript library that provides complex calculus functions through abstract and easy-to-use methods. Download Calculess to start implementing limits, derivatives, integrals, and more with your project's functions, or contribute to the repository on GitHub!",
    imageUrl: CalculessImage,
    links: [
      {
        github: "https://github.com/blakesanie/Calculess",
      },
    ],
    techUsed: ["Node.js", "NPM"],
  },
  {
    name: "Qwerty, Revisited",
    desc: "An experiment in which a new, optimal keyboard for the english language is created and compared directly to QWERTY. The keyboard is generated using Node.js by reading specified text files, developing a markov chain, and using letter-to-letter trends to algorithmically design the key layout. In the end, my keyboard performed with 124% QWERTY's efficiency.",
    links: [
      {
        github: "https://github.com/blakesanie/Qwerty-Revisited",
      },
    ],
    youtube: "https://www.youtube.com/embed/hBg4gOlOH6w",
    techUsed: ["Node.js", "Project Gutenburg"],
  },
  {
    name: "Trending Twitter Links",
    desc: "A full-stack project using Node.js and jQuery. The back-end listens to Twitter's stream of incoming tweets. The program continuously parses them for URLs, and algorithmically tracks their popularity. Popular links are sent to the front-end with an API using the Express framework. On the website, users can interact with the moment's most trending links on Twitter",
    links: [
      {
        github: "https://github.com/blakesanie/Trending-Twitter-Links",
      },
    ],
    imageUrl: TrendingTwitterImage,
    techUsed: ["Node.js", "Twitter Developers"],
  },
  {
    name: "Proximity",
    desc: "A map application like no other. It uses iPhone's GPS, gyroscope, and a connection to Google's Places API to locate and identify locations within a certain radius of the user's current position. Then, when you select one of these locations, its relative direction and distance are projected over the device's live camera feed, effectively tracking the location in real time.",
    links: [
      {
        github: "https://github.com/blakesanie/Proximity",
      },
    ],
    imageUrl: ProximityImage,
    techUsed: ["Swift", "Xcode", "Places API", "App Store Connect"],
  },
  {
    name: "Bounce",
    desc: "A simple arcade game app for casual players of all ages. The game's objective is to protect the black square from the red balls at all times. Strategically orient the square in order to ricochet the blue ball into the red, pushing it away from the square. If the red ball ever touches the square, one of the three lives is lost. How long will you last?",
    links: [
      {
        github: "https://github.com/blakesanie/Bounce",
      },
    ],
    imageUrl: BounceImage,
    techUsed: ["Swift", "Xcode", "GameKit", "App Store Connect"],
  },
];

export default function CS(props) {
  return (
    <HeaderAndFooter>
      <NextSeo title="Blake Sanie - Projects" />
      <div className={`content ${styles.cs}`}>
        <h1>Projects</h1>
        {projects.map((project, i) => {
          return (
            <div className={styles.project} key={i}>
              <div className={styles.info}>
                <h2>{project.name}</h2>
                <h3>{project.desc}</h3>
                <TechUsed techUsed={project.techUsed || []} />
                <div className={styles.linksContainer}>
                  {project.links.map((link) => {
                    if (link.github) {
                      return (
                        <a
                          href={link.github}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.github}
                          style={{
                            backgroundImage: `url("../images/cs/techUsed/Github.png")`,
                          }}
                        >
                          View on
                        </a>
                      );
                    }
                    return (
                      <a
                        href={link.url}
                        target={link.external === true ? "_blank" : "_self"}
                      >
                        {link.text}
                      </a>
                    );
                  })}
                </div>
              </div>
              {project.youtube ? (
                <iframe
                  title={project.name}
                  src={project.youtube}
                  frameborder="0"
                  allow="autoplay; encrypted-media"
                  allowfullscreen="allowfullscreen"
                  className={`${styles.youtube} ${styles.image}`}
                  style={{
                    minHeight: 300,
                  }}
                ></iframe>
              ) : (
                <div className={styles.imageContainer}>
                  <Image
                    src={project.imageUrl}
                    className={styles.image}
                    alt={project.name}
                    layout="fill"
                    loading="eager"
                    objectFit="contain"
                    quality={75}
                    priority={i < 3}
                  ></Image>
                </div>
              )}
            </div>
          );
        })}
        <Copyright />
      </div>
    </HeaderAndFooter>
  );
}
