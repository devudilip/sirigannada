/**
 * Share a letter as a short video: the handwriting animation playing on a branded 4:5 card with
 * the letter's recording, romanisation, and its words with their pictures (the popup, as a post).
 * Recorded on the device with canvas.captureStream + MediaRecorder — nothing leaves the browser
 * until the user shares it. The GIF and recording are CC BY-SA 4.0, so the credit is burned into
 * the video. Only `videoMimeType` is unit-tested (jsdom has no canvas).
 */
import { COLORS, cssFontFamily, displayUrl, fillSplitText, KIND_LABEL } from "@/features/share/lib/shareCard";
import { toIso15919 } from "@/lib/iso15919";
import { letterMedia } from "./letterMedia";
import { LETTER_WORDS, wordPictureSrc } from "./letterWords";

const W = 1080;
const H = 1350;
const PAD = 84;
const FPS = 30;
/** Held on the finished letter after the animation (and the sound) end. */
const HOLD_MS = 500;

const LETTER_VIDEO_CREDIT = "Animation: Gopala Krishna A · Voice: Surabhi18 · Wikimedia Commons, CC BY-SA 4.0";

/**
 * First container the recorder can write; mp4 first since WhatsApp/Instagram reject webm. No codec
 * string: Chrome on macOS reports `avc1,mp4a.40.2` supported, then fails to start the AAC encoder.
 */
export function videoMimeType(isSupported: (type: string) => boolean): string | null {
  return ["video/mp4", "video/webm"].find(isSupported) ?? null;
}


interface Gif {
  frames: VideoFrame[];
  /** Cumulative end time of each frame, ms. */
  ends: number[];
}

