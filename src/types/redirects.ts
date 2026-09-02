export interface RedirectEntry {
  href: string;
  title: string;
  short?: string;
  internal?: boolean;
}

export type RedirectMap = Record<string, RedirectEntry>;
