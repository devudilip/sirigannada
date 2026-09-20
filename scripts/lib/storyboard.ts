/** Read the canvas dimensions from a WebP header without decoding pixels. */
export function storyboardDimensions(bytes: Buffer): { width: number; height: number } | undefined {
  if (bytes.length < 30 || bytes.toString("ascii", 0, 4) !== "RIFF" || bytes.toString("ascii", 8, 12) !== "WEBP") return;
  for (let offset = 12; offset + 8 <= bytes.length;) {
    const kind = bytes.toString("ascii", offset, offset + 4);
    const length = bytes.readUInt32LE(offset + 4);
    const start = offset + 8;
    if (start + length > bytes.length) return;
    if (kind === "VP8X" && length >= 10) return {
      width: 1 + bytes.readUIntLE(start + 4, 3), height: 1 + bytes.readUIntLE(start + 7, 3),
    };
    if (kind === "VP8 " && length >= 10 && bytes.subarray(start + 3, start + 6).equals(Buffer.from([0x9d, 0x01, 0x2a]))) return {
      width: bytes.readUInt16LE(start + 6) & 0x3fff, height: bytes.readUInt16LE(start + 8) & 0x3fff,
    };
    if (kind === "VP8L" && length >= 5 && bytes[start] === 0x2f) {
      const bits = bytes.readUInt32LE(start + 1);
      return { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
    }
    offset = start + length + (length % 2);
  }
}
