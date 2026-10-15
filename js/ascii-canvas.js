/**
 * AsciiCanvasEngine
 * Real-time animated GIF-to-ASCII fullscreen canvas renderer.
 * Decompresses GIF frames, calculates cell luminance across high-DPI grid,
 * renders characters, and applies difference composite mode text overlay.
 */

import { parseGIF, decompressFrames } from './gifuct.js';

const ASCII_RAMP = ' .:-=+*#%@';

export class AsciiCanvasEngine {
  constructor(options = {}) {
    this.canvas = options.canvas || document.querySelector('.blog-ascii-canvas');
    this.config = options.config || window.PORTFOLIO_CONFIG?.blog || {};
    this.src = options.src || this.config.asciiMedia || this.config.gifSrc || 'assets/blog/coming-soon.gif';
    this.overlayText = options.overlayText || this.config.overlayText || 'Coming soon';
    this.active = options.active !== undefined ? options.active : false;

    this.frames = [];
    this.currentFrameIdx = 0;
    this.nextFrameTime = 0;
    this.rafId = null;
    this.isDestroyed = false;

    this.sampleCanvas = document.createElement('canvas');
    this.sampleCtx = this.sampleCanvas.getContext('2d', { willReadFrequently: true, alpha: false });

    this.updateThemeColors();

    this.handleThemeChange = () => {
      this.updateThemeColors();
      if (this.active) {
        this.renderFrame();
      }
    };
    window.addEventListener('portfolio-theme-change', this.handleThemeChange);

    this.init();
  }

