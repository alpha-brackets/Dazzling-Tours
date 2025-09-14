import { useState } from "react";

interface DropDownProps {
  children: React.ReactNode;
}

export default function DropDown({ children }: DropDownProps) {
  // Mobile Toggle
  const [mobileToggle, setMobileToggle] = useState(false);
  const handelMobileToggle = () => {
    setMobileToggle(!mobileToggle);
  };
  return (
    <>
      <span
        className={
          mobileToggle
            ? "cs-munu_dropdown_toggle active"
            : "cs-munu_dropdown_toggle"
        }
        onClick={handelMobileToggle}
      >
        <span></span>
      </span>
      {children}
    </>
  );
}