/** Every GIF frame with its timing, via WebCodecs. `null` where unsupported (older Safari): the card then shows the typeset letter. */
async function decodeGif(src: string): Promise<Gif | null> {
  if (typeof ImageDecoder === "undefined") return null;
  try {
    const decoder = new ImageDecoder({ data: await (await fetch(src)).arrayBuffer(), type: "image/gif" });
    await decoder.tracks.ready; // selectedTrack is null until this resolves, even after `completed`
    await decoder.completed;
    const frames: VideoFrame[] = [];
    const ends: number[] = [];
    for (let i = 0; i < decoder.tracks.selectedTrack!.frameCount; i++) {
      const { image } = await decoder.decode({ frameIndex: i });
      frames.push(image);
      ends.push((ends.at(-1) ?? 0) + (image.duration ?? 100_000) / 1000);
    }
    decoder.close();
    return { frames, ends };
  } catch {
    return null;
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Draws all of `img` centred in a white rounded square at (x, y); pictures aren't square, so none is cropped. */
function drawContain(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, size: number): void {
  const scale = size / Math.max(img.naturalWidth, img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, size, size, 24);
  ctx.clip();
  ctx.fillStyle = "#fff";
  ctx.fillRect(x, y, size, size);
  ctx.drawImage(img, x + (size - w) / 2, y + (size - h) / 2, w, h);
  ctx.restore();
}

interface LetterScene {
  /** Paints the card at `ms` into the animation; `Infinity` paints the finished letter. */
  paint: (ms: number) => void;
  gif: Gif | null;
}

/** Loads the letter's media and sizes `canvas`; the image card and every video frame paint from this. */
async function letterScene(canvas: HTMLCanvasElement, glyph: string, url: string): Promise<LetterScene> {
  const media = letterMedia(glyph);
  if (!media) throw new Error("no media");
  const serif = cssFontFamily("--font-noto-serif", "serif");
  const sans = cssFontFamily("--font-anek", "sans-serif");
  const words = (LETTER_WORDS[glyph] ?? []).slice(0, 3);
  await Promise.all([document.fonts.load(`600 54px ${serif}`), document.fonts.load(`600 44px ${sans}`)]).catch(() => {});
  const [gif, pictures] = await Promise.all([
    decodeGif(media.gif),
    Promise.all(words.map((w) => (w.picture ? loadImage(wordPictureSrc(w.picture)).catch(() => null) : null))),
  ]);

  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const box = 560;
  const boxX = (W - box) / 2;
  const boxY = 240;

  const paint = (ms: number) => {
    ctx.fillStyle = COLORS.paper;
    ctx.fillRect(0, 0, W, H);
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";
    ctx.font = `600 44px ${sans}`;
    fillSplitText(ctx, "ಸಿರಿ", "ಗನ್ನಡ", PAD, PAD + 40, COLORS.gold, COLORS.accent);
    // Chip, gold rule, source line and footer sit where paintShareCard puts them, so image and video match.
    ctx.font = `600 28px ${sans}`;
    const chipY = PAD + 70;
    ctx.fillStyle = COLORS.accentSoft;
    ctx.beginPath();
    ctx.roundRect(PAD, chipY, ctx.measureText(KIND_LABEL.letter).width + 48, 52, 26);
    ctx.fill();
    ctx.fillStyle = COLORS.accent;
    ctx.fillText(KIND_LABEL.letter, PAD + 24, chipY + 35);

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, box, box, 32);
    ctx.fill();
    if (gif) {
      // Past the last frame findIndex is -1: hold the finished letter.
      ctx.drawImage(gif.frames[gif.ends.findIndex((end) => ms < end)] ?? gif.frames.at(-1)!, boxX + 30, boxY + 30, box - 60, box - 60);
    } else {
      // No WebCodecs (older Safari): the typeset letter, since a GIF drawn to canvas is only its first, blank frame.
      ctx.textAlign = "center";
      ctx.font = `600 340px ${serif}`;
      ctx.fillStyle = COLORS.ink;
      ctx.fillText(glyph, W / 2, boxY + box * 0.72);
    }

    ctx.textAlign = "center";
    ctx.font = `500 40px ${sans}`;
    ctx.fillStyle = COLORS.muted;
    ctx.fillText(toIso15919(glyph), W / 2, boxY + box + 52);

    const colW = (W - PAD * 2) / Math.max(1, words.length);
    const pic = 180;
    words.forEach(({ word, en }, i) => {
      const cx = PAD + colW * i + colW / 2;
      const img = pictures[i];
      if (img) drawContain(ctx, img, cx - pic / 2, 880, pic);
      ctx.font = `600 50px ${serif}`;
      ctx.fillStyle = COLORS.ink;
      ctx.fillText(word, cx, 1116);
      ctx.font = `500 26px ${sans}`;
      ctx.fillStyle = COLORS.secondary;
      ctx.fillText(en, cx, 1152);
    });

    ctx.textAlign = "left";
    ctx.fillStyle = COLORS.gold;
    ctx.fillRect(PAD, H - 150, 60, 4);
    ctx.font = `400 22px ${sans}`;
    ctx.fillStyle = COLORS.muted;
    ctx.fillText(LETTER_VIDEO_CREDIT, PAD, H - 118);
    ctx.font = `500 26px ${sans}`;
    ctx.fillStyle = COLORS.secondary;
    ctx.fillText(displayUrl(url), PAD, H - 80);
    ctx.font = `600 26px ${sans}`;
    const markX = W - PAD - ctx.measureText("sirigannada.in").width;
    fillSplitText(ctx, "siri", "gannada.in", markX, H - 80, COLORS.gold, COLORS.accent);
  };
  return { paint, gif };
}

/** The share image: the video's last frame (finished letter, its words and their pictures). */
export async function renderLetterImage(canvas: HTMLCanvasElement, glyph: string, url: string): Promise<void> {
  const { paint, gif } = await letterScene(canvas, glyph, url);
  paint(Infinity);
  gif?.frames.forEach((f) => f.close());
}

/** Records the letter's video. Throws if the browser can't record or the media fails to load. */
export async function recordLetterVideo(glyph: string, url: string): Promise<File> {
  const media = letterMedia(glyph);
  const mimeType = typeof MediaRecorder === "undefined" ? null : videoMimeType((t) => MediaRecorder.isTypeSupported(t));
  if (!media || !mimeType) throw new Error("cannot record");
  const canvas = document.createElement("canvas");
  const [{ paint, gif }, sound] = await Promise.all([letterScene(canvas, glyph, url), fetch(media.audio).then((r) => r.arrayBuffer())]);

  const audio = new AudioContext();
  try {
    await audio.resume();
    const buffer = await audio.decodeAudioData(sound);
    // As long as the animation at its own pace (2.8–6.1s) or the sound, whichever ends later.
    const videoMs = Math.max(gif?.ends.at(-1) ?? 2000, 200 + buffer.duration * 1000) + HOLD_MS;
    const out = audio.createMediaStreamDestination();
    // Frame rate 0 + requestFrame(): Chrome pushes no frames on its own for a canvas outside the DOM.
    const [track] = canvas.captureStream(0).getVideoTracks() as CanvasCaptureMediaStreamTrack[];
    const stream = new MediaStream([track!, ...out.stream.getAudioTracks()]);
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 4_000_000 });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    let failed = false;
    recorder.onerror = () => (failed = true);
    const stopped = new Promise((resolve) => (recorder.onstop = resolve));

    paint(0);
    recorder.start();
    track!.requestFrame();
    const source = audio.createBufferSource();
    source.buffer = buffer;
    source.connect(out);
    source.start(audio.currentTime + 0.2);
    // setTimeout, not rAF: rAF stops in a background tab and the recording would never end.
    const start = performance.now();
    await new Promise<void>((done) => {
      const tick = () => {
        const ms = performance.now() - start;
        paint(ms);
        track!.requestFrame();
        if (ms < videoMs) setTimeout(tick, 1000 / FPS);
        else done();
      };
      tick();
    });
    recorder.stop();
    await stopped;
    const blob = new Blob(chunks);
    if (failed || blob.size === 0) throw new Error("recording failed");

    const type = mimeType.split(";")[0]!;
    const slug = media.gif.split("/").at(-1)!.replace(".gif", "");
    return new File([blob], `sirigannada-letter-${slug}.${type === "video/mp4" ? "mp4" : "webm"}`, { type });
  } finally {
    gif?.frames.forEach((f) => f.close());
    void audio.close();
  }
}
