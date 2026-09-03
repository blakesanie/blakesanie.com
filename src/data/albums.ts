import { albumSchema, type Album } from "../types/content";

export const albums: Album[] = albumSchema.array().parse([
  {
    slug: "northern-michigan-2026",
    title: "Mackinac Island and Pictured Rocks",
    description: "Greatest sights in Northern Michigan.",
    heading: "Mackinac Island and Pictured Rocks",
    subheading: "August 2026 - Northern Michigan. 2 locations, 2 days each.",
    allowFullscreen: true,
    allowMetadata: true,
    imageFilePath: "/src/assets/client_alias/north-mich/DSC08034.jpg",
  },
  {
    slug: "chi-air-and-water-show-2026",
    title: "Chicago Air and Water Show 2026",
    description: "Chicago's annual lakefront aviation exposition.",
    heading: "Chicago Air and Water Show 2026",
    subheading:
      'August 2026 - Chicago Lakefront. <a href="mailto:blake@sanie.com">Email blake@sanie.com</a> for licensing.',
    allowFullscreen: true,
    allowMetadata: true,
    imageFilePath: "/src/assets/client_alias/chi-aw-show-2026/DSC06713.jpg",
  },
  {
    slug: "chi-marathon-2025",
    title: "Chicago Marathon 2025",
    description: "October 12, 2025. Chicago Marathon in Old Town.",
    heading: "Chicago Marathon 2025",
    subheading:
      'October 12, 2025. Chicago Marathon along LaSalle (mile 4) and Wells (mile 12). Download available for personal use. <a href="https://www.instagram.com/blakesanie.jpg/" target="_blank">@blakesanie.jpg</a>',
    allowFilename: true,
    imageFilePath: "/src/assets/client_alias/chi-marathon-2025/DSC02413.jpg",
  },
  {
    slug: "xxx-relay-cross-2025",
    title: "XXX Relay Cross 2025",
    description: "September 14, 2025. Cyclocross Relay Bike Race Images",
    heading: "XXX Relay Cross 2025",
    subheading:
      'September 14, 2025, at Jackson Park, Chicago. Download available for personal use. Attribution <a href="https://www.instagram.com/blakesanie.jpg/" target="_blank">@blakesanie.jpg</a>',
    allowFilename: true,
    imageFilePath: "/src/assets/client_alias/relay-cross-2025/DSC01406.jpg",
  },
  {
    slug: "mnr-labor-day-2025",
    title: "MNR Labor Day 2025",
    description: "September 1, 2025. Photographs from Monday Night Ride.",
    heading: "MNR Labor Day 2025",
    allowDownload: true,
    allowRemoteImages: true,
    allowFilename: true,
    imageFilePath: "/src/assets/client_alias/mnr-labor-day-2025/DSC00237.jpg",
  },
]);
