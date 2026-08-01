import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

export type HomeStoryMediaProps = {
  desktopPoster?: string;
  mobilePoster?: string;
  videoSrc?: string;
  objectPosition?: string;
  overlay?: "none" | "soft" | "strong";
  priority?: boolean;
  decorative?: boolean;
  alt?: string;
  sizes?: string;
  className?: string;
  children?: ReactNode;
};

export function HomeStoryMedia({
  desktopPoster,
  mobilePoster,
  videoSrc,
  objectPosition = "center",
  overlay = "soft",
  priority = false,
  decorative = true,
  alt,
  sizes = "(max-width: 900px) 100vw, 60vw",
  className,
  children,
}: HomeStoryMediaProps) {
  const style = { "--home-media-object-position": objectPosition } as CSSProperties;

  return (
    <div
      className={`home-story-media${className ? ` ${className}` : ""}`}
      data-overlay={overlay}
      style={style}
      role={!decorative && alt ? "img" : undefined}
      aria-label={!decorative && alt ? alt : undefined}
      aria-hidden={decorative ? true : undefined}
    >
      {desktopPoster ? (
        <picture className="home-story-media-picture">
          {mobilePoster ? <source media="(max-width: 767px)" srcSet={mobilePoster} /> : null}
          <Image
            src={desktopPoster}
            alt={decorative ? "" : alt ?? ""}
            fill
            priority={priority}
            loading={priority ? undefined : "lazy"}
            sizes={sizes}
            className="home-story-media-image"
          />
        </picture>
      ) : null}

      {videoSrc ? (
        <video
          className="home-story-media-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={desktopPoster}
          aria-hidden="true"
        >
          <source src={videoSrc} />
        </video>
      ) : null}

      <div className="home-story-media-content">{children}</div>
    </div>
  );
}
