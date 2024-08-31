import React, { ReactNode, useState } from "react";
import ReactDOM from "react-dom";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const showTooltip = (event: React.MouseEvent) => {
    const { top, left, height } = event.currentTarget.getBoundingClientRect();
    setCoords({ top: top + window.scrollY - height / 2, left: left + window.scrollX });
    setVisible(true);
  };

  const hideTooltip = () => setVisible(false);

  return (
    <div className="relative inline-block">
      <div
        className="cursor-pointer"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </div>
      {visible &&
        ReactDOM.createPortal(
          <div
            style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
            className="fixed px-3 py-1 bg-gray-800 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-50"
          >
            {content}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full border-8 border-transparent border-t-gray-800"></div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Tooltip;
