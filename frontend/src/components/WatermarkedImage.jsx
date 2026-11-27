import React, { useState } from 'react';

const STAMP_GROUP = (cx, cy) =>
  `<g transform="translate(${cx}, ${cy}) rotate(-28)">` +
    `<g transform="translate(-76, -15) scale(0.3)">` +
      `<circle cx="50" cy="50" r="44" fill="#0c3d6c"/>` +
      `<circle cx="50" cy="50" r="38" fill="#ffffff"/>` +
      `<path d="M30 70C30 45 45 30 60 30C63.5 30 67 32 67 36C67 47 47 47 47 70C47 73.5 44 76 40 76C36 76 33 73.5 30 70Z" fill="#0c3d6c"/>` +
      `<path d="M47 70C47 47 62 38 75 38C78.5 38 82 41.5 82 45C82 56 62 56 62 76C62 79.5 58.5 83 55 83C51.5 83 47 79.5 47 70Z" fill="#16a34a"/>` +
      `<circle cx="50" cy="50" r="8" fill="#ffffff" stroke="#1b75bc" stroke-width="2.5"/>` +
    `</g>` +
    `<text x="-40" y="5" font-size="14" font-weight="800" font-family="Arial, Helvetica, sans-serif" letter-spacing="0.5" fill="#0f172a" stroke="#ffffff" stroke-width="2.5" paint-order="stroke">NIYANSH PHARMA</text>` +
  `</g>`;

const WATERMARK_DATA_URI = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="220" viewBox="0 0 340 220">` +
    `<g opacity="0.22">${STAMP_GROUP(85, 55)}${STAMP_GROUP(255, 165)}</g>` +
  `</svg>`
)}")`;

export function hasBakedNiyanshWatermark(url) {
  if (!url || typeof url !== 'string') return false;
  return /(?:[?&]npwm=1|#npwm)(?:&|$)/.test(url);
}

export function markUrlAsWatermarked(url) {
  if (!url || typeof url !== 'string') return url;
  if (hasBakedNiyanshWatermark(url)) return url;
  if (url.startsWith('data:')) {
    return `${url}#npwm`;
  }
  return `${url}${url.includes('?') ? '&' : '?'}npwm=1`;
}

/**
 * Displays a product image with copy-protection (disabled right-click/drag)
 * and a diagonal tiled "NIYANSH PHARMA" brand watermark for any existing or
 * external-URL image that doesn't already have the baked upload watermark.
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
  const imgFailed = Boolean(src) && failedSrc === src;

  const alreadyBaked = hasBakedNiyanshWatermark(src);
  const showOverlay = Boolean(src) && !imgFailed && !disableWatermark && !alreadyBaked;

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
        src={src}
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
