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
  delayIndex,
}: {
  name: string;
  handle: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  href: string;
  delayIndex: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const maxRef = useRef(0);
  const sparkId = useRef(0);
  const lastSpark = useRef(0);
  const opened = useRef(false);

  const [x, setX] = useState(0);
  const [max, setMax] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);

  const progress = Math.min(1, x / Math.max(1, max));

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const m = Math.max(1, el.clientWidth - 64);
    maxRef.current = m;
    setMax(m);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const addSpark = (px: number) => {
    const now = performance.now();
    if (now - lastSpark.current < 90) return;
    lastSpark.current = now;
    const id = sparkId.current++;
    const spark: Spark = {
      id,
      x: px,
      y: 8 + Math.random() * 20,
      s: 0.7 + Math.random() * 0.7,
    };
    setSparks((p) => [...p, spark]);
    window.setTimeout(() => setSparks((p) => p.filter((s) => s.id !== id)), 800);
  };

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    measure();
    opened.current = false;
    setDragging(true);
    startX.current = e.clientX - x;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const next = Math.min(maxRef.current, Math.max(0, e.clientX - startX.current));
    setX(next);
    if (next > 6) addSpark(next + 28);
    if (next >= maxRef.current - 1 && !opened.current) {
      opened.current = true;
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  const release = () => {
    if (!dragging) return;
    setDragging(false);
    setX(0);
  };

  return (
    <div
      dir="ltr"
      className="glass group relative select-none rounded-3xl p-4 transition-[border-color,box-shadow] duration-300 hover:border-primary/60 sm:p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="min-w-0">
          <div className="relative h-6 overflow-hidden">
            <h3 className="font-display text-base font-bold tracking-wide transition-all duration-300 group-hover:-translate-y-full group-hover:opacity-0">
              {name}
            </h3>
            <span className="absolute inset-0 flex translate-y-full items-center font-display text-sm font-bold tracking-wide text-primary opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {handle}
            </span>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{handle}</p>
        </div>
      </div>

      {/* drag track */}
      <div
        ref={trackRef}
        className="relative h-14 overflow-hidden rounded-2xl border border-primary/25 bg-primary/5"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-2xl transition-[width] duration-100"
          style={{
            width: `${x + 56}px`,
            background:
              "linear-gradient(90deg, color-mix(in oklab, var(--neon) 22%, transparent), transparent)",
          }}
        />

        <span
          className="pointer-events-none absolute inset-0 grid place-items-center font-display text-[11px] font-bold tracking-widest text-muted-foreground transition-opacity duration-200"
          style={{ opacity: 1 - progress * 1.4 }}
        >
          اسحب للفتح ⟶
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
          className="absolute top-1 left-1 grid h-12 w-12 cursor-grab touch-none place-items-center rounded-xl border border-primary/40 bg-primary/15 text-primary active:cursor-grabbing"
          style={{
            transform: `translateX(${x}px)`,
            transition: dragging ? "none" : "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
            boxShadow: "var(--shadow-neon)",
          }}
        >
          <Icon
            className="float-soft h-6 w-6"
            style={{ animationDelay: `${delayIndex * 0.4}s` }}
            aria-label={`${name} icon`}
          />
        </div>
      </div>
    </div>
  );
}
