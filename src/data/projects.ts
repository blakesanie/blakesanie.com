import { projectSchema, type Project } from "../types/content";

export const projects: Project[] = projectSchema.array().parse([
  {
    title: "Learned Early Exit Network (LeeNet)",
    image: "/src/assets/images/leenet/leenet.png",
    id: "leenet",
    description:
      "A new class of deep neural network (DNN) architecture - by dynamically exiting at intermediate layers based on self-learned confidence thresholds, LeeNet achieves significant efficiency gains with minimal accuracy trade-offs across diverse datasets and model architectures. Results showcase up to a 69% reduction in computational cost and 1.47x inference speedup, bridging the gap between deep learning and resource-constrained environments. Voted project of the year in Georgia Tech's CS 6220 graduate course.",
    links: [
      {
        label: "Presentation",
        href: "/leenet.pdf",
      },
    ],
    tech: [
      {
        icon: "logos:python",
        name: "Python",
      },
      {
        icon: "devicon:pytorch",
        name: "PyTorch",
      },
      {
        icon: "twemoji:hugging-face",
        name: "Hugging Face",
      },
      {
        icon: "logos:numpy",
        name: "NumPy",
      },
    ],
  },
  {
    title: "Quantitative Research Platform",
    description:
      "My personalized financial management platform surrounding the research, implementation, and deployment of AI trading strategies, portfolio optimization measures, and risk management considerations. Initially founded as a Reinforcement Learning framework with industry-standard technical analysis, the platform has evolved to leverage adaptive quantitative methods, intuitive UI, and realtime integrations.",
    image: "/src/assets/images/projects/fund_chart.png",
    id: "quant",
    tech: [
      {
        icon: "logos:chrome",
        name: "Google Chrome Extension v3",
      },
      {
        icon: "logos:figma",
        name: "Figma",
      },
      {
        icon: "logos:firebase",
        name: "Firebase",
      },
      {
        icon: "logos:github-actions",
        name: "GitHub Actions",
      },
      {
        icon: "logos:google-cloud",
        name: "Google Cloud Platform",
      },
      {
        icon: "simple-icons:ifttt",
        name: "IFTTT",
      },
      {
        icon: "material-icon-theme:netlify",
        name: "Netlify",
      },
      {
        icon: "logos:nextjs-icon",
        name: "Next.js",
      },
      {
        icon: "logos:python",
        name: "Python",
      },
      {
        icon: "logos:tensorflow",
        name: "TensorFlow",
      },
    ],
  },
  {
    title: "Distal Radius Object Identification (DROID)",
    description:
      "As my Georgia Tech capstone project, I worked alongside Emory Dept. of Orthopaedics to craft a state-of-the-art utility to identify wrist implant manufacturers from a simple x-ray, allowing surgeons to immediately discover the proper tools and techniques for implant extraction during emergency operations. To optimize accuracy, we leveraged an unsupervised data augmentation pipeline followed by YOLOv3 transfer learning for inference.",
    image: "/src/assets/images/projects/droid.png",
    id: "droid",
    links: [
      {
        label: "Paper",
        href: "/droid.pdf",
      },
      {
        label: "GitHub",
        href: "https://github.com/dmace2/distal-radius-implant-identifier",
        icon: "uil:github-alt",
      },
    ],
    tech: [
      {
        icon: "logos:apple-app-store",
        name: "App Store Connect",
      },
      {
        icon: "logos:figma",
        name: "Figma",
      },
      {
        icon: "logos:heroku-icon",
        name: "Heroku",
      },
      {
        icon: "logos:python",
        name: "Python",
      },
      {
        icon: "logos:jupyter",
        name: "Jupyter",
      },
      {
        icon: "logos:postgresql",
        name: "PostgreSQL",
      },
      {
        icon: "vscode-icons:file-type-swift",
        name: "Swift",
      },
      {
        icon: "logos:tensorflow",
        name: "TensorFlow",
      },
      {
        icon: "vscode-icons:file-type-xcode",
        name: "Xcode",
      },
    ],
  },
  {
    title: "Knowledge-Based AI for Image Composition",
    image: "/src/assets/images/projects/kbai.png",
    id: "kbai",
    description:
      "An AI photography composition copilot, driven by a novel, data-free approach. This framework builds upon Human-Cognitive Theory, modern aesthetic perception research, and the SOAR Cognitive Architecture to generate human-level instructions for camera repositioning and zoom adjustment. Deeper, unsupervised learning methods such as GradCam with a proposed multi-class design, clustering algorithms, statistical modelling, and nearest-neighbor indexes support my framework's innovations in aesthetically-focused computational photography.",
    links: [
      {
        label: "Poster",
        href: "/kbaiPoster.pdf",
      },
      {
        label: "Paper",
        href: "/kbaiPaper.pdf",
      },
    ],
    tech: [
      {
        icon: "devicon:pytorch",
        name: "PyTorch",
      },
      {
        icon: "logos:python",
        name: "Python",
      },
      {
        icon: "twemoji:hugging-face",
        name: "Hugging Face",
      },
      {
        icon: "logos:numpy",
        name: "NumPy",
      },
      {
        icon: "simple-icons:unsplash",
        name: "Unsplash",
      },
    ],
  },
  {
    title: "White Balancing via Deep Learning",
    id: "white-balance",
    description:
      "Applying novel Deep Learning methods towards accurate automatic color calibration of off-neutral images. Learning from the Unsplash dataset of properly white-balanced stock images, this experiment follows a technical exploration of digital color space, lossless graphical augmentation, computer vision and perception, and state-of-the-art ML model architectures such as ViT (Vision Transformer) alongside convolutional approaches.",
    image: "/src/assets/images/projects/whitebalance.png",
    links: [
      {
        label: "Paper",
        href: "/whitebalance.pdf",
      },
      {
        label: "GitHub",
        href: "https://github.com/dylan-small/DeepColorBalancing",
        icon: "uil:github-alt",
      },
    ],
    tech: [
      {
        icon: "logos:python",
        name: "Python",
      },
      {
        icon: "devicon:pytorch",
        name: "PyTorch",
      },
      {
        icon: "simple-icons:unsplash",
        name: "Unsplash",
      },
      {
        icon: "twemoji:hugging-face",
        name: "Hugging Face",
      },
    ],
  },
  {
    title: "The Perfect Pitch",
    description: `In a research domain where Computing, Physics, and Baseball collide, I combine modern numerical and simulation methods with precise mechanical motion models to test the validity of the controversial "rising fastball" theory. Beyond a simple conclusion, my results present the detailed frontier of minimum physical abilities, such as pitch speed, spin rate, and release location, required to achieve a rising fastball, among other urban legend pitch deliveries.`,
    image: "/src/assets/images/projects/theperfectpitch.png",
    links: [
      {
        label: "Paper",
        href: "/thePerfectPitch.pdf",
      },
      {
        label: "Poster",
        href: "/thePerfectPitchPoster.pdf",
      },
      {
        label: "GitHub",
        href: "https://github.com/blakesanie/PHYS-6260-Project/tree/main",
        icon: "uil:github-alt",
      },
    ],
    tech: [
      {
        icon: "logos:python",
        name: "Python",
      },
      {
        icon: "logos:jupyter",
        name: "Jupyter",
      },
      {
        icon: "simple-icons:mlb",
        name: "MLB Savant",
      },
      {
        icon: "logos:numpy",
        name: "NumPy",
      },
    ],
  },
  {
    title: "Evaluating the Effectiveness of Technical Indicators",
    description:
      "Utilizing numerous supervised and non-supervised methods to analyze the significance and approximate information gain provided by industry-standard technical indicators. By evaluating the classification behavior of high-dimensional indicator vectors into various simulated trading strategies, clear overlaps and distinctions arise between commonly observed trading signals.",
    links: [
      {
        label: "Paper",
        href: "https://blakesanie.github.io/analyzing-financial-methods/",
      },
    ],
    image: "/src/assets/images/projects/indicator_clusters.png",
    tech: [
      {
        icon: "logos:python",
        name: "Python",
      },
      {
        icon: "logos:jupyter",
        name: "Jupyter",
      },
      {
        icon: "logos:tensorflow",
        name: "Tensorflow",
      },
    ],
  },
  {
    title: "React Bubble UI",
    description:
      "A highly configurable Bubble UI React.js component, similar to the iconic Apple Watch app layout. This custom element provides a playful and curious feel that trumps dull grid-based webpage layouts. Download this open source package or contribute on GitHub today!",
    image: "/src/assets/images/projects/bubble.png",
    links: [
      {
        label: "Demo",
        href: "https://bubbleui.blakesanie.com/",
      },
      {
        label: "Download",
        href: "https://www.npmjs.com/package/react-bubble-ui",
      },
      {
        label: "Design Overview",
        href: "https://codeburst.io/deconstructing-the-iconic-apple-watch-bubble-ui-aba68a405689",
      },
      {
        label: "GitHub",
        href: "https://github.com/blakesanie/React-Bubble-UI",
        icon: "uil:github-alt",
      },
    ],
    tech: [
      {
        icon: "logos:npm-2",
        name: "NPM",
      },
      {
        icon: "logos:nodejs-icon",
        name: "Node.js",
      },
      {
        icon: "logos:react",
        name: "React.js",
      },
    ],
  },
  {
    title: "Across the Aisle",
    description:
      "An app that tries to unite a politically divided America. By housing discussion threads for a variety of controversial political topics, Americans from all over the political spectrum can understand each other's perspectives. Awarded as finalist in 2018 Congressional App Challenge.",
    image: "/src/assets/images/projects/AcrossTheAisle.jpg",
    links: [
      {
        label: "Submission and Demo",
        href: "https://youtu.be/4EqokCJiqnY",
      },
    ],
    tech: [
      {
        icon: "logos:nodejs-icon",
        name: "Node.js",
      },
      {
        icon: "logos:react",
        name: "React-Native",
      },
      {
        icon: "vscode-icons:file-type-expo",
        name: "Expo",
      },
      {
        icon: "logos:firebase",
        name: "Firebase",
      },
    ],
  },
  {
    title: "Headlines",
    description:
      "A remarkably user-friendly news app. As the name implies, notable titles can be browsed with minimal effort. With numerous categories and more than 32 world-renowned news sources to choose from, articles are filtered to fit your interests. If a headline just isn't enough, an article description, photo, and the full article are one press away.",
    image: "/src/assets/images/projects/headlines.jpg",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/blakesanie/Headlines",
        icon: "uil:github-alt",
      },
    ],
    tech: [
      {
        icon: "logos:apple-app-store",
        name: "App Store Connect",
      },
      {
        icon: "logos:swift",
        name: "Swift",
      },
      {
        icon: "vscode-icons:file-type-xcode",
        name: "Xcode",
      },
    ],
  },
  {
    title: "Twitter Poetry Detection",
    description: `A NLP-driven bot with an appreciation for poetry. The bot listens to Twitter's tweet stream, continuously searching for updates that contain the subject "life" and maintain a rhyming scheme when reformatted into a quatrain. Selected tweets are automatically retweeted, giving accidental poets a shoutout on the platform.`,
    image: "/src/assets/images/projects/TwitterPoetryBot.png",
    links: [
      {
        label: "Twitter Account",
        href: "https://twitter.com/your_life_poems",
      },
      {
        label: "GitHub",
        href: "https://github.com/blakesanie/Twitter-Poetry-Detection",
        icon: "uil:github-alt",
      },
    ],
    tech: [
      {
        icon: "logos:heroku-icon",
        name: "Heroku",
      },
      {
        icon: "logos:nodejs-icon",
        name: "Node.js",
      },
      {
        icon: "logos:twitter",
        name: "Twitter Developers",
      },
    ],
  },
  {
    title: "Spotify Mosaic",
    description:
      "A digital art project. This web app provides a means of visualization one's music taste. Users can authenticate with their Spotify account and build creative mosaics from album covers on their playlists. Exporting and printing features come built-in!",
    image: "/src/assets/images/projects/spotifyMosaic.png",
    links: [
      {
        label: "Launch",
        href: "/spotifyMosaic",
      },
    ],
    tech: [
      {
        icon: "logos:javascript",
        name: "JavaScript",
      },
      {
        icon: "logos:css-3",
        name: "CSS",
      },
      {
        icon: "logos:html-5",
        name: "HTML",
      },
      {
        icon: "simple-icons:jquery",
        name: "jQuery",
      },
    ],
  },
  {
    title: "Proximity",
    description:
      "A map application like no other. It uses iPhone's GPS, gyroscope, and a connection to Google's Places API to locate and identify locations within a certain radius of the user's current position. Then, when you select one of these locations, its relative direction and distance are projected over the device's live camera feed, effectively tracking the location in real time.",
    image: "/src/assets/images/projects/proximity.jpg",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/blakesanie/Proximity",
        icon: "uil:github-alt",
      },
    ],
    tech: [
      {
        icon: "logos:apple-app-store",
        name: "App Store Connect",
      },
      {
        icon: "logos:swift",
        name: "Swift",
      },
      {
        icon: "vscode-icons:file-type-xcode",
        name: "Xcode",
      },
      {
        icon: "logos:google-cloud",
        name: "Google Cloud Platform",
      },
    ],
  },
]);
