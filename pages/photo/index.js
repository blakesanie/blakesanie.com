import React, { useState, useEffect, useRef } from "react";
import filenames from "../../extras/photo/filenames.js";
import Masonry from "react-masonry-component";
import Copyright from "../../components/Copyright";
import HeaderAndFooter from "../../components/HeaderAndFooter/index.js";
import styles from "./index.module.css";
import { NextSeo } from "next-seo";
import Image from "next/image";
import imageLoader from "../../extras/imageLoader";

var didShuffle = false;

export default function Photo(props) {
  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }
  if (!didShuffle) {
    shuffleArray(filenames);
    didShuffle = true;
  }
  const gutter = 10;

  const [windowDim, setWindowDim] = useState({
    width: undefined,
    height: undefined,
  });

  const backButtonElement = useRef(null);
  const leftHalfElement = useRef(null);
  const rightHalfElement = useRef(null);

  const getImageWidth = (window) => {
    if (!window) {
      return 0;
    }
    let contentWidth = window.innerWidth;
    if (contentWidth > 800 && window.innerHeight < 1200) {
      contentWidth -= 220;
    }
    let usableWidth = contentWidth - 40 * 2;
    if (window.innerWidth <= 800) {
      usableWidth = contentWidth - 2 * gutter;
    }
    let numCols = Math.floor(Math.pow(usableWidth, 0.6) / 18);
    return usableWidth / numCols - (gutter * (numCols - 1)) / numCols;
  };

  const [width, setWidth] = useState(getImageWidth());
  const [selectedPhoto, setSelectedPhoto] = useState(undefined);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const handleResize = (window) => {
    setWidth(getImageWidth(window));
  };

  const handleKeydown = (event) => {
    if (event.key == "Escape") {
      backButtonElement.current.click();
    } else if (event.key == "ArrowRight") {
      rightHalfElement.current.click();
    } else if (event.key == "ArrowLeft") {
      leftHalfElement.current.click();
    }
  };

  useEffect(() => {
    setWindowDim({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    handleResize(window);
    window.addEventListener("resize", () => {
      handleResize(window);
    });
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const prevImage = () => {
    if (selectedPhoto > 0) {
      setSelectedPhoto(selectedPhoto - 1);
    }
  };

  const nextImage = () => {
    if (selectedPhoto < filenames.length - 1) {
      setSelectedPhoto(selectedPhoto + 1);
    }
  };

  return (
    <HeaderAndFooter>
      <NextSeo title="Blake Sanie - Photography" />
      <div className={`content ${styles.photo}`}>
        <h1>Photo</h1>
        <Masonry
          className={`masonry ${styles.masonry}`} // default ''
          elementType={"div"} // default 'div'
          options={{
            transitionDuration: 200,
            gutter: gutter,
          }} // default {}
          disableImagesLoaded={false} // default false
          updateOnEachImageLoad={true} // default false and works only if disableImagesLoaded is false
          onImagesLoaded={() => {
            setImagesLoaded(true);
          }}
        >
          {filenames.map((filename, i) => {
            return (
              <div
                className={styles.imgContainer}
                style={{
                  marginBottom: gutter,
                  width: width,
                }}
                onClick={() => {
                  setSelectedPhoto(i);
                }}
              >
                <Image
                  src={`/images/portfolio/${filename}`}
                  height="450"
                  width="250"
                  layout="fixed"
                  loader={imageLoader}
                  loading="lazy"
                />
              </div>
              // <img
              //   key={filename}
              //   alt="Copyright Blake Sanie"
              //   src={`/images/thumbnails/${filename}`}
              //   style={{
              //     marginBottom: gutter,
              //     width: width,
              //   }}
              //   onClick={() => {
              //     setSelectedPhoto(i);
              //   }}
              // ></img>
            );
          })}
        </Masonry>
        <div
          className={`${styles.fullScreen} ${
            selectedPhoto === undefined ? "invisible" : ""
          }`}
          style={{
            padding: gutter,
          }}
        >
          <div className={styles.fullScreenImage}>
            {selectedPhoto == undefined ? null : (
              <Image
                src={`/images/portfolio/${filenames[selectedPhoto]}`}
                layout="fill"
                objectFit="contain"
                loader={imageLoader}
              />
            )}
          </div>
          <div
            className={styles.half}
            onClick={prevImage}
            style={{
              display: selectedPhoto == 0 ? "none" : "flex",
            }}
            ref={leftHalfElement}
          >
            <div className={styles.scrubButton}>
              <Image
                src="/images/left_arrow.png"
                width="10"
                height="20"
                layout="fixed"
                loader={imageLoader}
              ></Image>
            </div>
          </div>
          <div
            className={styles.half}
            onClick={nextImage}
            ref={rightHalfElement}
            style={{
              display: selectedPhoto == filenames.length - 1 ? "none" : "flex",
            }}
          >
            <div className={styles.scrubButton}>
              <Image
                src="/images/left_arrow.png"
                width="10"
                height="20"
                layout="fixed"
                loader={imageLoader}
              ></Image>
            </div>
          </div>
          <p
            className={styles.exit}
            ref={backButtonElement}
            onClick={() => {
              setSelectedPhoto(undefined);
            }}
          >
            Back
          </p>
        </div>
        <Copyright
          links={[
            {
              url: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
              title: "Photo License",
            },
          ]}
        />
      </div>
    </HeaderAndFooter>
  );
}
