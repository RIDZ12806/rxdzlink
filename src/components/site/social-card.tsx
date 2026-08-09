import { useRef, type MouseEvent } from "react";
import { RippleLink } from "./ripple-link";

export function SocialCard({
  name,
  handle,
  image,
  href,
  delayIndex,
}: {
  name: string;
  handle: string;
  image: string;
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
        className="glass relative flex flex-col items-center gap-4 rounded-3xl p-6 transition-[transform,box-shadow,border-color] duration-300 group-hover:border-primary/60 sm:p-7"
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
        <img
          src={image}
          alt={`${name} icon`}
          loading="lazy"
          className="float-soft h-24 w-24 object-contain drop-shadow-[0_0_25px_color-mix(in_oklab,var(--neon)_45%,transparent)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 sm:h-28 sm:w-28"
          style={{ animationDelay: `${delayIndex * 0.4}s` }}
        />
        <div className="text-center">
          <h3 className="font-display text-lg font-bold tracking-wide">{name}</h3>
          <p className="mt-1 text-sm text-muted-foreground" dir="ltr">
            {handle}
          </p>
        </div>
        <span className="rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-[0_0_24px_color-mix(in_oklab,var(--neon)_45%,transparent)]">
          فتح الرابط ↗
        </span>
      </div>
    </RippleLink>
  );
}
