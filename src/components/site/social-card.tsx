import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type PointerEvent as ReactPointerEvent,
  type SVGProps,
} from "react";

function RobuxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 1.6 21.5 7v10L12 22.4 2.5 17V7L12 1.6Zm0 2.6L5 8.2v7.6l7 4 7-4V8.2l-7-4Zm-3.4 4h6.8v6.8H8.6V8.2Zm2 2v2.8h2.8V10.2h-2.8Z" />
    </svg>
  );
}

type Spark = { id: number; x: number; y: number; s: number };

export function SocialCard({
  name,
  handle,
  Icon,
  href,
}: {
  name: string;
  handle: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  href: string;
  delayIndex?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const maxRef = useRef(1);
  const sparkId = useRef(0);
  const lastSpark = useRef(0);
  const opened = useRef(false);

  const [x, setX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);

  const progress = Math.min(1, x / maxRef.current);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    maxRef.current = Math.max(1, el.clientWidth - 60);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const addSpark = (px: number) => {
    const now = performance.now();
    if (now - lastSpark.current < 70) return;
    lastSpark.current = now;
    const id = sparkId.current++;
    setSparks((p) => [
      ...p,
      { id, x: px, y: 6 + Math.random() * 22, s: 0.6 + Math.random() * 0.8 },
    ]);
    window.setTimeout(() => setSparks((p) => p.filter((s) => s.id !== id)), 800);
  };

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    measure();
    opened.current = false;
    setUnlocked(false);
    setDragging(true);
    startX.current = e.clientX - x;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging || opened.current) return;
    const next = Math.min(maxRef.current, Math.max(0, e.clientX - startX.current));
    setX(next);
    if (next > 4) addSpark(next + 26);
    if (next >= maxRef.current - 2) {
      opened.current = true;
      setUnlocked(true);
      setDragging(false);
      navigator.vibrate?.(18);
      window.setTimeout(() => window.open(href, "_blank", "noopener,noreferrer"), 140);
      window.setTimeout(() => {
        setUnlocked(false);
        setX(0);
      }, 700);
    }
  };

  const release = () => {
    if (!dragging) return;
    setDragging(false);
    setX(0);
  };

  return (
    <div className="neon-frame block h-full" style={{ boxShadow: "var(--shadow-card)" }}>
      <div
        dir="ltr"
        className="group relative h-full select-none rounded-[calc(var(--radius-3xl)-3px)] bg-card/85 p-4 backdrop-blur-xl sm:p-5"
      >
        <div className="relative mb-3 h-6 overflow-hidden">
          <h3 className="font-display text-base font-bold tracking-wide transition-all duration-300 group-hover:-translate-y-full group-hover:opacity-0">
            {name}
          </h3>
          <span className="absolute inset-0 flex translate-y-full items-center font-display text-sm font-bold tracking-wide text-primary opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            {handle}
          </span>
        </div>

        {/* drag track */}
        <div
          ref={trackRef}
          className="relative h-14 overflow-hidden rounded-2xl border-2 border-primary/25 bg-deep/60 transition-colors duration-300"
          style={{
            borderColor: unlocked
              ? "color-mix(in oklab, var(--neon) 90%, transparent)"
              : undefined,
          }}
        >
          <div
            className="absolute inset-y-0 left-0"
            style={{
              width: `${x + 52}px`,
              transition: dragging ? "none" : "width 0.4s cubic-bezier(0.22,1,0.36,1)",
              background:
                "linear-gradient(90deg, color-mix(in oklab, var(--neon) 30%, transparent), color-mix(in oklab, var(--neon-soft) 18%, transparent), transparent)",
            }}
          />

          <span
            className="pointer-events-none absolute inset-y-0 right-4 flex items-center gap-1 font-display text-[11px] font-bold tracking-[0.25em] text-muted-foreground"
            style={{ opacity: unlocked ? 0 : 0.9 - progress }}
          >
            SLIDE
            <span className="text-primary">›››</span>
          </span>

          <span
            className="pointer-events-none absolute inset-0 grid place-items-center font-display text-xs font-black tracking-widest text-primary transition-opacity duration-200"
            style={{ opacity: unlocked ? 1 : 0 }}
          >
            OPENING…
          </span>

          {sparks.map((s) => (
            <RobuxIcon
              key={s.id}
              className="pointer-events-none absolute h-4 w-4 text-primary"
              style={{
                left: `${s.x}px`,
                top: `${s.y}px`,
                transform: `scale(${s.s})`,
                animation: "robux-pop 0.8s ease-out forwards",
                filter: "drop-shadow(0 0 8px color-mix(in oklab, var(--neon) 70%, transparent))",
              }}
            />
          ))}

          <div
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={release}
            onPointerCancel={release}
            className="absolute top-1 left-1 grid h-12 w-12 cursor-grab touch-none place-items-center rounded-xl border border-primary/50 bg-primary/15 text-primary active:cursor-grabbing"
            style={{
              transform: `translateX(${x}px) scale(${dragging ? 1.06 : 1})`,
              transition: dragging
                ? "transform 0.06s linear"
                : "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
              boxShadow: "var(--shadow-neon)",
            }}
          >
            <Icon className="h-6 w-6" aria-label={`${name} icon`} />
          </div>
        </div>
      </div>
    </div>
  );
}
