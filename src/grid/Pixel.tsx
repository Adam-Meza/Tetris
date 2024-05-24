import React from 'react';

/**
 * Pixel component
 * @example
 *
 * @returns Basic Pixel Unit
 */
export const Pixel = React.forwardRef<HTMLSpanElement>(
  ({ children }, ref) => {
    return <span ref={ref}>{children}</span>;
  }
);
