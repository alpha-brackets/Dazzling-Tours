import React from "react";
import { IconProps } from "./types";
import { ICON_DEFAULTS } from "./constants";

const IconTick: React.FC<IconProps> = ({
  color = ICON_DEFAULTS.color,
  size = ICON_DEFAULTS.size,
  className = ICON_DEFAULTS.className,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
    >
      <path d="M27 55L6 33 9 29 26 41 55 12 59 16z" fill={color} />
    </svg>
  );
};

export default IconTick;
