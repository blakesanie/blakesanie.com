import Image from "next/image";
import { useState, useEffect } from "react";

export default function MyImage(props) {
  const [blurry, setBlurry] = useState();
  const [src, setSrc] = useState(props.src);

  useEffect(() => {
    // setSrc(props.src);
    if (props.blurry) {
      setSrc(props.src);
      setBlurry(undefined);
      const img = document.createElement("img");
      img.addEventListener("load", () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        // ctx.drawImage(img, 0, 0);
        setBlurry(canvas.toDataURL("image/webp"));
        if (props.backgroundColor) {
          ctx.fillStyle = props.backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.drawImage(img, 0, 0);
        }

        setBlurry(canvas.toDataURL("image/webp"));
        // setSrc(props.src);
        if (props.onLoad) props.onLoad();
      });
      const smallUrl = myLoader({ src: props.src, width: 32, quality: 75 });
      img.src = smallUrl;
    }
  }, [props.src]);

  // useEffect(() => {
  //   setSrc(props.src);
  // }, [props.src])

  if (props.src != src) {
    // setSrc(props.src);
    return null;
  }

  return (
    <Image
      loader={myLoader}
      {...(blurry && { placeholder: "blur", blurDataURL: blurry })}
      {...props}
      src={props.src}
      onLoadingComplete={() => {}}
      // style={{
      //   backgroundColor: props.backgroundColor || "#ddd",
      // }}
    />
  );
}

export function myLoader({ src, width, quality }) {
  const newUrl = `/optimized${src.substring(
    0,
    src.lastIndexOf(".")
  )}_w=${width}&q=${quality || 75}.webp`;
  return newUrl;
}
