import React, { useMemo, useId } from 'react';
import { motion } from 'motion/react';

const GradientTracing = ({
  width = 240,
  height = 120,
  baseColor = 'rgba(255,255,255,0.2)',
  gradientColors = ['#2EB9DF', '#2EB9DF', '#9E00FF'],
  animationDuration = 3,
  strokeWidth = 2,
  path,
  className = '',
}) => {
  const id = useId();
  const gradientId = useMemo(() => `gradient-tracing-${id.replace(/:/g, '')}`, [id]);

  const defaultPath = useMemo(() => {
    const midY = height / 2;
    return `M0,${midY} C${width * 0.25},${midY - height * 0.4} ${width * 0.75},${midY + height * 0.4} ${width},${midY}`;
  }, [width, height]);

  const drawingPath = path || defaultPath;

  return (
    <div className={`relative select-none ${className}`} style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
        <path d={drawingPath} stroke={baseColor} strokeOpacity="0.35" strokeWidth={strokeWidth} />
        <path d={drawingPath} stroke={`url(#${gradientId})`} strokeLinecap="round" strokeWidth={strokeWidth + 0.75} />
        <defs>
          <motion.linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            animate={{ x1: [0, width], x2: [width, width * 2] }}
            transition={{ duration: animationDuration, repeat: Infinity, ease: 'linear' }}
          >
            <stop offset="0" stopColor={gradientColors[0]} stopOpacity="0" />
            <stop offset="0.5" stopColor={gradientColors[1]} stopOpacity="0.85" />
            <stop offset="1" stopColor={gradientColors[2]} stopOpacity="0" />
          </motion.linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default GradientTracing;
