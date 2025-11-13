import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge classNames using clsx and tailwind-merge
 * This ensures proper Tailwind class merging and conflict resolution
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default cn;



