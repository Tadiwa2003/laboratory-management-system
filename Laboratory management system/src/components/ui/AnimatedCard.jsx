import * as React from "react";
import { cn } from "../../utils/cn";

// --- Card Components ---

export function AnimatedCard({ className, ...props }) {
  return (
    <div
      role="region"
      className={cn(
        "group/animated-card relative w-full overflow-hidden rounded-xl border-2 border-gray-700/60 bg-gray-800/60 backdrop-blur-sm shadow-xl transition-all duration-300 hover:bg-gray-800/90 hover:border-primary-500/70 hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1",
        className
      )}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }) {
  return (
    <div
      role="group"
      className={cn(
        "flex flex-col space-y-1.5 border-t border-gray-700/50 p-6",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn(
        "text-xl font-bold leading-none tracking-tight text-white group-hover/animated-card:text-primary-400 transition-colors duration-300 mb-2",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p
      className={cn(
        "text-sm text-gray-300 leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

export function CardVisual({ className, ...props }) {
  return (
    <div
      className={cn("h-[180px] w-full overflow-hidden relative", className)}
      {...props}
    />
  );
}

// --- Visual Components ---

export function DocVisual({ 
  mainColor = "#3b82f6", 
  secondaryColor = "#8b5cf6",
  icon: Icon,
  gradient = "from-blue-500/20 to-purple-500/20"
}) {
  return (
    <div
      aria-hidden
      className="relative h-full w-full overflow-hidden rounded-t-xl"
    >
      {/* Gradient Background with more visibility */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      
      {/* Animated gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover/animated-card:opacity-60 transition-opacity duration-500`} />
      
      {/* Grid Pattern - more visible */}
      <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:20px_20px]" />
      
      {/* Icon - larger and more visible */}
      {Icon && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="ease-[cubic-bezier(0.6, 0.6, 0, 1)] transform transition-all duration-500 group-hover/animated-card:scale-125 group-hover/animated-card:rotate-6">
            <Icon className="w-24 h-24 text-white/60 group-hover/animated-card:text-white transition-colors duration-500 drop-shadow-lg" strokeWidth={2} />
          </div>
        </div>
      )}
      
      {/* Animated overlay on hover */}
      <div className="ease-[cubic-bezier(0.6, 0.6, 0, 1)] absolute inset-0 z-[7] flex items-start justify-start bg-transparent p-4 -translate-y-full transition-transform duration-500 group-hover/animated-card:translate-y-0">
        <div className="ease-[cubic-bezier(0.6, 0.6, 0, 1)] rounded-lg border border-white/30 bg-white/20 p-3 opacity-0 backdrop-blur-md transition-opacity duration-500 group-hover/animated-card:opacity-100 shadow-lg">
          <p className="text-sm font-semibold text-white">View Documentation</p>
          <p className="text-xs text-white/80 mt-1">Click to read more</p>
        </div>
      </div>
      
      {/* Radial gradient overlay - subtle */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.2)_100%)]" />
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/animated-card:translate-x-full transition-transform duration-1000 ease-in-out" />
    </div>
  );
}

