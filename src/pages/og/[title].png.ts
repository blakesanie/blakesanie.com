import type { APIRoute } from 'astro';
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "fs";

const font = fs.readFileSync(
  "src/assets/fonts/Assistant/static/Assistant-Regular.ttf"
);
const font2 = fs.readFileSync(
  "src/assets/fonts/Assistant/static/Assistant-SemiBold.ttf"
);

const ogBg = fs.readFileSync("src/assets/photo-portfolio/portfolio2k/ManhattanBridge.jpg");
const b64 = ogBg.toString("base64");

export const GET: APIRoute = async ({ params }) => {
  const title = params.title || 'Blake Sanie';
  
  const svg = await satori(
    {
      type: "div",
      props: {
        children: [
          {
            type: "img",
            props: {
              src: `data:image/jpeg;base64,${b64}`,
              style: {
                transform: `scale(1.2) translate(8%,6%)`,
              },
            },
          },
          {
            type: "div",
            props: {
              children: [
                {
                  type: "div",
                  props: {
                    children: [title],
                    style: {
                      display: "flex",
                    },
                  },
                },
                {
                  type: "div",
                  props: {
                    children: title === "Blake Sanie"
                      ? [
                          "Software Engineer. Photographer.",
                          {
                            type: "div",
                            props: {
                              children: "Ironman. Lifelong Student.",
                            },
                          },
                        ]
                      : "Blake Sanie",
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      fontSize: title === "Blake Sanie" ? 40 : 60,
                      opacity: 0.4,
                      fontWeight: 400,
                    },
                  },
                },
              ],
              style: {
                display: "flex",
                flexDirection: "column",
                position: "absolute",
                top: 50,
                left: 70,
                color: "white",
                fontSize: 120,
                maxWidth: 1200 - 50 * 2,
                fontWeight: 700,
                gap: -8,
              },
            },
          },
        ],
        style: {
          display: "flex",
          background: "black",
          width: "100%",
          height: "100%",
        },
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Assistant",
          data: font,
          weight: 400,
          style: "normal",
        },
        {
          name: "Assistant",
          data: font2,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 1200,
    },
  });
  const pngBuffer = resvg.render().asPng();

  return new Response(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    }
  });
};

export async function getStaticPaths() {
  const pages = import.meta.glob('/src/pages/**/*.{astro,md,mdx}');
  const titles = new Set(['Blake Sanie', 'Photography', 'Projects', 'Blog', 'Press', 'Resume', 'Distortion', 'Aero']);
  
  for (const path of Object.keys(pages)) {
    const filename = path.split('/').pop() || '';
    if (filename.startsWith('_') || filename.startsWith('[') || filename === '404.astro') continue;
    
    let name = filename.split('.')[0];
    if (name === 'index') {
      const parts = path.split('/');
      name = parts[parts.length - 2];
    }
    
    if (name && name !== 'pages' && name !== 'src') {
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
      titles.add(formattedName);
    }
  }

  return Array.from(titles).map(title => ({ params: { title } }));
}
