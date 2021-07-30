import React, { useState } from "react";

/**
 *
 * @param {ReactNode} menu Recieves container's menu
 * @param {String} direction Recieves position of menu. Enun: "right","left","center"| default: right
 * @returns React Component: div with hoverable menu
 */
export default function ContainerWithMenu({ menu, children, ...props }) {
  const [isElementHovered, setIsElementHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => {
        setIsElementHovered(true);
      }}
      onMouseLeave={() => {
        setIsElementHovered(false);
      }}
      {...props}
    >
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
      {children}
    </div>
  );
}
