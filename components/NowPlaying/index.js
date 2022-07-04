import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import styles from "./index.module.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TwitterApiv2LabsReadWrite from "twitter-api-v2/dist/v2-labs/client.v2.labs.write";
import { IntervalPlus } from "interval-plus";

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

let trackInterval;

export default function nowPlaying(props) {
  const [track, setTrack] = useState();
  const [bars, setBars] = useState([]);
  const rootRef = useRef(null);
  const onScreen = useOnScreen(rootRef, "0px");
  // console.log("onScreen", onScreen);

  const getNowPlaying = useCallback(async () => {
    const res = await fetch(`/api/nowPlaying`);
    const json = await res.json();
    const trackRefreshWait = json.live ? 1000 * 10 : 1000 * 60 * 1;
    setTrack(json);
    if (trackInterval.interval != trackRefreshWait) {
      trackInterval.changeInterval(trackRefreshWait);
    }
  }, []);

  useEffect(async () => {
    if (trackInterval) {
      if (onScreen) {
        trackInterval.resume();
      } else {
        trackInterval.pause();
      }
    } else {
      trackInterval = new IntervalPlus(getNowPlaying, 1000 * 10, {
        immediate: true,
        verbose: true,
        name: "interval-plus Demo",
      });
    }
  }, [onScreen]);

  useEffect(() => {
    document.addEventListener("visibilitychange", async (event) => {
      if (trackInterval) {
        if (document.visibilityState == "visible") {
          trackInterval.resume();
        } else {
          trackInterval.pause();
        }
      }
    });
    window.addEventListener("focus", () => {
      if (trackInterval) trackInterval.resume();
    });
    window.addEventListener("blur", () => {
      if (trackInterval) trackInterval.pause();
    });
  }, []);

  useEffect(() => {
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
  }, []);

  const carousels = useMemo(() => {
    if (!track) return;
    return (
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
    );
  }, [track]);

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
            {carousels}
          </div>
          <div className={styles.bars}>{bars}</div>
        </>
      )}
    </a>
  );
}
