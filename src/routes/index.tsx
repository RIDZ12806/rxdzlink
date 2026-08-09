import { createFileRoute } from "@tanstack/react-router";
import { ParticleField } from "@/components/site/particle-field";
import { Reveal } from "@/components/site/reveal";
import { RippleLink } from "@/components/site/ripple-link";
import { SocialCard } from "@/components/site/social-card";
import gameHero from "@/assets/game-hero.png.asset.json";
import {
  TikTokIcon,
  TelegramIcon,
  DiscordIcon,
  YouTubeIcon,
} from "@/components/site/brand-icons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RXDZ — مطور ألعاب Roblox وصانع محتوى" },
      {
        name: "description",
        content:
          "الموقع الرسمي لـ RXDZ، مطور Roblox وصانع محتوى. العب لعبة DZ HUP الآن وتابعنا على TikTok وTelegram وDiscord وYouTube.",
      },
      { property: "og:title", content: "RXDZ — مطور ألعاب Roblox وصانع محتوى" },
      {
        property: "og:description",
        content: "العب DZ HUP على Roblox وتابع RXDZ على جميع المنصات.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const GAME_URL = "https://ro.blox.com/Ebh5?pid=share&is_retargeting=true&af_dp";

const socials = [
  { name: "TikTok", handle: "@rx_._dz", Icon: TikTokIcon, href: "https://tiktok.com/@rx_._dz" },
  { name: "Telegram", handle: "t.me/RX0DZ", Icon: TelegramIcon, href: "https://t.me/RX0DZ" },
  {
    name: "Discord",
    handle: "discord.gg/QnYXtYVhW",
    Icon: DiscordIcon,
    href: "https://discord.gg/QnYXtYVhW",
  },
  {
    name: "YouTube",
    handle: "@rxdz29",
    Icon: YouTubeIcon,
    href: "https://youtube.com/@rxdz29?si=uE3pv8DyAjyzzcdy",
  },
];

const stats = [
  { label: "لعبة رئيسية", value: "DZ HUP" },
  { label: "المنصة", value: "Roblox" },
  { label: "المجتمع", value: "DZ Community" },
  { label: "المحتوى", value: "Gaming" },
];

function Index() {
  return (
    <div dir="rtl" className="relative min-h-screen">
      <ParticleField />

      <header className="sticky top-0 z-50 border-b border-border/60 backdrop-blur-xl">
        <nav className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:flex sm:justify-between">
          <a href="#top" className="flex min-w-0 items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/40 bg-primary/10 font-display text-xs font-bold text-primary">
              RX
            </span>
            <span className="gradient-text truncate font-display text-lg font-black tracking-widest">
              RXDZ
            </span>
          </a>
          <div className="flex items-center gap-2 text-sm">
            <a
              href="#connect"
              className="hidden rounded-full px-4 py-2 text-muted-foreground transition-colors hover:text-primary sm:block"
            >
              التواصل
            </a>
            <RippleLink
              href={GAME_URL}
              className="rounded-full border border-primary/50 bg-primary/15 px-4 py-2 font-semibold text-primary transition-all duration-300 hover:bg-primary/25 hover:shadow-[0_0_28px_color-mix(in_oklab,var(--neon)_45%,transparent)]"
            >
              العب الآن 🎮
            </RippleLink>
          </div>
        </nav>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="mx-auto max-w-6xl px-5 pt-12 pb-20 sm:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
            <div className="order-2 flex flex-col items-center text-center lg:order-1">
              <p
                className="title-in inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary"
                style={{ animationDelay: "60ms" }}
              >
                <span className="pulse-neon inline-block h-2 w-2 rounded-full bg-primary" />
                Roblox Developer • Content Creator
              </p>

              <h1
                className="title-in mt-5 text-center font-display text-5xl leading-[1.1] font-black tracking-tight sm:text-6xl lg:text-7xl"
                style={{ animationDelay: "160ms" }}
              >
                <span className="gradient-text">RXDZ</span>
                <span className="text-neon"> .</span>
              </h1>

              <p
                className="title-in mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
                style={{ animationDelay: "260ms" }}
              >
                مطوّر ألعاب Roblox وصانع محتوى. أبني تجارب لعب جماعية سريعة وممتعة، وأشارك كل جديد
                مع مجتمع اللاعبين.
              </p>

              <div
                className="title-in mt-8 flex flex-wrap items-center justify-center gap-4"
                style={{ animationDelay: "360ms" }}
              >

                <RippleLink
                  href={GAME_URL}
                  className="pulse-neon group inline-flex items-center gap-3 rounded-2xl px-8 py-4 font-display text-lg font-black text-primary-foreground transition-transform duration-300 hover:scale-[1.04] active:scale-95"
                >
                  <span
                    className="absolute inset-0 -z-10"
                    style={{ background: "var(--gradient-neon)" }}
                  />
                  <span className="pointer-events-none absolute inset-y-0 -z-10 w-1/3 bg-white/30 blur-md [animation:sweep_2.6s_linear_infinite]" />
                  العب الآن 🎮
                </RippleLink>
                <a
                  href="#connect"
                  className="rounded-2xl border border-border px-6 py-4 text-sm font-semibold transition-all duration-300 hover:border-primary/60 hover:text-primary hover:shadow-[0_0_28px_-8px_color-mix(in_oklab,var(--neon)_60%,transparent)]"
                >
                  تابعني على المنصات
                </a>
              </div>

              <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((s, i) => (
                  <Reveal key={s.label} delay={i * 90}>
                    <div className="glass rounded-2xl px-4 py-3">
                      <dt className="text-[11px] text-muted-foreground">{s.label}</dt>
                      <dd className="mt-1 truncate font-display text-sm font-bold text-primary">
                        {s.value}
                      </dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </div>

            <div className="order-1 lg:order-2">
              <Reveal>
                <a
                  href={GAME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block overflow-hidden rounded-3xl border border-primary/30"
                  style={{ boxShadow: "var(--shadow-neon)" }}
                >
                  <img
                    src={gameHero.url}
                    alt="لعبة DZ HUP على Roblox — الصورة الرئيسية"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 p-5">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">اللعبة الرئيسية</p>
                      <p className="truncate font-display text-2xl font-black text-neon">DZ HUP</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-primary/20 px-4 py-2 text-sm font-bold text-primary transition-all duration-300 group-hover:bg-primary/30">
                      ادخل اللعبة ↗
                    </span>
                  </div>
                </a>
              </Reveal>
            </div>
          </div>
        </section>

        {/* CONNECT */}
        <section id="connect" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-24">
          <Reveal>
            <div className="text-center">
              <h2 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
                <span className="gradient-text">التواصل</span>
              </h2>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                اختر منصتك المفضلة وانضم إلى المجتمع
              </p>
            </div>
          </Reveal>

          <div dir="ltr" className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {socials.map((s, i) => (
              <Reveal key={s.name} delay={i * 110}>
                <SocialCard
                  name={s.name}
                  handle={s.handle}
                  Icon={s.Icon}
                  href={s.href}
                  delayIndex={i}
                />
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-5 pb-24">
          <Reveal>
            <div
              className="glass relative overflow-hidden rounded-3xl p-8 text-center sm:p-12"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{ background: "var(--gradient-hero)" }}
              />
              <h2 className="relative font-display text-2xl font-black sm:text-3xl">
                جاهز للعب مع <span className="text-neon">RXDZ</span>؟
              </h2>
              <p className="relative mt-3 text-sm text-muted-foreground">
                ادخل السيرفر، كوّن فريقك، ونافس الجميع الآن.
              </p>
              <div className="relative mt-7 flex justify-center">
                <RippleLink
                  href={GAME_URL}
                  className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 font-display text-lg font-black text-primary-foreground transition-transform duration-300 hover:scale-105 active:scale-95"
                >
                  <span
                    className="absolute inset-0 -z-10"
                    style={{ background: "var(--gradient-neon)" }}
                  />
                  العب الآن 🎮
                </RippleLink>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} RXDZ — Roblox Developer & Content Creator
      </footer>
    </div>
  );
}
