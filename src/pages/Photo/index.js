import React, { useState, useLayoutEffect } from "react";
import "./styles.css";
import filenames from "./filenames.js";
import Masonry from "react-masonry-component";
import { Helmet } from "react-helmet";

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

  const getImageWidth = () => {
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

  const handleResize = () => {
    setWidth(getImageWidth());
  };

  useLayoutEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

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
    <div className="content photo">
      <Helmet>
        <title>Photography | Blake Sanie</title>
        <meta
          name="description"
          content="View my comprehensive photo portfolio, dating back from 2015."
        />
      </Helmet>
      <h1>Photo</h1>
      <Masonry
        className={"masonry"} // default ''
        elementType={"div"} // default 'div'
        options={{
          transitionDuration: 200,
          gutter: gutter,
        }} // default {}
        disableImagesLoaded={false} // default false
        updateOnEachImageLoad={true} // default false and works only if disableImagesLoaded is false
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
        className={`fullScreen ${
          selectedPhoto === undefined ? "invisible" : ""
        }`}
        style={{
          padding: gutter,
        }}
      >
        <div
          className="fullScreenImage"
          style={{
            backgroundImage: `url("/images/full/${filenames[selectedPhoto]}")`,
          }}
        ></div>
        <div className="half" onClick={prevImage}></div>
        <div className="half" onClick={nextImage}></div>
        <p
          className="exit"
          onClick={() => {
            setSelectedPhoto(undefined);
          }}
        >
          Back
        </p>
      </div>
    </div>
  );
}
