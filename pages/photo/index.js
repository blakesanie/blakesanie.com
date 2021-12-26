import React, { useState, useEffect, useRef } from "react";
import files from "../../extras/photo/filenames.js";
import Masonry from "react-masonry-component";
import Copyright from "../../components/Copyright";
import HeaderAndFooter from "../../components/HeaderAndFooter/index.js";
import styles from "./index.module.css";
import { NextSeo } from "next-seo";
import Head from "next/head";
import Image from "next/image";
import imageLoader from "../../extras/imageLoader";
import { use100vh } from "react-div-100vh";

var didShuffle = false;

const filenames = Object.keys(files);

let minLat = Infinity;
let minLng = Infinity;
let maxLat = -Infinity;
let maxLng = -Infinity;
console.log(Object.values(files));
for (const metadata of Object.values(files)) {
  const { gps } = metadata;
  if (gps.length) {
    const [lat, lng] = gps;
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  }
}

let infoWindow;
let canHover = false;

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
  const fullScreenElement = useRef(null);
  const scrollForLocationElement = useRef(null);

  const windowHeight = use100vh();

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
  const [fullScreenLoading, setFullScreenLoading] = useState(true);
  const [mapMode, setMapMode] = useState(false);

  const handleResize = (window) => {
    setWidth(getImageWidth(window));
  };

  const handleKeydown = (event) => {
    const fullScreenOpen =
      fullScreenElement.current !== null &&
      !fullScreenElement.current.classList.contains("invisible");
    if (event.key == "Escape") {
      event.preventDefault();
      backButtonElement.current.click();
    } else if (event.key == "ArrowRight") {
      event.preventDefault();
      rightHalfElement.current.click();
    } else if (event.key == "ArrowLeft") {
      event.preventDefault();
      leftHalfElement.current.click();
    } else if (event.key == "ArrowUp") {
      if (fullScreenOpen) {
        event.preventDefault();
        fullScreenElement.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } else if (event.key == "ArrowDown") {
      if (fullScreenOpen) {
        event.preventDefault();
        scrollForLocationElement.current.click();
      }
    }
  };

  const disableScroll = (event) => {
    document.body.style.overflow = "hidden";
  };

  const enableScroll = (event) => {
    document.body.style.overflow = "auto";
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
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  const setSelectedPhotoWithLoading = (i) => {
    setFullScreenLoading(true);
    setSelectedPhoto(i);
  };

  useEffect(() => {
    function recurse() {
      console.log(minLat, maxLat, minLng, maxLng);
      let width = window.innerWidth;
      if (width > 800) {
        width -= 220;
      }
      const zoom = Math.floor(1.73 * Math.log(width) - 9.26);
      console.log("using zoom", zoom);
      try {
        const map = new google.maps.Map(
          document.getElementById("fullScreenMap"),

          {
            center: { lat: (maxLat + minLat) / 2, lng: (maxLng + minLng) / 2 },
            zoom: zoom,
            zoomControl: true,
            zoomControlOptions: {
              position: google.maps.ControlPosition.RIGHT_CENTER,
            },
            streetViewControl: true,
            streetViewControlOptions: {
              position: google.maps.ControlPosition.RIGHT_CENTER,
            },
            fullscreenControl: true,
            fullscreenControlOptions: {
              position: google.maps.ControlPosition.RIGHT_CENTER,
            },
            rotateControl: true,
            rotateControlOptions: {
              position: google.maps.ControlPosition.RIGHT_CENTER,
            },
          }
        );
        infoWindow = new google.maps.InfoWindow();
        for (let i = 0; i < filenames.length; i++) {
          const filename = filenames[i];
          const { gps } = files[filename];
          if (gps.length) {
            const [lat, lng] = gps;
            const [name, ext] = filename.split(".");
            const marker = new google.maps.Marker({
              position: { lat: lat, lng: lng },
              map: map,
            });
            function openFullScreen() {
              setSelectedPhotoWithLoading(i);
            }
            function showPreview() {
              let img = document.createElement("img");
              img.src = `/optimized/images/portfolio/${name}_w=384&q=75.${ext}`;
              img.addEventListener("click", (e) => {
                e.stopPropagation();
                openFullScreen();
              });
              img.style.width = "192px";
              img.style.marginBottom = "-10px";
              img.style.cursor = "pointer";

              // infoWindow.close();
              infoWindow.setContent(img);
              infoWindow.open(marker.getMap(), marker);
            }
            marker.addListener("mouseover", function () {
              canHover = true;
              showPreview();
            });
            marker.addListener("mouseout", function () {
              if (canHover) {
                infoWindow.close();
              }
            });
            marker.addListener("click", (e) => {
              e.domEvent.stopPropagation();
              if (canHover) {
                openFullScreen(e);
              } else {
                showPreview();
              }
            });
          }
        }
      } catch (e) {
        console.log(e, "will try again in 0.2s");
        setTimeout(recurse, 200);
      }
    }
    recurse();
  }, []);

  useEffect(() => {
    function recurse() {
      try {
        if (selectedPhoto !== undefined) {
          if (files[filenames[selectedPhoto]].gps.length) {
            const [lat, lng] = files[filenames[selectedPhoto]].gps;
            const map = new google.maps.Map(document.getElementById("map"), {
              center: { lat: lat, lng: lng },
              zoom: 15,
              zoomControl: true,
              zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER,
              },
              streetViewControl: true,
              streetViewControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER,
              },
              fullscreenControl: true,
              fullscreenControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER,
              },
              rotateControl: true,
              rotateControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER,
              },
            });
            const infoWindow = new google.maps.InfoWindow();
            const marker = new google.maps.Marker({
              position: { lat: lat, lng: lng },
              map: map,
            });
            marker.addListener("click", () => {
              infoWindow.close();
              infoWindow.setContent(`<p>${lat}, ${lng}</p>`);
              infoWindow.open(marker.getMap(), marker);
            });
          }
        }
      } catch (e) {
        console.log(e, "trying again in .3 seconds");
        setTimeout(recurse, 300);
      }
    }
    recurse();
  }, [selectedPhoto]);

  const prevImage = () => {
    if (selectedPhoto > 0) {
      setSelectedPhotoWithLoading(selectedPhoto - 1);
    }
  };

  const nextImage = () => {
    if (selectedPhoto < filenames.length - 1) {
      setSelectedPhotoWithLoading(selectedPhoto + 1);
    }
  };

  return (
    <HeaderAndFooter
      style={
        {
          // height: windowHeight,
        }
      }
    >
      <Head>
        <script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyACmDd88Pi1CAoU8Q4keEPKzc1RzqIkCuw&v=3.exp"
          async
        ></script>
      </Head>
      <NextSeo
        title="Blake Sanie - Photography"
        description="My vast portfolio of primarily landscape images captured since 2014."
        openGraph
      />
      <div className={`content ${styles.photo}`}>
        <h1>Photography</h1>
        <div className={styles.modeControl}>
          <p
            style={{
              opacity: mapMode ? 0.3 : 1,
            }}
          >
            Gallery
          </p>
          <label className={styles.switch}>
            <input
              type="checkbox"
              value={mapMode}
              onChange={(e) => setMapMode(e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
          <p
            style={{
              opacity: mapMode ? 1 : 0.3,
            }}
          >
            Map
          </p>
        </div>

        <div
          style={{
            width: "100%",
            height: `7000px`,
            maxHeight: windowHeight - 110,
            marginBottom: "env(safe-area-inset-bottom)",
            display: mapMode ? "block" : "none",
          }}
        >
          <div
            id="fullScreenMap"
            style={{
              width: "100%",
              height: "100%",
            }}
            onClick={() => {
              infoWindow.close();
            }}
          ></div>
          <p
            style={{
              position: "absolute",
              top: -18,
              width: "100%",
              textAlign: "center",
              fontSize: 12,
              opacity: 0.4,
            }}
          >
            Not all images are geotagged
          </p>
        </div>

        <Masonry
          className={`masonry ${styles.masonry} ${
            mapMode ? styles.masonryHidden : ""
          }`} // default ''
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
                  disableScroll();
                  setSelectedPhotoWithLoading(i);
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
          ref={fullScreenElement}
        >
          <div
            className={styles.fullScreenImage}
            style={
              {
                // height: windowHeight - 20,
              }
            }
          >
            {selectedPhoto == undefined ? null : (
              <Image
                src={`/images/portfolio/${filenames[selectedPhoto]}`}
                layout="fill"
                objectFit="contain"
                loader={imageLoader}
                // className={fullScreenLoading ? styles.loading : ""}
                onLoad={() => {
                  setFullScreenLoading(false);
                }}
              />
            )}
            <div
              className={styles.loader}
              style={{
                opacity: fullScreenLoading ? 1 : 0,
              }}
            />
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
            className={styles.half + " " + styles.rightHalf}
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
              enableScroll();
              setSelectedPhotoWithLoading(undefined);
            }}
          >
            Esc
          </p>
          {selectedPhoto !== undefined &&
          files[filenames[selectedPhoto]].gps.length ? (
            <div className={styles.metadata}>
              <p
                className={styles.scrollForLocation}
                ref={scrollForLocationElement}
                style={{
                  opacity: fullScreenLoading ? 0 : 1,
                }}
                onClick={() => {
                  fullScreenElement.current.scrollTo({
                    top: fullScreenElement.current.scrollHeight,
                    behavior: "smooth",
                  });
                }}
              >
                ↓ Scroll for Capture Location ↓
              </p>
              <div
                id="map"
                style={{
                  width: "100%",
                  height: `7000px`,
                  maxHeight: windowHeight - 20,
                  marginBottom: "env(safe-area-inset-bottom)",
                }}
              ></div>
            </div>
          ) : null}
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
