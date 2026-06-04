export function cleanseName(name: string): string {
  let out = name.replaceAll("_", " ");
  out = out.replaceAll("-", " ");
  // accents
  out = out.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  out = out.replaceAll(" ", "-");
  // delete all chars that dont encode in a url
  out = out.replace(/[^a-zA-Z0-9.\-_~]/g, "");
  return out.toLowerCase();
}
