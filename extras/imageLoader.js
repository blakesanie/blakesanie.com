const browserSupportsWebp = () => {
  return window.navigator;
};

export default function myLoader({ src, width, quality }) {
  console.log(src);
  const newUrl = `/optimized${src.substring(
    0,
    src.lastIndexOf(".")
  )}_w=${width}&q=${quality || 75}.${src.substring(src.lastIndexOf(".") + 1)}`;
  console.log(newUrl);
  return newUrl;
}
