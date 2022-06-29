import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
  const observer = useMemo(() => {
    try {
      return new IntersectionObserver(
        ([entry]) => {
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
    } catch (e) {
      return undefined;
    }
  }, [ref.current]);

  useEffect(() => {
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

let trackExp = 0;

let trackResetInterval;

let trackRefreshWaitSeconds;

export default function nowPlaying(props) {
  const [track, setTrack] = useState();
  const [bars, setBars] = useState([]);
  const rootRef = useRef(null);
  const onScreen = useOnScreen(rootRef, "0px");
  // console.log("onScreen", onScreen);

  const getNowPlaying = useCallback(async () => {
    const res = await fetch(`/api/nowPlaying`);
    const json = await res.json();
    trackRefreshWaitSeconds = json.live ? 3 * 60 : 15 * 60;
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
    const now = new Date();
    now.setSeconds(now.getSeconds() + trackRefreshWaitSeconds);
    trackExp = now;
  }, []);

  useEffect(async () => {
    if (onScreen) {
      if (new Date() >= trackExp) {
        // console.log("get immediate track");
        await getNowPlaying();
      }
      trackResetInterval = setInterval(
        getNowPlaying,
        1000 * trackRefreshWaitSeconds
      );
      // console.log("set track interval for 30s");
    } else {
      clearInterval(trackResetInterval);
      trackResetInterval = undefined;
      // console.log("clear track interval");
    }
  }, [onScreen]);

  return (
    <a
      className={`${props.className || ""} ${styles.nowPlaying}`}
      ref={rootRef}
      id="nowPlaying"
      target="_blank"
      href={track?.link}
    >
      {!track ? (
        <Skeleton containerClassName={styles.skeleton} />
      ) : (
        <>
          <p className={styles.header}>
            <div className={styles.spotifyIcon}>
              <div className={styles.spotifyBg} id="spotifyBg" />
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
        </>
      )}
    </a>
  );
}
