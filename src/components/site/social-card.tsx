import { useRef, type ComponentType, type MouseEvent, type SVGProps } from "react";
import { RippleLink } from "./ripple-link";

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
  const cardRef = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    el.style.setProperty("--rx", `${((y - r.height / 2) / r.height) * -8}deg`);
    el.style.setProperty("--ry", `${((x - r.width / 2) / r.width) * 8}deg`);
  };

  const onLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <RippleLink href={href} className="group block rounded-3xl">
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        dir="ltr"
        className="glass relative flex items-center gap-4 rounded-3xl p-5 text-left transition-[transform,box-shadow,border-color] duration-300 group-hover:border-primary/60 group-active:scale-[0.96] sm:p-6"
        style={{
          transform: "perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(240px circle at var(--mx,50%) var(--my,50%), color-mix(in oklab, var(--neon) 22%, transparent), transparent 70%)",
          }}
        />
        <span
          className="float-soft grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-primary/35 bg-primary/10 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
          style={{ animationDelay: `${delayIndex * 0.4}s` }}
        >
          <Icon
            className="h-7 w-7 drop-shadow-[0_0_16px_color-mix(in_oklab,var(--neon)_60%,transparent)]"
            aria-label={`${name} icon`}
          />
        </span>
        <div className="min-w-0">
          <div className="relative h-6 overflow-hidden">
            <h3 className="font-display text-base font-bold tracking-wide transition-all duration-300 group-hover:-translate-y-full group-hover:opacity-0">
              {name}
            </h3>
            <span className="absolute inset-0 flex translate-y-full items-center font-display text-sm font-bold tracking-wide text-primary opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {handle}
            </span>
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">{handle}</p>
        </div>
      </div>
    </RippleLink>
  );
}
