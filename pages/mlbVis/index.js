import React, { useState, useEffect } from "react";
import HeaderAndFooter from "../../components/HeaderAndFooter";
import styles from "./index.module.css";
import { NextSeo } from "next-seo";
import Copyright from "../../components/Copyright";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Card({ post }) {
  const titleSplit = post.title.split(" > ");
  return (
    <a
      href={"https://reddit.com" + post.permalink}
      target="_blank"
      className={styles.card}
    >
      <h4>
        {titleSplit[0]}
        {" >"}
        <br />
        {titleSplit[1]}
      </h4>
      {post.caption.map((line, i) => {
        return <h5 key={line}>{line}</h5>;
      })}
      <div
        className={styles.postImage}
        style={{
          backgroundImage: `url('${post.imageUrl}')`,
        }}
      />
      <h5>
        <img
          className={styles.redditLogo}
          src="/optimized/images/mlbVis_w=64&q=75.png"
        />
        By{" "}
        <a href={`https://reddit.com/u/${post.author}`} target="_blank">
          u/{post.author}
        </a>
        <span> | </span>
        {post.ups}↑, {post.downs}↓
      </h5>
    </a>
  );
}

export default function MLBVis(props) {
  const [posts, setPosts] = useState(undefined);

  useEffect(async () => {
    const res = await fetch(`/api/mlbVis`);
    const json = await res.json();
    console.log("posts", json.posts);
    setPosts(
      json.posts.map((post) => {
        const lines = post.title.split(" || ");
        const exclamationIndex = lines[0].lastIndexOf("! ");
        if (exclamationIndex > -1) {
          for (const bit of lines[0]
            .substring(0, exclamationIndex)
            .split("! ")) {
            lines.push(bit);
          }
          lines[0] = lines[0].substring(exclamationIndex + 2);
        }
        if (lines[0].includes(", ")) {
          const split = lines[0].split(", ");
          lines[0] = split[0];
          lines.splice(1, 0, split[1]);
        }
        return {
          ...post,
          title: lines[0],
          caption: lines.slice(1),
        };
      })
    );
  }, []);

  return (
    <HeaderAndFooter headerColor="#004189dd" className="redBorder">
      <NextSeo
        title="MLB Visualization"
        description="An automated subreddit for exploring data-driven storytelling surrounding America's pastime. Not affiliated with MLB."
        additionalMetaTags={[
          {
            name: "theme-color",
            content: "rgb(35, 90, 153)",
          },
        ]}
      />
      <style jsx global>{`
        #hamburger > div {
          background-color: red;
        }
      `}</style>
      <div className={`content ${styles.content}`}>
        <h1>MLB Visualization</h1>
        <h2>
          An automated subreddit for exploring data-driven storytelling
          surrounding America's pastime. Not affiliated with MLB.{" "}
        </h2>
        <h3>
          Recent games below. <span className={styles.red}>View more on</span>{" "}
          <a target="_blank" href="https://reddit.com/r/mlbVis">
            r/mlbVis
          </a>{" "}
          <img
            className={styles.redditLogo}
            src="/optimized/images/cs/techUsed/Reddit_w=64&q=75.png"
          />
        </h3>
        {posts ? (
          posts.map((post) => {
            return <Card post={post} key={post.title} />;
          })
        ) : (
          <>
            <Skeleton containerClassName={styles.skeleton} />
            <Skeleton containerClassName={styles.skeleton} />
            <Skeleton containerClassName={styles.skeleton} />
            <Skeleton containerClassName={styles.skeleton} />
            <Skeleton containerClassName={styles.skeleton} />
            <Skeleton containerClassName={styles.skeleton} />
          </>
        )}
        <Copyright />
      </div>
    </HeaderAndFooter>
  );
}
