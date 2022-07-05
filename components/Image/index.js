import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function MyImage(props) {
  const [blurry, setBlurry] = useState();
  //   const [img, setImg] = useState();
  const imgRef = useRef();

  //   useEffect(() => {
  //     if (props.blurry) {
  //       const img1 = (

  //       );
  //       setImg(img1);
  //     }
  //   }, []);

  if (!imgRef.current && props.blurry && !blurry) {
    return (
      <img
        loading="lazy"
        ref={imgRef}
        onLoad={() => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = imgRef.current.width;
          canvas.height = imgRef.current.height;
          ctx.drawImage(imgRef.current, 0, 0);
          setBlurry(canvas.toDataURL("image/webp"));
          if (props.onLoad) props.onLoad();
        }}
        src={myLoader({ src: props.src, width: 32, quality: 75 })}
        style={{
          opacity: 0,
          transform: "scale(0.1)",
        }}
      />
    );
  }

  return (
    <Image
      loader={myLoader}
      {...(blurry && { placeholder: "blur", blurDataURL: blurry })}
      {...props}
      onLoad={(e) => {
        if (props.onLoad) props.onLoad(e);
        if (imgRef.current) imgRef.current.delete();
      }}
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
