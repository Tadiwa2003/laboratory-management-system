import * as React from "react";
import { useState } from "react";
import { cn } from "../../utils/cn";

// --- Card Components ---

export function AnimatedChartCard({ className, ...props }) {
  return (
    <div
      role="region"
      className={cn(
        "group/animated-card relative w-full overflow-hidden rounded-xl border-2 border-gray-700/60 bg-white dark:bg-gray-800/60 backdrop-blur-sm shadow-xl transition-all duration-300 hover:bg-white dark:hover:bg-gray-800/90 hover:border-primary-500/70 hover:shadow-2xl hover:scale-[1.01]",
        className
      )}
      {...props}
    />
  );
}

export function ChartCardBody({ className, ...props }) {
  return (
    <div
      role="group"
      className={cn(
        "flex flex-col space-y-1.5 border-t border-gray-200 dark:border-gray-700/50 p-6",
        className
      )}
      {...props}
    />
  );
}

export function ChartCardTitle({ className, ...props }) {
  return (
    <h3
      className={cn(
        "text-xl font-bold leading-none tracking-tight text-gray-900 dark:text-white group-hover/animated-card:text-primary-600 dark:group-hover/animated-card:text-primary-400 transition-colors duration-300 mb-2",
        className
      )}
      {...props}
    />
  );
}

export function ChartCardDescription({ className, ...props }) {
  return (
    <p
      className={cn(
        "text-sm text-gray-600 dark:text-gray-300 leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

export function ChartCardVisual({ className, ...props }) {
  return (
    <div
      className={cn("h-[200px] w-full overflow-hidden relative", className)}
      {...props}
    />
  );
}

// --- Animated Chart Background Component ---

export function AnimatedChartBackground({ 
  mainColor = "#8b5cf6", 
  secondaryColor = "#0ea5e9",
  hovered = false
}) {
  return (
    <div
      aria-hidden
      className="relative h-full w-full overflow-hidden rounded-t-xl"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/80 via-gray-900/60 to-gray-800/80" />
      
      {/* Animated gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br from-${mainColor}/20 to-${secondaryColor}/20 opacity-0 group-hover/animated-card:opacity-60 transition-opacity duration-500`} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:20px_20px]" />
      
      {/* Animated bars visualization - decorative background */}
      <div className="absolute inset-0 flex items-end justify-center gap-2 px-4 pb-4 opacity-20">
        {[40, 55, 50, 65, 55, 70].map((height, idx) => (
          <div
            key={idx}
            className="flex-1 max-w-[40px] relative"
            style={{
              height: `${height}%`,
            }}
          >
            <div
              className="absolute bottom-0 left-0 right-0 rounded-t transition-all duration-500 ease-out"
              style={{
                height: '100%',
                background: `linear-gradient(to top, ${mainColor}, ${secondaryColor})`,
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.3)_100%)]" />
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/animated-card:translate-x-full transition-transform duration-1000 ease-in-out" />
    </div>
  );
}

