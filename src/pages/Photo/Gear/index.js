import React from "react";
import "./styles.css";
import { Helmet } from "react-helmet";
import Copyright from "../../../Copyright";

const data = [
  {
    name: "Sony a7",
    imageUrl: "sonya7.jpg",
    url: "/",
  },
  {
    name: "Sony E 28-70 OSS",
    imageUrl: "28-70.jpg",
    url: "/",
  },
  {
    name: "Rokinon 24mm f/2.8",
    imageUrl: "24.jpg",
    url: "/",
  },
  {
    name: "Helios 44-2",
    imageUrl: "helios442.jpg",
    url: "/",
  },
  {
    name: "Nikon D3200",
    imageUrl: "d3200.jpg",
    url: "/",
  },
  {
    name: "Nikkor 18-105 VR",
    imageUrl: "18-105.jpg",
    url: "/",
  },
  {
    name: "Nikkor 35mm 1.8 G",
    imageUrl: "35.jpg",
    url: "/",
  },
  {
    name: "Joby GorillaPod",
    imageUrl: "joby.jpg",
    url: "/",
  },
  {
    name: "Macbook Pro",
    imageUrl: "macbook.jpg",
    url: "/",
  },
  {
    name: "iPhone XS",
    imageUrl: "iphone.jpg",
    url: "/",
  },
  {
    name: "Adobe Lightroom",
    imageUrl: "lr.jpg",
    url: "/",
  },
  {
    name: "iPad Pro",
    imageUrl: "ipad.jpg",
    url: "/",
  },
  {
    name: "Pixelmator Photo",
    imageUrl: "pixelmator.jpg",
    url: "/",
  },
];

export default function Gear(props) {
  return (
    <div className="content gear">
      <Helmet>
        <title>Gear | Blake Sanie</title>
        <meta
          name="description"
          content="My complete photography arsenal, from field to post-processing."
        />
      </Helmet>
      <h1>Gear</h1>
      <div className="gearContainer">
        {data.map((item) => {
          return (
            <a
              key={item.name}
              className="product"
              href={item.url}
              target="_blank"
              rel="noreferrer"
            >
              <h2>{item.name}</h2>
              <img src={`/images/gear/${item.imageUrl}`} alt={item.name}></img>
            </a>
          );
        })}
      </div>
      <Copyright />
    </div>
  );
}
