"use client";

import { useEffect, useState } from "react";

const SLIDES = [
  {
    kicker: "Boosts",
    title: "Acca boosts",
    text: "Extra returns on 3+ fold accumulators.",
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80",
  },
  {
    kicker: "Live",
    title: "Sub on, play on",
    text: "Bets stand if a named player is subbed on.",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1600&q=80",
  },
  {
    kicker: "Early payout",
    title: "2 goals ahead",
    text: "Get paid out early when your team goes 2 up.",
    image:
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    kicker: "In-play",
    title: "Bet as it happens",
    text: "Live prices that move with every chance.",
    image:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1600&q=80",
  },
];

export function PromoCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-panel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {SLIDES.map((slide) => (
          <article key={slide.title} className="relative h-48 min-w-full sm:h-56">
            <img
              src={slide.image}
              alt=""
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />
            <div className="relative flex h-full flex-col justify-end p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{slide.kicker}</p>
              <h3 className="mt-1 text-[28px] font-semibold tracking-tight text-white sm:text-[32px]">{slide.title}</h3>
              <p className="mt-1 max-w-md text-[14px] leading-relaxed text-white/80">{slide.text}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="absolute bottom-3 right-4 flex gap-1.5">
        {SLIDES.map((slide, slideIndex) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`Show ${slide.title}`}
            onClick={() => setIndex(slideIndex)}
            className={`h-1.5 rounded-full transition-all ${
              slideIndex === index ? "w-5 bg-gold" : "w-1.5 bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
