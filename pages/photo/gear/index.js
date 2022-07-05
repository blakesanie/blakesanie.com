import React from "react";
import styles from "./index.module.css";
import Copyright from "../../../components/Copyright";
import HeaderAndFooter from "../../../components/HeaderAndFooter";
import { NextSeo } from "next-seo";
import Image from "../../../components/Image";

export async function getStaticProps({ params }) {
  return {
    props: {
      data: [
        {
          name: "Sony a7",
          imageUrl: "sonya7.jpg",
        },
        {
          name: "Sony E 28-70 OSS",
          imageUrl: "28-70.jpg",
        },
        {
          name: "Rokinon 24mm f/2.8",
          imageUrl: "24.jpg",
        },
        {
          name: "Helios 44-2",
          imageUrl: "helios442.jpg",
        },
        {
          name: "Nikon D3200",
          imageUrl: "d3200.jpg",
        },
        {
          name: "Nikkor 18-105 VR",
          imageUrl: "18-105.jpg",
        },
        {
          name: "Nikkor 35mm 1.8 G",
          imageUrl: "35.jpg",
        },
        {
          name: "Joby GorillaPod",
          imageUrl: "joby.jpg",
        },
        {
          name: "Macbook Pro",
          imageUrl: "macbook.jpg",
        },
        {
          name: "iPhone XS",
          imageUrl: "iphone.jpg",
        },
        {
          name: "Adobe Lightroom",
          imageUrl: "lr.jpg",
        },
        {
          name: "iPad Pro",
          imageUrl: "ipad.jpg",
        },
        {
          name: "Pixelmator Photo",
          imageUrl: "pixelmator.jpg",
        },
      ],
    },
  };
}

export default function Gear(props) {
  return (
    <HeaderAndFooter>
      <NextSeo
        title="Photo Gear"
        description="My collection of photography equipment and tools used to aid me with my advanced captures."
      />
      <div className={`content ${styles.gear}`}>
        <h1>Gear</h1>
        <div className={styles.gearContainer}>
          {props.data.map((item) => {
            return (
              <a key={item.name} className={styles.product}>
                <h2>{item.name}</h2>
                <div className={styles.imgWrapper}>
                  <Image
                    src={`/images/gear/${item.imageUrl}`}
                    alt={item.name}
                    height={200}
                    width={500}
                    layout="fixed"
                    blurry
                  ></Image>
                </div>
              </a>
            );
          })}
        </div>
        <Copyright />
      </div>
    </HeaderAndFooter>
  );
}
