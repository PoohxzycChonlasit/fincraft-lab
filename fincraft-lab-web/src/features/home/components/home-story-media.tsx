import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

type StoryPictureProps = {
  desktopPoster: string;
  mobilePoster?: string;
  variant: "light" | "dark" | "universal";
  alt: string;
  priority: boolean;
  sizes: string;
};

function StoryPicture({ desktopPoster, mobilePoster, variant, alt, priority, sizes }: StoryPictureProps) {
  return (
    <picture className="home-story-media-picture" data-theme-media={variant}>
      {mobilePoster ? <source media="(max-width: 767px)" srcSet={mobilePoster} /> : null}
      <Image
        src={desktopPoster}
        alt={alt}
        width={1600}
        height={900}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes={sizes}
        className="home-story-media-image"
      />
    </picture>
  );
}

export type HomeStoryMediaProps = {
  desktopPoster?: string;
  mobilePoster?: string;
  darkDesktopPoster?: string;
  darkMobilePoster?: string;
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
  darkDesktopPoster,
  darkMobilePoster,
  videoSrc,
  objectPosition = "center",
  overlay = "none",
  priority = false,
  decorative = true,
  alt,
  sizes = "100vw",
  className,
  children,
}: HomeStoryMediaProps) {
  const style = { "--home-media-object-position": objectPosition } as CSSProperties;
  const imageAlt = decorative ? "" : alt ?? "";
  const hasThemePair = Boolean(desktopPoster && darkDesktopPoster);
  const imagePriority = priority && !hasThemePair;

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
        <StoryPicture
          desktopPoster={desktopPoster}
          mobilePoster={mobilePoster}
          variant={hasThemePair ? "light" : "universal"}
          alt={imageAlt}
          priority={imagePriority}
          sizes={sizes}
        />
      ) : null}
      {darkDesktopPoster ? (
        <StoryPicture
          desktopPoster={darkDesktopPoster}
          mobilePoster={darkMobilePoster}
          variant="dark"
          alt={imageAlt}
          priority={imagePriority}
          sizes={sizes}
        />
      ) : null}
      {videoSrc ? (
        <video className="home-story-media-video" muted playsInline preload="metadata" poster={desktopPoster} aria-hidden="true">
          <source src={videoSrc} />
        </video>
      ) : null}
      <div className="home-story-media-content">{children}</div>
    </div>
  );
}
