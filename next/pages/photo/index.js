import React, { useState, useEffect } from "react";
import filenames from "./filenames.js";
import Masonry from "react-masonry-component";
import Copyright from "../../components/Copyright";
import HeaderAndFooter from "../../components/HeaderAndFooter/index.js";
import styles from "./index.module.css";

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
  const gutter = 14;

  const [windowDim, setWindowDim] = useState({
    width: undefined,
    height: undefined,
  });

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

  const handleResize = (window) => {
    setWidth(getImageWidth(window));
  };

  useEffect(() => {
    setWindowDim({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    console.log("set window dim");
    handleResize(window);
    window.addEventListener("resize", () => {
      handleResize(window);
    });
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
      <div className={`content ${styles.photo}`}>
        <h1>Photo</h1>
        <Masonry
          className={`masonry ${styles.masonry}`} // default ''
          elementType={"div"} // default 'div'
          options={{
            transitionDuration: 200,
            gutter: gutter,
          }} // default {}
          disableImagesLoaded={true} // default false
          updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
        >
          {filenames.map((filename, i) => {
            return (
              <img
                key={filename}
                alt="Copyright Blake Sanie"
                src={`/images/thumbnails/${filename}`}
                style={{
                  marginBottom: gutter,
                  width: width,
                }}
                onClick={() => {
                  setSelectedPhoto(i);
                }}
              ></img>
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
          <div
            className={styles.fullScreenImage}
            style={{
              backgroundImage: `url("/images/full/${filenames[selectedPhoto]}")`,
            }}
          ></div>
          <div className={styles.half} onClick={prevImage}></div>
          <div className={styles.half} onClick={nextImage}></div>
          <p
            className={styles.exit}
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
