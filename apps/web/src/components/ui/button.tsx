/**
 * @fileoverview Button component with variant and size support.
 * @module components/ui/button
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Supported button visual variants.
 */
export type ButtonVariants =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

/**
 * Supported button sizes.
 */
type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button component props.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: ButtonVariants;
  /** Size of the button */
  size?: ButtonSize;
  /** Render as a wrapper component instead of a button element */
  asChild?: boolean;
}

/**
 * Size class mapping.
 */
const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3',
  md: 'h-10 px-4 py-2',
  lg: 'h-11 px-8',
};

/**
 * Variant class mapping.
 */
const variants: Record<ButtonVariants, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline:
    'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
};

/**
 * Base button component with variant, size, and accessibility support.
 *
 * @example
 * <Button variant="destructive" size="lg" onClick={handleDelete}>
 *   Delete Project
 * </Button>
 *
 * @example
 * <Button asChild variant="outline">
 *   <Link href="/dashboard">Go to Dashboard</Link>
 * </Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };