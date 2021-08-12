import React, { useState } from "react";

/**
 *
 * @param {ReactNode} menu Recieves container's menu
 * @param {String} direction Recieves position of menu. Enun: "right","left","center"| default: right
 * @returns React Component: div with hoverable menu
 */
export default function ContainerWithMenu({
  menu = null,
  children,
  leftMenu = null,
  ...props
}) {
  const [isElementHovered, setIsElementHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => {
        setIsElementHovered(true);
      }}
      onMouseLeave={() => {
        setIsElementHovered(false);
      }}
      style={{ position: "relative" }}
      {...props}
    >
      {menu !== null && (
        <div
          style={{
            position: "absolute",
            right: 16,
            top: 2,
            zIndex: 20,
            opacity: isElementHovered ? 100 : 0,
            transition: "opacity 100ms linear",
          }}
        >
          {menu}
        </div>
      )}
      {leftMenu !== null && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 20,
            opacity: isElementHovered ? 100 : 0,
            transition: "opacity 100ms linear",
          }}
        >
          {leftMenu}
        </div>
      )}
      {children}
    </div>
  );
}
