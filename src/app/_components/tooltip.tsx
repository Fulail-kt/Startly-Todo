import React, { ReactNode, useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, delay = 300 }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = useCallback(() => {
    if (triggerRef.current) {
      const { top, left, height, width } = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: top + window.scrollY + height,
        left: left + window.scrollX + width / 2
      });
      setVisible(true);
    }
  }, []);

  const startShowTimer = () => {
    timeoutRef.current = setTimeout(showTooltip, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={triggerRef}
        className="relative inline-block"
        onMouseEnter={startShowTimer}
        onMouseLeave={hideTooltip}
      >
        {children}
      </div>
      {visible &&
        createPortal(
          <div
            style={{
              position: 'absolute',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              transform: 'translateX(-50%)',
            }}
            className="px-3 py-1 bg-gray-800 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-50"
          >
            {content}
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 border-8 border-transparent border-b-gray-800"></div>
          </div>,
          document.body
        )}
    </>
  );
};

export default Tooltip;