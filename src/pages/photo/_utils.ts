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

export const MIN_EMB_BOUND = -0.09;
export const MAX_EMB_BOUND = -MIN_EMB_BOUND;

/**
 * Compresses an array of CLIP floats into a 4-bit packed Base64 string.
 * Optimizes for values concentrated closely around 0.
 */
export function encodeEmbeddings(embeddings: number[]): string {
  const byteLength = Math.ceil(embeddings.length / 2);
  const byteArray = new Uint8Array(byteLength);

  for (let i = 0; i < embeddings.length; i++) {
    // 1. Clamp values to our tight expected zone
    const clamped = Math.max(MIN_EMB_BOUND, Math.min(MAX_EMB_BOUND, embeddings[i]));

    // 2. Map linearly from [-0.12, 0.12] to [0.0, 1.0]
    const normalized = (clamped - MIN_EMB_BOUND) / (MAX_EMB_BOUND - MIN_EMB_BOUND);

    // 3. Quantize to a 4-bit integer (0 to 15)
    const quantized = Math.round(normalized * 15);

    // 4. Pack two 4-bit integers into one 8-bit byte
    const byteIndex = Math.floor(i / 2);
    if (i % 2 === 0) {
      byteArray[byteIndex] = quantized << 4; // Upper 4 bits
    } else {
      byteArray[byteIndex] |= quantized; // Lower 4 bits
    }
  }

  // 5. Convert Uint8Array to Base64 string
  if (typeof Buffer !== "undefined") {
    return Buffer.from(byteArray).toString("base64");
  } else {
    const binString = String.fromCodePoint(...byteArray);
    return btoa(binString);
  }
}

/**
 * Decodes the 4-bit Base64 string back into the approximate float array.
 */
export function dotProduct(embeddings: number[], encoded: string): number {
  // 1. Decode the base64 string into a binary buffer
  let binaryString: Uint8Array;
  if (typeof Buffer !== "undefined") {
    binaryString = Buffer.from(encoded, "base64");
  } else {
    binaryString = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
  }

  let result = 0;
  const length = embeddings.length;

  // 2. Iterate through each element to decode and multiply on the fly
  for (let i = 0; i < length; i++) {
    const byteIndex = Math.floor(i / 2);
    const byte = binaryString[byteIndex];
    let quantized: number;

    // Extract 4 bits based on whether it's an even or odd index
    if (i % 2 === 0) {
      quantized = (byte >> 4) & 0x0f;
    } else {
      quantized = byte & 0x0f;
    }

    // 3. De-quantize back to the estimated float value
    const decodedValue = MIN_EMB_BOUND + (quantized / 15) * (MAX_EMB_BOUND - MIN_EMB_BOUND);

    // 4. Accumulate the product sum
    result += embeddings[i] * decodedValue;
  }

  return result;
}
