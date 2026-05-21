import React from "react";
import { IconProps } from "./types";

const IconArrowLeft: React.FC<IconProps> = ({
  color = "currentColor",
  size = 16,
  className = "",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={{ color }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  );
};

export default IconArrowLeft;
