import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import files from "../../extras/photo/filenames.js";
console.log("files", files);
import Masonry from "react-masonry-component";
import Copyright from "../../components/Copyright";
import HeaderAndFooter from "../../components/HeaderAndFooter/index.js";
import styles from "./index.module.css";
import { NextSeo } from "next-seo";
import Head from "next/head";
import Image, { myLoader } from "../../components/Image";
import { use100vh } from "react-div-100vh";
import { useRouter } from "next/router";

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

const filenames = Object.keys(files);
shuffleArray(filenames);

let minLat = Infinity;
let minLng = Infinity;
let maxLat = -Infinity;
let maxLng = -Infinity;
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
const gutter = 10;

let imageResizeFunction;

const fullScreenPadding = 10;

export default function Photo(props) {
  const backButtonElement = useRef(null);
  const leftHalfElement = useRef(null);
  const rightHalfElement = useRef(null);
  const fullScreenElement = useRef(null);
  const scrollForLocationElement = useRef(null);

  const windowHeight = use100vh();

  const getImageWidth = useCallback((window) => {
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
  });

  const [width, setWidth] = useState(getImageWidth());
  const [selectedPhoto, setSelectedPhoto] = useState(undefined);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const [fullImageLeftAndSize, setFullImageLeftAndSize] = useState([true, 0]);
  // const [fullScreenLoading, setFullScreenLoading] = useState(true);

  const router = useRouter();

  let mapMode;

  if (router.asPath.includes("?map=") && router.query.map) {
    mapMode = true;
  } else if (!router.asPath.includes("?map=") && !router.query.map) {
    mapMode = false;
  }
  // the above works, dont touch

  const [selectedFilename, selectedFile, selectedAspectRatio] = useMemo(() => {
    console.log("new selected photo");
    const filename = filenames[selectedPhoto];
    const file = files[filename] || undefined;
    const ratio = file ? file.height / file.width : undefined;
    if (ratio) {
      window.removeEventListener("resize", imageResizeFunction);
      imageResizeFunction = () => {
        setFullImageLeftAndSize(calculateFullSizeLayout(ratio));
      };
      window.addEventListener("resize", imageResizeFunction);
      imageResizeFunction();
    }
    return [filename, file, ratio];
  }, [selectedPhoto]);

  console.log("aspect from outside", selectedAspectRatio);

  const handleResize = (window) => {
    setWidth(getImageWidth(window));
    // console.log("aspect ratio 1", selectedAspectRatio);
    // if (selectedAspectRatio) {
    //   console.log("new aspect ratio", selectedAspectRatio);
    //   setCaptionLeft(imageCaptionLeft(selectedAspectRatio));
    // }
  };

  const handleKeydown = useCallback((event) => {
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
  }, []);

  const disableScroll = useCallback((event) => {
    document.body.style.overflow = "hidden";
  }, []);

  const enableScroll = useCallback((event) => {
    document.body.style.overflow = "auto";
  }, []);

  useEffect(() => {
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
    // setFullScreenLoading(true);
    setSelectedPhoto(i);
  };

  useEffect(() => {
    function recurse() {
      let width = window.innerWidth;
      if (width > 800) {
        width -= 220;
      }
      const zoom = Math.floor(1.73 * Math.log(width) - 9.26);
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
              // setSelectedPhotoWithLoading(i);
            }
            function showPreview() {
              let img = document.createElement("img");
              img.src = myLoader({
                src: `/images/portfolio/${name}.${ext}`,
                width: 384,
                quality: 75,
              });
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
        setTimeout(recurse, 300);
      }
    }
    recurse();
  }, [selectedPhoto]);

  const prevImage = useCallback(() => {
    if (selectedPhoto > 0) {
      setSelectedPhotoWithLoading(selectedPhoto - 1);
    }
  });

  const nextImage = useCallback(() => {
    if (selectedPhoto < filenames.length - 1) {
      setSelectedPhotoWithLoading(selectedPhoto + 1);
    }
  });

  const [captionLeft, fullSizeWidth] = fullImageLeftAndSize;

  const FullScreenImageComponent = useMemo(() => {
    if (!selectedFilename) {
      return null;
    }
    return (
      <Image
        src={`/images/portfolio/${selectedFilename}`}
        // sizes={
        //   Math.min(
        //     2000,
        //     Math.round(
        //       (2000 * files[filenames[selectedPhoto]].width) /
        //         files[filenames[selectedPhoto]].height
        //     ) * 0.5
        //   ) + "px"
        // }
        height={Math.min(1200, selectedAspectRatio * 900)}
        width={Math.min(1200, selectedAspectRatio * 900)}
        layout="responsive"
        // className={fullScreenLoading ? styles.loading : ""}
        onLoad={() => {
          // setFullScreenLoading(false);
        }}
        blurry
      />
    );
  }, [selectedFile]);

  return (
    <HeaderAndFooter headerColor="#f8f8f8dd" className="lightBackground">
      <Head>
        <script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyACmDd88Pi1CAoU8Q4keEPKzc1RzqIkCuw&v=3.exp"
          async
        ></script>
      </Head>
      <NextSeo
        title="Photography"
        description="My vast portfolio of primarily landscape images captured since 2014."
        additionalMetaTags={[
          {
            name: "theme-color",
            content: "rgb(249,249,249)",
          },
        ]}
      />
      <style jsx global>{`
        header * {
          color: #000 !important;
        }
        #myName {
          border-color: #00000040 !important;
        }
        #hamburger > div {
          background-color: black !important;
        }
        #madeBy img {
          filter: none !important;
        }
        #nowPlaying {
          background-color: white;
          border: 2px solid rgba(0, 0, 0, 0.1);
        }
        #spotifyBg {
          background-color: white;
        }
      `}</style>
      <div className={`content ${styles.photo}`}>
        <h1>Photography</h1>
        <h2>
          My enthusiasm for capturing photographs lends me a creative release
          from my logical, algorithmic side. It also enables me to truly admire
          the compositional beauty in front of my eyes every day, from San
          Francisco, to Venice, to my own backyard.
        </h2>
        {mapMode === undefined ? null : (
          <>
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
                  checked={mapMode}
                  onChange={(e) => {
                    router.push(
                      "/photo" + (e.target.checked ? "/?map=true" : ""),
                      undefined,
                      { shallow: true }
                    );
                    // setMapMode(e.target.checked);
                  }}
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
                  opacity: 0.3,
                }}
              >
                Not all images are geotagged
              </p>
            </div>
            {width > 0 && (
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
                      key={filename}
                    >
                      <GalleryImage filename={filename} width={width} />

                      {files[filename].gps.length ? (
                        <svg
                          viewBox="0 0 413.099 413.099"
                          className={styles.pinIcon}
                        >
                          <g>
                            <path
                              d="M206.549,0L206.549,0c-82.6,0-149.3,66.7-149.3,149.3c0,28.8,9.2,56.3,22,78.899l97.3,168.399c6.1,11,18.4,16.5,30,16.5
                         c11.601,0,23.3-5.5,30-16.5l97.3-168.299c12.9-22.601,22-49.601,22-78.901C355.849,66.8,289.149,0,206.549,0z M206.549,193.4
                         c-30,0-54.5-24.5-54.5-54.5s24.5-54.5,54.5-54.5s54.5,24.5,54.5,54.5C261.049,169,236.549,193.4,206.549,193.4z"
                            />
                          </g>
                        </svg>
                      ) : null}
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
            )}
            <div
              className={`${styles.fullScreen} ${
                !selectedFile ? "invisible" : ""
              }`}
              style={{
                padding: fullScreenPadding,
              }}
              ref={fullScreenElement}
            >
              {selectedFile && (
                <div
                  className={styles.fullScreenImage}
                  style={{
                    // height: windowHeight - 20,
                    flexDirection: captionLeft ? "row" : "column",
                  }}
                >
                  <>
                    <div className={styles.imageCaption}>
                      <p>{selectedFilename.split(".")[0]}</p>
                    </div>
                    <div
                      className={styles.imageComponent}
                      style={{
                        width: fullSizeWidth,
                        height: fullSizeWidth * selectedAspectRatio,
                      }}
                    >
                      {FullScreenImageComponent}
                    </div>
                  </>
                </div>
              )}
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
                  ></Image>
                </div>
              </div>
              <div
                className={styles.half + " " + styles.rightHalf}
                onClick={nextImage}
                ref={rightHalfElement}
                style={{
                  display:
                    selectedPhoto == filenames.length - 1 ? "none" : "flex",
                }}
              >
                <div className={styles.scrubButton}>
                  <Image
                    src="/images/left_arrow.png"
                    width="10"
                    height="20"
                    layout="fixed"
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
              {/* {selectedPhoto !== undefined &&
              files[filenames[selectedPhoto]].gps.length ? (
                <div
                  id="map"
                  style={{
                    width: "100%",
                    height: `7000px`,
                    maxHeight: windowHeight - 20,
                    marginBottom: "env(safe-area-inset-bottom)",
                  }}
                ></div>
              ) : null} */}
            </div>
            <Copyright
              links={[
                {
                  url: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
                  title: "Photo License",
                },
              ]}
            />
          </>
        )}
      </div>
    </HeaderAndFooter>
  );
}

