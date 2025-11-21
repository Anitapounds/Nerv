"use client";

import { ComponentPropsWithoutRef, ElementType, forwardRef } from "react";

type IntrinsicElement = keyof JSX.IntrinsicElements;

// Animation props that should be filtered out
const animationProps = [
  'initial',
  'animate',
  'exit',
  'whileInView',
  'whileHover',
  'whileTap',
  'whileFocus',
  'whileDrag',
  'transition',
  'variants',
  'viewport',
];

function createMotionComponent<T extends IntrinsicElement>(Tag: T) {
  type Props = ComponentPropsWithoutRef<T> & {
    [key: string]: any;
  };

  return forwardRef<HTMLElement, Props>(({ children, ...rest }, ref) => {
    const Comp = Tag as ElementType;

    // Filter out animation props before passing to DOM
    const domProps = Object.keys(rest).reduce((acc, key) => {
      if (!animationProps.includes(key)) {
        acc[key] = rest[key];
      }
      return acc;
    }, {} as any);

    return (
      <Comp ref={ref as any} {...domProps}>
        {children}
      </Comp>
    );
  });
}

export const motion = {
  div: createMotionComponent("div"),
  h1: createMotionComponent("h1"),
  h2: createMotionComponent("h2"),
};
