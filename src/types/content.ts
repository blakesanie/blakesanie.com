import { z } from "zod";

export interface Technology {
  icon: string;
  name: string;
}

export interface ProjectLink {
  label: string;
  href: string;
  target?: string;
  icon?: string;
}

export interface Project {
  title: string;
  id?: string;
  description: string;
  image?: string;
  youtube?: string;
  tech: Technology[];
  links?: ProjectLink[];
}

export interface PressItem {
  link: string;
  image?: string;
  date?: string;
  title: string;
}

export interface Album {
  slug: string;
  title: string;
  description?: string;
  heading: string;
  subheading?: string;
  allowDownload?: boolean;
  allowFilename?: boolean;
  allowFullscreen?: boolean;
  allowMetadata?: boolean;
  imageFilePath: string;
}

export interface GalleryImage {
  name: string;
  path: string;
  width: number;
  height: number;
  lat: number;
  lon: number;
}

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl?: string;
  image?: string;
  noindex?: boolean;
}

export type ExifRecord = Record<string, unknown>;

export const exifRecordSchema = z.record(
  z.string(),
  z.unknown(),
);

export const metadataMapSchema = z.record(z.string(), exifRecordSchema);
export const embeddingMapSchema = z.record(z.string(), z.array(z.number()));

export const technologySchema = z.object({
  icon: z.string().min(1),
  name: z.string().min(1),
});

export const projectLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().url().or(z.string().startsWith("/")),
  target: z.string().optional(),
  icon: z.string().optional(),
});

export const projectSchema = z.object({
  title: z.string().min(1),
  id: z.string().min(1).optional(),
  description: z.string().min(1),
  image: z.string().min(1).optional(),
  youtube: z.string().url().optional(),
  tech: z.array(technologySchema),
  links: z.array(projectLinkSchema).optional(),
});

export const pressItemSchema = z.object({
  link: z.string().url(),
  image: z.string().min(1).optional(),
  date: z.string().min(1).optional(),
  title: z.string().min(1),
});

export const albumSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  heading: z.string().min(1),
  subheading: z.string().optional(),
  allowDownload: z.boolean().optional(),
  allowFilename: z.boolean().optional(),
  allowFullscreen: z.boolean().optional(),
  allowMetadata: z.boolean().optional(),
  imageFilePath: z.string().min(1),
});
