
"use client";

import { useRef, useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

interface AnimatedDivProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const AnimatedDiv = ({ children, className, ...props }: AnimatedDivProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.1, freezeOnceVisible: true });
  const [hasAnimated, setHasAnimated] = useState(false);

  const isVisible = !!entry?.isIntersecting;

  useEffect(() => {
    if (isVisible) {
      setHasAnimated(true);
    }
  }, [isVisible]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedDiv;
