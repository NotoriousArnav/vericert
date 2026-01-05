"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

import { cn } from "@/lib/utils";

export const BackgroundRippleEffect = ({
  className,
  cellClassName,
  children,
}: {
  className?: string;
  cellClassName?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "relative flex h-screen flex-col items-center justify-center overflow-hidden bg-background",
        className
      )}
    >
      <RippleEffect cellClassName={cellClassName} />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const RippleEffect = ({ cellClassName }: { cellClassName?: string }) => {
  // Use a predefined matrix to avoid hydration mismatches
  const rows = 20;
  const cols = 20;
  const [matrix, setMatrix] = useState<Array<Array<number>>>([]);
  const controls = useAnimation();

  useEffect(() => {
    // Generate matrix only on client-side to ensure deterministic render
    const newMatrix = Array.from({ length: rows }, (_, i) =>
      Array.from({ length: cols }, (_, j) => i * cols + j)
    );
    setMatrix(newMatrix);
  }, []);

  const [activeCell, setActiveCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  useEffect(() => {
    if (activeCell) {
      controls.start((i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;

        const distance = Math.sqrt(
          Math.pow(activeCell.row - row, 2) + Math.pow(activeCell.col - col, 2)
        );

        return {
          opacity: 1 - distance * 0.1,
          scale: 1 - distance * 0.05,
          transition: {
            duration: distance * 0.1,
          },
        };
      });
    }
  }, [activeCell, controls]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor((x / rect.width) * cols);
    const row = Math.floor((y / rect.height) * rows);

    setActiveCell({ row, col });
  };

  const handleMouseLeave = () => {
    setActiveCell(null);
    controls.start({
      opacity: 0.1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    });
  };

  return (
    <div
      className="absolute inset-0 flex flex-col gap-0.5 mask-image:radial-gradient(white,transparent_80%)"
      style={{
        maskImage: "radial-gradient(circle, white, transparent 90%)",
        WebkitMaskImage: "radial-gradient(circle, white, transparent 90%)",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {matrix.map((row, rowIdx) => (
        <div key={`row-${rowIdx}`} className="flex flex-1 gap-0.5">
          {row.map((cellIndex) => (
            <motion.div
              key={`cell-${cellIndex}`}
              custom={cellIndex}
              animate={controls}
              initial={{
                opacity: 0.1,
                scale: 1,
              }}
              className={cn(
                "flex-1 bg-white/10 dark:bg-black/10 rounded-sm border border-white/5 dark:border-white/5",
                cellClassName
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
