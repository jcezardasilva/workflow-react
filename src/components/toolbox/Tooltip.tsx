import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'right'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      let x = 0;
      let y = 0;

      switch (position) {
        case 'right':
          x = rect.right + 8;
          y = rect.top + rect.height / 2;
          break;
        case 'left':
          x = rect.left - 8;
          y = rect.top + rect.height / 2;
          break;
        case 'top':
          x = rect.left + rect.width / 2;
          y = rect.top - 8;
          break;
        case 'bottom':
          x = rect.left + rect.width / 2;
          y = rect.bottom + 8;
          break;
      }

      setTooltipPosition({ x, y });
    }
  };

  const handleMouseEnter = () => {
    updatePosition();
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
    }
  }, [isVisible, position]);

  if (!content || content.trim() === '') {
    return <>{children}</>;
  }

  return (
    <div
      ref={triggerRef}
      style={{ 
        position: 'relative', 
        display: 'inline-block', 
        width: '100%' 
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            zIndex: 99999,
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            lineHeight: '1.4',
            maxWidth: '250px',
            minWidth: '100px',
            wordWrap: 'break-word',
            whiteSpace: 'normal',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            border: '1px solid #333',
            transform: position === 'right' || position === 'left' 
              ? 'translateY(-50%)' 
              : 'translateX(-50%)',
            pointerEvents: 'none'
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