  updateThemeColors() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const computed = getComputedStyle(document.documentElement);
    this.themeBg = computed.getPropertyValue('--bg').trim() || (isLight ? '#f4f4f1' : '#050507');
    this.themeFg = computed.getPropertyValue('--fg').trim() || (isLight ? '#121212' : '#f5f5f4');
    this.isLight = isLight;
  }

  async init() {
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    if (!this.ctx) return;

    try {
      await this.loadSource();
      if (!this.isDestroyed) {
        this.startLoop();
      }
    } catch (err) {
      console.error('[AsciiCanvasEngine] Failed to initialize source:', err);
    }
  }

  async loadSource() {
    if (/\.gif(\?|$)/i.test(this.src)) {
      this.mediaType = 'gif';
      this.frames = await this.decompressGif(this.src);
    } else if (/\.(mp4|webm|mov|ogg)(\?|$)/i.test(this.src)) {
      this.mediaType = 'video';
      this.setupVideo(this.src);
    }
  }

  async decompressGif(src) {
    const res = await fetch(src);
    if (!res.ok) throw new Error(`Failed to load GIF: ${res.status}`);
    const buffer = await res.arrayBuffer();
    const parsedGif = parseGIF(buffer);
    const decompressed = decompressFrames(parsedGif, true);

    if (!decompressed.length) throw new Error('GIF has no frames');

    const width = parsedGif.lsd?.width || decompressed[0]?.dims.width || 1;
    const height = parsedGif.lsd?.height || decompressed[0]?.dims.height || 1;

    const compCanvas = document.createElement('canvas');
    compCanvas.width = width;
    compCanvas.height = height;
    const compCtx = compCanvas.getContext('2d', { willReadFrequently: true });
    compCtx.fillStyle = '#000';
    compCtx.fillRect(0, 0, width, height);

    const frameList = [];
    let prevImageData = null;
    const patchCanvas = document.createElement('canvas');
    const patchCtx = patchCanvas.getContext('2d');

    for (const frame of decompressed) {
      const disposal = frame.disposalType ?? 1;
      if (disposal === 3 && prevImageData) {
        compCtx.putImageData(prevImageData, 0, 0);
      } else if (disposal === 2) {
        compCtx.fillStyle = '#000';
        compCtx.fillRect(0, 0, width, height);
      }
      if (disposal !== 3) {
        prevImageData = compCtx.getImageData(0, 0, width, height);
      }

      const { left, top, width: fw, height: fh } = frame.dims;
      if (patchCtx && fw > 0 && fh > 0) {
        patchCanvas.width = fw;
        patchCanvas.height = fh;
        const imgData = patchCtx.createImageData(fw, fh);
        imgData.data.set(frame.patch);
        patchCtx.putImageData(imgData, 0, 0);
        compCtx.drawImage(patchCanvas, left, top);
      }

      const frameCanvas = document.createElement('canvas');
      frameCanvas.width = width;
      frameCanvas.height = height;
      frameCanvas.getContext('2d')?.drawImage(compCanvas, 0, 0);

      const delayMs = Math.max(40, frame.delay || 100);
      frameList.push({ bitmapCanvas: frameCanvas, delayMs });
    }

    return frameList;
  }

  setupVideo(src) {
    const video = document.createElement('video');
    video.src = src;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';
    this.videoEl = video;
    video.play().catch(() => void 0);
  }

  setActive(isActive) {
    if (this.active === isActive) return;
    this.active = isActive;
    if (this.active) {
      this.currentFrameIdx = 0;
      this.nextFrameTime = performance.now();
      this.renderFrame();
    }
  }

  startLoop() {
    this.currentFrameIdx = 0;
    this.nextFrameTime = performance.now();

    const loop = (timestamp) => {
      if (this.isDestroyed) return;

      if (this.active) {
        if (this.mediaType === 'gif' && this.frames.length > 1) {
          const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          if (!reducedMotion && timestamp >= this.nextFrameTime) {
            this.currentFrameIdx = (this.currentFrameIdx + 1) % this.frames.length;
            const currentFrame = this.frames[this.currentFrameIdx];
            this.nextFrameTime = timestamp + (currentFrame?.delayMs ?? 100);
          }
        }
        this.renderFrame();
      }

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  renderFrame() {
    if (!this.ctx || !this.sampleCtx) return;

    let source = null;
    let sw = 1;
    let sh = 1;

    if (this.mediaType === 'gif') {
      if (!this.frames.length) return;
      const frame = this.frames[this.currentFrameIdx] || this.frames[0];
      source = frame.bitmapCanvas;
      sw = source.width;
      sh = source.height;
    } else if (this.mediaType === 'video' && this.videoEl && this.videoEl.videoWidth) {
      source = this.videoEl;
      sw = source.videoWidth;
      sh = source.videoHeight;
    }

    if (!source) return;

    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    const screenW = Math.max(window.innerWidth || 0, document.documentElement.clientWidth || 0, 1);
    const screenH = Math.max(window.innerHeight || 0, document.documentElement.clientHeight || 0, 1);
    if (screenW < 2 || screenH < 2) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const canvasW = Math.floor(screenW * dpr);
    const canvasH = Math.floor(screenH * dpr);

    this.canvas.style.width = `${screenW}px`;
    this.canvas.style.height = `${screenH}px`;
    if (this.canvas.width !== canvasW || this.canvas.height !== canvasH) {
      this.canvas.width = canvasW;
      this.canvas.height = canvasH;
    }

    if (this.sampleCanvas.width !== canvasW || this.sampleCanvas.height !== canvasH) {
      this.sampleCanvas.width = canvasW;
      this.sampleCanvas.height = canvasH;
    }

    const monoFont = 'ui-monospace, "Cascadia Mono", "SF Mono", Menlo, Consolas, monospace';
    this.ctx.font = `20px ${monoFont}`;
    const charAspect = Math.max(0.5, this.ctx.measureText('M').width / 20);
    const cols = Math.max(48, Math.min(isMobile ? 100 : 360, Math.floor(screenW / (isMobile ? 5.8 : 3.5))));
    const cellW = canvasW / cols;
    const fontSize = Math.max(4, (cellW / charAspect) * 1.02);
    const cellH = fontSize * (isMobile ? 0.94 : 0.84);
    const rows = Math.max(24, Math.floor(canvasH / cellH));
    const padX = (canvasW - cols * cellW) / 2;
    const padY = (canvasH - rows * cellH) / 2;

    // Scale and fit source into sample canvas
    const scale = Math.min(canvasW / sw, canvasH / sh);
    const scaledW = sw * scale;
    const scaledH = sh * scale;
    const destX = (canvasW - scaledW) / 2;
    const destY = (canvasH - scaledH) / 2;

    this.sampleCtx.fillStyle = '#000';
    this.sampleCtx.fillRect(0, 0, canvasW, canvasH);
    this.sampleCtx.drawImage(source, destX, destY, scaledW, scaledH);

    let imgData;
    try {
      imgData = this.sampleCtx.getImageData(0, 0, canvasW, canvasH);
    } catch (_) {
      return;
    }

    const pixels = imgData.data;

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (this.isLight !== isLight || !this.themeBg) {
      this.updateThemeColors();
    }

    // Clear render canvas to theme background (dark: black, light: paper)
    this.ctx.fillStyle = this.themeBg;
    this.ctx.fillRect(0, 0, canvasW, canvasH);

    // Render ASCII characters in theme foreground (dark: white, light: dark charcoal)
    this.ctx.fillStyle = this.themeFg;
    this.ctx.font = `${fontSize}px ${monoFont}`;
    this.ctx.textBaseline = 'top';
    this.ctx.textAlign = 'left';

    const maxRampIdx = ASCII_RAMP.length - 1;

    for (let r = 0; r < rows; r++) {
      let lineText = '';
      for (let c = 0; c < cols; c++) {
        const xStart = padX + c * cellW;
        const yStart = padY + r * cellH;
        const xEnd = xStart + cellW;
        const yEnd = yStart + cellH;

        const lum = this.sampleLuminance(pixels, canvasW, canvasH, xStart, yStart, xEnd, yEnd);
        const rampIdx = Math.min(maxRampIdx, Math.floor(lum * maxRampIdx));
        lineText += ASCII_RAMP[rampIdx] || ' ';
      }
      this.ctx.fillText(lineText, padX, padY + r * cellH);
    }

    // Text overlay with difference composite mode
    const overlay = this.overlayText?.trim();
    if (overlay) {
      const overlaySize = isMobile
        ? Math.min(0.13 * canvasW, 0.09 * canvasH, 90 * dpr)
        : Math.min(0.10 * canvasW, 0.12 * canvasH, 112 * dpr);
      const overlayY = isMobile ? 0.72 * canvasH : 0.5 * canvasH;
      const serifFont = getComputedStyle(document.documentElement)
        .getPropertyValue('--font-currently').trim() || '"Instrument Serif", "Times New Roman", Georgia, serif';

      this.ctx.save();
      this.ctx.globalCompositeOperation = 'difference';
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = `italic 400 ${overlaySize}px ${serifFont}`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(overlay, canvasW / 2, overlayY);
      this.ctx.restore();
    }
  }

  sampleLuminance(pixels, width, height, x0, y0, x1, y1) {
    const startX = Math.max(0, Math.floor(x0));
    const startY = Math.max(0, Math.floor(y0));
    const endX = Math.min(width, Math.ceil(x1));
    const endY = Math.min(height, Math.ceil(y1));

    if (endX <= startX || endY <= startY) return 0;

    let totalLum = 0;
    let sampleCount = 0;
    const stepX = Math.max(1, Math.floor((endX - startX) / 4));
    const stepY = Math.max(1, Math.floor((endY - startY) / 4));

    for (let y = startY; y < endY; y += stepY) {
      for (let x = startX; x < endX; x += stepX) {
        const idx = (y * width + x) * 4;
        const alpha = pixels[idx + 3] ?? 255;
        if (alpha < 8) {
          sampleCount++;
          continue;
        }
        const r = pixels[idx] ?? 0;
        const g = pixels[idx + 1] ?? 0;
        const b = pixels[idx + 2] ?? 0;
        totalLum += 0.299 * r + 0.587 * g + 0.114 * b;
        sampleCount++;
      }
    }

    return sampleCount > 0 ? (totalLum / sampleCount / 255) : 0;
  }

  destroy() {
    this.isDestroyed = true;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.handleThemeChange) {
      window.removeEventListener('portfolio-theme-change', this.handleThemeChange);
    }
  }
}
