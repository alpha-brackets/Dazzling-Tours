import React from "react";
import Image from "next/image";

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "square" | "rounded";
  className?: string;
  fallbackColor?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = "md",
  shape = "circle",
  className = "",
  fallbackColor = "#6b7280",
}) => {
  // Size configurations
  const sizeConfig = {
    xs: { size: 20, fontSize: "0.6rem" },
    sm: { size: 32, fontSize: "0.75rem" },
    md: { size: 40, fontSize: "0.875rem" },
    lg: { size: 56, fontSize: "1rem" },
    xl: { size: 80, fontSize: "1.25rem" },
  };

  const { size: avatarSize, fontSize } = sizeConfig[size];

  // Shape configurations
  const shapeClass = {
    circle: "rounded-full",
    square: "rounded-none",
    rounded: "rounded-lg",
  };

  const avatarClasses = `
    avatar-component
    ${shapeClass[shape]}
    ${className}
    font-medium
    text-white
    overflow-hidden
    flex-shrink-0
    border-0
  `.trim();

  const avatarStyle = {
    width: `${avatarSize}px`,
    height: `${avatarSize}px`,
    fontSize,
    backgroundColor: fallbackColor,
  };

  const imageStyle = {
    width: `${avatarSize}px`,
    height: `${avatarSize}px`,
  };

  const renderContent = () => {
    if (src) {
      return (
        <Image
          src={src}
          alt={alt}
          width={avatarSize}
          height={avatarSize}
          style={imageStyle}
          className={`object-cover ${shapeClass[shape]} avatar-image`}
          onError={(e) => {
            // Hide image on error and show fallback
            e.currentTarget.style.display = "none";
          }}
        />
      );
    }

    return (
      <svg
        width={avatarSize * 0.6}
        height={avatarSize * 0.6}
        viewBox="0 0 24 24"
        fill="currentColor"
        className="opacity-70"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    );
  };

  return (
    <div className={avatarClasses} style={avatarStyle}>
      {renderContent()}
    </div>
  );
};

export default Avatar;