function calculateFullSizeLayout(aspectRatio) {
  // aspectRatio = height / width
  const captionWidth = 300;
  const captionHeight = 100;

  const windowWidth = window.innerWidth - 2 * fullScreenPadding;
  const windowHeight = window.innerHeight - 2 * fullScreenPadding;

  // assume left
  const leftUsableWidth = windowWidth - captionWidth;
  const leftUsableHeight = windowHeight;
  // assume top
  const topUsableWidth = windowWidth;
  const topUsableHeight = windowHeight - captionHeight;
  // compute image size for each, and choose larger
  let leftBestHeight = Math.min(
    leftUsableWidth,
    leftUsableHeight / aspectRatio
  ); // actually width measurement
  let topBestHeight = Math.min(topUsableWidth, topUsableHeight / aspectRatio);

  return [
    leftBestHeight > topBestHeight,
    Math.max(leftBestHeight, topBestHeight),
  ];
}

function GalleryImage({ filename, width }) {
  // const [loaded, setLoaded] = useState(false);

  return (
    <>
      <div
        style={{
          // position: "static",
          width: "100%",
          // paddingBottom: loaded
          //   ? 0
          //   : `${
          //       (files[filename]["height"] / files[filename]["width"]) * 100
          //     }%`,
          height:
            (width / files[filename]["width"]) * files[filename]["height"] +
            "px",
          // background: "gold",
        }}
        className={styles.aspectRatio}
      >
        <Image
          src={`/images/portfolio/${filename}`}
          height={Math.round(
            (250 / files[filename]["width"]) * files[filename]["height"]
          )}
          width={250}
          // sizes="640px"
          layout="fixed"
          onLoad={() => {
            // setLoaded(true);
          }}
          blurry
        />
      </div>
    </>
  );
}
