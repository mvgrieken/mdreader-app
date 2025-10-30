import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combineert clsx en tailwind-merge voor conditionele class names
 * Zorgt ervoor dat Tailwind classes correct worden samengevoegd
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
