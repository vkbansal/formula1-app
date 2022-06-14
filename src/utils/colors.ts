export function getRandomColors(n: number): string[] {
  const step = Math.floor(360 / (n - 1));

  return Array.from(
    { length: n },
    (_, i) =>
      `hsl(${[
        `${step * i}deg`,
        `${Math.round(60 + Math.random() * 40)}%`,
        `${Math.round(70 + Math.random() * 10)}%`
      ].join(',')})`
  );
}
