import React, { useEffect, useState } from 'react';
import {
  WATERMARK_DATA_URI,
  applyNiyanshWatermark,
  hasBakedNiyanshWatermark,
  markUrlAsWatermarked,
} from '../utils/watermark';

export { hasBakedNiyanshWatermark, markUrlAsWatermarked };

// In-memory cache of URL -> watermarked blob URL so repeated renders across cards are instant
const bakedBlobCache = new Map();
const pendingBakeMap = new Map();

function bakeImageUrlWithWatermark(src) {
  if (!src || typeof src !== 'string') return Promise.resolve(null);
  if (bakedBlobCache.has(src)) return Promise.resolve(bakedBlobCache.get(src));
  if (pendingBakeMap.has(src)) return pendingBakeMap.get(src);

  const promise = new Promise((resolve) => {
    try {
      const img = new Image();
      if (/^https?:\/\//i.test(src)) {
        img.crossOrigin = 'anonymous';
      }
      img.onload = () => {
        try {
          const w = img.naturalWidth || img.width;
          const h = img.naturalHeight || img.height;
          if (!w || !h) {
            resolve(null);
            return;
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(null);
            return;
          }
          ctx.drawImage(img, 0, 0, w, h);
          applyNiyanshWatermark(ctx, w, h);
          canvas.toBlob(
            (blob) => {
              if (blob && blob.size > 0) {
                const blobUrl = URL.createObjectURL(blob);
                bakedBlobCache.set(src, blobUrl);
                resolve(blobUrl);
              } else {
                resolve(null);
              }
            },
            'image/webp',
            0.9
          );
        } catch (_) {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = src;
    } catch (_) {
      resolve(null);
    }
  }).finally(() => {
    pendingBakeMap.delete(src);
  });

  pendingBakeMap.set(src, promise);
  return promise;
}

/**
 * Displays a product image with copy-protection (disabled right-click/drag),
 * bakes the "NIYANSH PHARMA" tiled watermark directly into the image pixels via
 * Canvas when CORS/same-origin allows, and renders a crisp tiled SVG overlay
 * as instant display & fallback for non-CORS third-party URLs.
 */
function WatermarkedImage({
  src,
  alt = '',
  className = '',
  style = {},
  wrapperStyle = {},
  loading = 'lazy',
  onError,
  onClick,
  onMouseOver,
  onMouseOut,
  title,
  compact = false,
  disableWatermark = false,
}) {
  const [failedSrc, setFailedSrc] = useState(null);
  const [bakedEntry, setBakedEntry] = useState(() =>
    src && bakedBlobCache.has(src) ? { src, url: bakedBlobCache.get(src) } : null
  );

  const imgFailed = Boolean(src) && failedSrc === src;
  const alreadyBakedInUrl = hasBakedNiyanshWatermark(src);
  const activeBakedUrl = bakedEntry && bakedEntry.src === src ? bakedEntry.url : null;
  const effectiveSrc = activeBakedUrl || src;
  const showOverlay =
    Boolean(src) && !imgFailed && !disableWatermark && !alreadyBakedInUrl && !activeBakedUrl;

  useEffect(() => {
    if (!src || disableWatermark || alreadyBakedInUrl || compact) return;
    if (bakedBlobCache.has(src)) {
      setBakedEntry({ src, url: bakedBlobCache.get(src) });
      return;
    }
    let cancelled = false;
    bakeImageUrlWithWatermark(src).then((blobUrl) => {
      if (!cancelled && blobUrl) {
        setBakedEntry({ src, url: blobUrl });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [src, disableWatermark, alreadyBakedInUrl, compact]);

  const handleImageError = (e) => {
    setFailedSrc(src || '__failed__');
    if (typeof onError === 'function') {
      onError(e);
    }
  };

  if (imgFailed && !onError) {
    return null;
  }

  return (
    <div
      className={className ? `np-watermarked-wrap ${className}` : 'np-watermarked-wrap'}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        ...wrapperStyle,
      }}
      title={title}
      onClick={onClick}
    >
      <img
        src={effectiveSrc}
        alt={alt}
        loading={loading}
        draggable={false}
        onError={handleImageError}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center',
          display: imgFailed ? 'none' : 'block',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitUserDrag: 'none',
          ...style,
        }}
      />

      {showOverlay && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 2,
            backgroundImage: WATERMARK_DATA_URI,
            backgroundRepeat: 'repeat',
            backgroundSize: compact ? '145px 94px' : '220px 142px',
            backgroundPosition: 'center',
          }}
        />
      )}
    </div>
  );
}

export default WatermarkedImage;
