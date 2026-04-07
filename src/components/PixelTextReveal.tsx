import { useEffect, useState } from 'react';

interface PixelTextRevealProps {
  lines: string[];
  onComplete: () => void;
}

const CHAR_DELAY = 40;
const LINE_PAUSE = 180;
const HOLD_AFTER = 500;
const FADE_DURATION = 400;

function PixelTextReveal({ lines, onComplete }: PixelTextRevealProps) {
  const [displayed, setDisplayed] = useState<string[]>(lines.map(() => ''));
  const [opacity, setOpacity] = useState(1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const sleep = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

    async function run() {
      const result = lines.map(() => '');

      // Type each line
      for (let i = 0; i < lines.length; i++) {
        for (let c = 1; c <= lines[i].length; c++) {
          if (cancelled) return;
          result[i] = lines[i].slice(0, c);
          setDisplayed([...result]);
          await sleep(CHAR_DELAY);
        }
        if (i < lines.length - 1) await sleep(LINE_PAUSE);
      }

      // Hold
      await sleep(HOLD_AFTER);
      if (cancelled) return;

      // Fade out
      setOpacity(0);
      await sleep(FADE_DURATION);
      if (!cancelled) {
        setDone(true);
        onComplete();
      }
    }

    run();
    return () => { cancelled = true; };
  }, [lines, onComplete]);

  if (done) return null;

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16 lg:px-24 pointer-events-none"
      style={{ opacity, transition: `opacity ${FADE_DURATION}ms ease` }}
    >
      {lines.map((line, i) => (
        <div key={i}>
          <span className="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
            {displayed[i]}
            {displayed[i].length < line.length && (
              <span className="inline-block w-[3px] h-[0.85em] bg-white ml-1 align-middle animate-pulse" />
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

export default PixelTextReveal;
