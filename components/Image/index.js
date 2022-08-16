import Image from "next/image";
import { useState, useEffect } from "react";

export default function MyImage(props) {
  const [blurry, setBlurry] = useState();

  useEffect(() => {
    if (props.blurry) {
      const img = document.createElement("img");
      img.addEventListener("load", () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        setBlurry(canvas.toDataURL("image/webp"));
        if (props.onLoad) props.onLoad();
      });
      const smallUrl = myLoader({ src: props.src, width: 32, quality: 75 });
      img.src = smallUrl;
    }
  }, []);

  return (
    <Image
      loader={myLoader}
      {...(blurry && { placeholder: "blur", blurDataURL: blurry })}
      {...props}
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
