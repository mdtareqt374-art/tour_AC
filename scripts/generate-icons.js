import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const combined = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(combined), 0);
  return Buffer.concat([len, combined, crcBuf]);
}

function createPng(width, height, isMaskable = false) {
  const header = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8-bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // deflate
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // no interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw RGBA scanlines (width * 4 + 1 filter byte per row)
  const rowLength = width * 4 + 1;
  const rawData = Buffer.alloc(rowLength * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = isMaskable ? width * 0.48 : width * 0.42;
  const cornerRadius = width * 0.22;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter byte 0 (None)

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;

      // Base background color (Teal #0d9488 -> #0f766e)
      const gradRatio = (x + y) / (width + height);
      let r = Math.round(13 + (15 - 13) * gradRatio);
      let g = Math.round(148 - (148 - 118) * gradRatio);
      let b = Math.round(136 - (136 - 110) * gradRatio);
      let a = 255;

      if (!isMaskable) {
        // Rounded rectangle mask
        const dx = Math.abs(x - cx) - (cx - cornerRadius);
        const dy = Math.abs(y - cy) - (cy - cornerRadius);
        const dist = Math.sqrt(Math.max(0, dx) ** 2 + Math.max(0, dy) ** 2);
        if (dx > 0 && dy > 0 && dist > cornerRadius) {
          a = 0; // Transparent outside rounded corner
        }
      }

      // Draw Travel Luggage silhouette in center
      // Luggage body: width * 0.52 wide, height * 0.52 high
      const bagW = width * 0.50;
      const bagH = height * 0.50;
      const bagX = cx - bagW / 2;
      const bagY = cy - bagH / 2 + (height * 0.03);

      // Luggage handle
      const hndW = width * 0.20;
      const hndH = height * 0.12;
      const hndX = cx - hndW / 2;
      const hndY = bagY - hndH + 4;

      if (a > 0) {
        // Check handle
        if (
          x >= hndX && x <= hndX + hndW &&
          y >= hndY && y <= bagY
        ) {
          const innerHndW = hndW * 0.6;
          const innerHndH = hndH * 0.65;
          const innerX = cx - innerHndW / 2;
          const innerY = hndY + hndH * 0.35;
          const inHole = (x >= innerX && x <= innerX + innerHndW && y >= innerY && y <= bagY);
          if (!inHole) {
            r = 255; g = 255; b = 255;
          }
        }

        // Check luggage body
        if (x >= bagX && x <= bagX + bagW && y >= bagY && y <= bagY + bagH) {
          // Inner bag is clean white with teal stripes
          const stripeW = width * 0.03;
          const isStripe = Math.abs(x - cx) < stripeW / 2;
          const isStripeL = Math.abs(x - (cx - bagW * 0.28)) < stripeW / 2;
          const isStripeR = Math.abs(x - (cx + bagW * 0.28)) < stripeW / 2;

          if (isStripe) {
            r = 13; g = 148; b = 136; // Teal stripe
          } else if (isStripeL || isStripeR) {
            r = 204; g = 251; b = 241; // Light mint stripe
          } else {
            r = 255; g = 255; b = 255; // White luggage body
          }
        }

        // Draw Gold Currency / Plus coin badge on bottom right
        const coinRadius = width * 0.16;
        const coinCx = cx + bagW * 0.35;
        const coinCy = cy + bagH * 0.35;
        const distToCoin = Math.sqrt((x - coinCx) ** 2 + (y - coinCy) ** 2);

        if (distToCoin <= coinRadius) {
          if (distToCoin > coinRadius - 3) {
            // Coin white border
            r = 255; g = 255; b = 255;
          } else {
            // Gold gradient
            r = 245; g = 158; b = 11;
            // Plus mark / Taka sign center
            const pW = coinRadius * 0.22;
            const pH = coinRadius * 0.65;
            const inV = Math.abs(x - coinCx) <= pW / 2 && Math.abs(y - coinCy) <= pH / 2;
            const inH = Math.abs(y - coinCy) <= pW / 2 && Math.abs(x - coinCx) <= pH / 2;
            if (inV || inH) {
              r = 255; g = 255; b = 255;
            }
          }
        }
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate icons
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPng(64, 64, false));

console.log('All PWA icons generated successfully!');
