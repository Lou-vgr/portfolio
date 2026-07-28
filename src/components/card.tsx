"use client";

import { motion } from "framer-motion";
import {
  useState,
  useRef,
  type CSSProperties,
  type MouseEvent,
} from "react";

interface FlipCardProps {
  cards: string[];
  transition?: any;
  tilt?: boolean;
  tiltOptions?: {
    effect: "attract" | "repel";
    tiltLimit: number;
    scale: number;
  };
  style?: CSSProperties;
}

const DEFAULTS = {
  transition: {
    type: "tween",
    duration: 0.6,
    ease: "easeInOut",
  },
  tiltOptions: {
    effect: "repel" as const,
    tiltLimit: 15,
    scale: 105,
  },
};

const HALF_TURN = 180;
const PERSPECTIVE = 900;

export default function FlipCard(props: FlipCardProps) {
  const {
    cards = [],
    transition = DEFAULTS.transition,
    tilt = true,
    tiltOptions = DEFAULTS.tiltOptions,
    style,
  } = props;

  const tiltRef = useRef<HTMLDivElement | null>(null);

  const effect = tiltOptions?.effect ?? DEFAULTS.tiltOptions.effect;
  const tiltLimit = tiltOptions?.tiltLimit ?? DEFAULTS.tiltOptions.tiltLimit;
  const scale = (tiltOptions?.scale ?? DEFAULTS.tiltOptions.scale) / 100;

  const [angle, setAngle] = useState(0);
  const [index, setIndex] = useState(0);
  const [faces, setFaces] = useState({ a: 0, b: 0 });

  const facing = (deg: number) =>
    Math.abs(Math.round(deg / HALF_TURN)) % 2 === 0 ? "a" : "b";

  const flip = (dir: 1 | -1) => {
    const n = cards.length;
    if (n < 2) return;

    const next = (index + dir + n) % n;
    const nextAngle = angle + dir * HALF_TURN;
    const incoming = facing(nextAngle);
    
    setFaces((f) => ({ ...f, [incoming]: next }));
    setIndex(next);
    setAngle(nextAngle);
  };

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isLeft = e.clientX - rect.left < rect.width / 2;
    flip(isLeft ? -1 : 1);
  };

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!tilt || !el) return;
    const { width, height, top, left } = el.getBoundingClientRect();
    const mult = effect === "repel" ? -1 : 1;
    const tiltX = ((e.clientY - top) / height - 0.5) * (tiltLimit * 2) * mult;
    const tiltY = ((e.clientX - left) / width - 0.5) * -(tiltLimit * 2) * mult;
    el.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`;
  };

  const onLeave = () => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  const faceStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    userSelect: "none",
  };

  if (!cards.length) return null;

  return (
    <div
      style={{
        ...style,
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: `${PERSPECTIVE}px`,
        cursor: cards.length > 1 ? "pointer" : "default",
      }}
    >
      <div
        ref={tiltRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={onClick}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.2s ease-out",
          willChange: "transform",
        }}
      >
        <motion.div
          animate={{ rotateY: angle }}
          transition={transition}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
          }}
        >
          <div 
            style={faceStyle}
            dangerouslySetInnerHTML={{ __html: cards[faces.a % cards.length] }}
          />
          <div
            style={{
              ...faceStyle,
              transform: "rotateY(180deg)",
            }}
            dangerouslySetInnerHTML={{ __html: cards[faces.b % cards.length] }}
          />
        </motion.div>
      </div>
    </div>
  );
}