import React, { useState } from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
  skeletonStyle?: React.CSSProperties;
};

const defaultFallback = "https://via.placeholder.com/120x160?text=Indispo";

const ImageWithFallback: React.FC<Props> = ({
  src,
  alt,
  fallbackSrc = defaultFallback,
  skeletonStyle = { background: "#f3f3f3", borderRadius: 8 },
  style,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Merge le style de l’utilisateur avec l’objectFit par défaut
  const mergedStyle: React.CSSProperties = {
    display: loaded && !error ? "block" : "none",
    width: rest.width,
    height: rest.height,
    objectFit: "cover",
    borderRadius: style?.borderRadius || 8,
    ...style, // Pour laisser l’utilisateur override si besoin
  };

  return (
    <>
      {!loaded && !error && (
        <div
          style={{
            width: rest.width || 120,
            height: rest.height || 160,
            ...skeletonStyle,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div className="skeleton" />
        </div>
      )}
      <img
        src={error ? fallbackSrc : src}
        alt={alt}
        style={mergedStyle}
        {...rest}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </>
  );
};

export default ImageWithFallback;
