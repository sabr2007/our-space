"use client";

import { useEffect, useState, useCallback } from "react";

interface RelationshipCounterProps {
  startDate: string;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

function formatRussianDate(date: Date): string {
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function calculateDifference(start: Date, now: Date) {
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

function useAnimatedValue(target: number, duration: number, delay: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }

    let startTime: number | null = null;
    let rafId: number;

    const delayTimeout = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        setValue(Math.round(easedProgress * target));

        if (progress < 1) {
          rafId = requestAnimationFrame(animate);
        }
      };
      rafId = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(delayTimeout);
      cancelAnimationFrame(rafId);
    };
  }, [target, duration, delay]);

  return value;
}

export function RelationshipCounter({ startDate }: RelationshipCounterProps) {
  const start = new Date(startDate);
  const [diff, setDiff] = useState(() => calculateDifference(start, new Date()));

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      setDiff(calculateDifference(start, new Date()));

      intervalId = setInterval(() => {
        setDiff(calculateDifference(start, new Date()));
      }, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    return () => {
      clearTimeout(timeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [startDate]);

  const animYears = useAnimatedValue(diff.years, 800, 0);
  const animMonths = useAnimatedValue(diff.months, 800, 100);
  const animDays = useAnimatedValue(diff.days, 800, 200);

  const yearsLabel = pluralize(animYears, "год", "года", "лет");
  const monthsLabel = pluralize(animMonths, "месяц", "месяца", "месяцев");
  const daysLabel = pluralize(animDays, "день", "дня", "дней");

  const parts: string[] = [];
  if (diff.years > 0) parts.push(`${animYears} ${yearsLabel}`);
  if (diff.months > 0 || diff.years > 0) parts.push(`${animMonths} ${monthsLabel}`);

  return (
    <div className="candle-glow text-center">
      <p className="font-display text-body-md text-text-muted-light mb-2">
        Вместе
      </p>
      <p className="font-display font-bold text-display-xl max-md:text-display-lg text-text-cream">
        {parts.length > 0 ? parts.join(", ") : ""}
      </p>
      <p className="font-display text-display-md text-text-cream mt-1">
        и {animDays} {daysLabel}
      </p>
      <p className="font-hand text-body-md text-text-muted-light mt-3">
        с {formatRussianDate(start)}
      </p>
    </div>
  );
}
