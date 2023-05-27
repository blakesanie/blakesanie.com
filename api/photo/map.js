import indexHandler from "./index.js";

export default async function handler(req, res) {
  return await indexHandler(req, res);
}
