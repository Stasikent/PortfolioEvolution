import { useEffect, useId, useRef, useState } from "react";
import type { ProjectMedia } from "../content/projects";
import "./project-media.css";

function MediaItem({ media }: { media: ProjectMedia }) {
  const [active, setActive] = useState(false);
  const [failed, setFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const figure = useRef<HTMLElement>(null);
  const captionId = useId();
  const panelId = useId();
  const moving = media.type === "animation" || media.type === "video";

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => {
      if (preference.matches) {
        video.current?.pause();
        setActive(false);
      }
    };
    preference.addEventListener("change", stop);
    return () => preference.removeEventListener("change", stop);
  }, []);

  useEffect(() => {
    const stop = () => { video.current?.pause(); setActive(false); };
    const onVisibility = () => { if (document.hidden) stop(); };
    const ancestors: HTMLDetailsElement[] = [];
    let parent = figure.current?.parentElement;
    while (parent) {
      if (parent instanceof HTMLDetailsElement) ancestors.push(parent);
      parent = parent.parentElement;
    }
    const onToggle = () => { if (ancestors.some(details => !details.open)) stop(); };
    ancestors.forEach(details => details.addEventListener("toggle", onToggle));
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      ancestors.forEach(details => details.removeEventListener("toggle", onToggle));
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  function toggle() {
    if (active) video.current?.pause();
    setActive(!active);
  }

  return (
    <figure ref={figure} className="project-media" aria-describedby={media.caption ? captionId : undefined}>
      <div className="project-media-frame" id={panelId}>
        {media.type === "external" ? (
          <a href={media.src} target="_blank" rel="noreferrer">{media.alt} ↗</a>
        ) : failed ? (
          <p role="status">This media could not be loaded. <a href={media.src} target="_blank" rel="noreferrer">Open the original ↗</a></p>
        ) : media.type === "image" ? (
          <img src={media.src} alt={media.alt} width={media.width} height={media.height}
            loading="lazy" decoding="async" onError={() => setFailed(true)} />
        ) : !active ? (
          posterFailed ? <p>{media.alt}</p> :
          <img src={media.poster} alt={media.alt} loading="lazy" decoding="async"
            onError={() => setPosterFailed(true)} />
        ) : media.type === "animation" ? (
          <img src={media.src} alt={media.alt} width={media.width} height={media.height}
            onError={() => setFailed(true)} />
        ) : (
          <video ref={video} controls playsInline preload="none" poster={media.poster}
            aria-label={media.alt} onError={() => setFailed(true)}>
            <source src={media.src} />
            {media.captions && <track kind="captions" src={media.captions.src}
              srcLang={media.captions.language} label={media.captions.label} default />}
            <a href={media.src}>Open video</a>
          </video>
        )}
      </div>
      {moving && !failed && (
        <button className="project-media-toggle" type="button" onClick={toggle}
          aria-controls={panelId} aria-expanded={active}>
          {active ? "Show still preview" : media.type === "video" ? "Load video player" : "Play animation"}
          <span className="sr-only"> — {media.alt}</span>
        </button>
      )}
      {media.caption && <figcaption id={captionId}>{media.caption}</figcaption>}
      {media.type === "video" && (
        <details className="project-media-transcript">
          <summary>Video description<span className="sr-only"> — {media.alt}</span></summary>
          <p>{media.transcript}</p>
        </details>
      )}
    </figure>
  );
}

export function ProjectMediaGallery({ media }: { media?: readonly ProjectMedia[] }) {
  if (!media?.length) return null;
  return <div className="project-media-gallery">
    {media.map(item => <MediaItem key={`${item.type}:${item.src}`} media={item} />)}
  </div>;
}
