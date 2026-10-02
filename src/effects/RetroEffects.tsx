import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./retro.css";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}

function CursorTrail() {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const nodes = [...(container.current?.children ?? [])] as HTMLElement[];
    let lastMove = 0;
    let index = 0;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.timeStamp - lastMove < 45 || !nodes.length) return;
      lastMove = event.timeStamp;
      const node = nodes[index++ % nodes.length];
      node.getAnimations().forEach(animation => animation.cancel());
      node.style.left = `${event.clientX + 10}px`;
      node.style.top = `${event.clientY + 12}px`;
      node.animate([{ opacity: 0.7, transform: "translateY(0) scale(1)" }, { opacity: 0, transform: "translateY(9px) scale(0.3)" }], { duration: 400, easing: "ease-out" });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      nodes.forEach(node => node.getAnimations().forEach(animation => animation.cancel()));
    };
  }, []);
  return <div ref={container} className="retro-cursor-trail" aria-hidden="true">{Array.from({ length: 10 }, (_, index) => <span key={index}>✦</span>)}</div>;
}

export function RetroEffects({ enabled }: { enabled: boolean }) {
  const motionAllowed = useMediaQuery("(prefers-reduced-motion: no-preference)");
  const mouseAvailable = useMediaQuery("(hover: hover) and (pointer: fine)");
  if (!enabled || !motionAllowed) return null;
  return <>
    <div className="retro-snow" aria-hidden="true">{Array.from({ length: 16 }, (_, index) => <span key={index} style={{ "--snow-x": `${(index * 47 + 7) % 100}%`, "--snow-delay": `${index * -1.7}s`, "--snow-duration": `${14 + index % 6 * 2}s`, "--snow-size": `${3 + index % 3}px` } as CSSProperties} />)}</div>
    {mouseAvailable && <CursorTrail />}
  </>;
}
