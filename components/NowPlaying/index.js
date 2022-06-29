import { useState, useEffect, useMemo, useRef } from "react";
import styles from "./index.module.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Carousel(props) {
  const children = [];
  for (var i = 0; i < 8; i++) {
    children.push(props.children);
  }

  return (
    <div className={styles.carousel}>
      <div className={styles.slidingWindow}>{children}</div>
    </div>
  );
}

function useOnScreen(ref, rootMargin = "0px", once = false) {
  const [isIntersecting, setIntersecting] = useState(false);
  const [observerKilled, setObserverKilled] = useState(false);
  // console.log("onscreen ref", ref);
  const observer = useMemo(() => {
    try {
      return new IntersectionObserver(
        ([entry]) => {
          // console.log("onscreen SHOWING");
          console.log("onscreen entry", entry);
          if (once && entry.isIntersecting) {
            observer.disconnect();
            setObserverKilled(true);
          }
          setIntersecting(entry.isIntersecting);
        },
        {
          root: document.getElementsByTagName("header")[0],
          rootMargin: rootMargin,
        }
      );
      console.log("onscreen made observer");
    } catch (e) {
      console.log("onscreen observer not defined");
      return undefined;
    }
  }, [ref.current]);

  useEffect(() => {
    console.log("onscreen observer", observer);
    if (!observer || observerKilled) {
      return;
    }
    observer.observe(ref.current);
    // Remove the observer as soon as the component is unmounted
    return () => {
      observer.disconnect();
    };
  }, [observer, observerKilled]);

  return isIntersecting;
}

export default function nowPlaying(props) {
  const [track, setTrack] = useState();
  const [bars, setBars] = useState([]);
  const rootRef = useRef(null);
  const onScreen = useOnScreen(rootRef, "-100px", true);

  console.log("onscreen", onScreen);

  useEffect(async () => {
    if (onScreen && !track) {
      const res = await fetch(`/api/nowPlaying`);
      const json = await res.json();
      const newBars = [];
      for (let i = 0; i < 16; i++) {
        newBars.push(
          <div
            className={styles.bar}
            style={{
              animationDuration: `${0.8 + Math.random() * 1}s`,
            }}
          ></div>
        );
      }
      setBars(newBars);
      setTrack(json);
    }
  }, [onScreen]);

  if (!track) {
    return (
      <div
        className={`${props.className || ""} ${styles.nowPlaying}`}
        ref={rootRef}
      >
        <Skeleton containerClassName={styles.skeleton} />
      </div>
    );
  }

  return (
    <div
      className={`${props.className || ""} ${styles.nowPlaying}`}
      id="nowPlaying"
    >
      <p className={styles.header}>
        <div className={styles.spotifyIcon}>
          <div className={styles.spotifyBg} />
          <img src="/optimized/images/cs/techUsed/Spotify Developers_w=64&q=75.png" />
        </div>
        {track.live ? "Now Playing" : "Recently Played"}
      </p>
      <div className={styles.row}>
        <img src={track.image} />
        <div className={styles.carousels}>
          <Carousel>
            <p className={styles.artist}>{track.artists.join(", ")}</p>
          </Carousel>
          <Carousel>
            <p className={styles.name}>{track.name}</p>
          </Carousel>
          <Carousel>
            <p className={styles.album}>{track.album}</p>
          </Carousel>
        </div>
      </div>
      <div className={styles.bars}>{bars}</div>
    </div>
  );
}
