type HomeArtworkConfig = {
  status: "temporary-fallback" | "production";
  daySource: string | null;
  nightSource: string | null;
  width: number;
  height: number;
};

export const HOME_ARTWORK_CONFIG: HomeArtworkConfig = {
  status: "temporary-fallback",
  daySource: null,
  nightSource: null,
  width: 760,
  height: 620,
};

function RoomDetails({ floor }: { floor: number }) {
  const y = 402 - floor * 104;

  return (
    <g className="home-art-room-details">
      <rect x="334" y={y} width="54" height="42" rx="4" />
      <rect x="414" y={y + 7} width="60" height="35" rx="4" />
      <path d={`M500 ${y + 42}h65m-52 0v-26m38 26v-18`} />
      <circle cx="529" cy={y + 16} r="7" />
      <path d={`M529 ${y + 23}v19m-10-9h20`} />
      <rect className="home-art-window" x="584" y={y - 2} width="52" height="45" rx="4" />
      <path d={`M610 ${y - 2}v45M584 ${y + 20}h52`} />
    </g>
  );
}

export function HomeArtwork() {
  return (
    <figure className="home-artwork" aria-hidden="true" data-artwork-status={HOME_ARTWORK_CONFIG.status}>
      <div className="home-artwork-orbit" />
      <svg
        className="home-artwork-svg"
        viewBox={`0 0 ${HOME_ARTWORK_CONFIG.width} ${HOME_ARTWORK_CONFIG.height}`}
        fill="none"
        focusable="false"
      >
        <circle className="home-art-sun" cx="612" cy="86" r="34" />
        <path className="home-art-moon" d="M631 51a36 36 0 1 0 20 62 31 31 0 0 1-20-62Z" />
        <g className="home-art-clouds">
          <path d="M78 126c26-23 51-19 66 2 24-30 72-10 71 22H59c0-12 8-21 19-24Z" />
          <path d="M541 150c18-18 39-14 50 1 21-24 57-6 55 19H526c0-10 6-17 15-20Z" />
        </g>

        <g className="home-art-skyline">
          <path d="M38 475V355h48v120M87 475V316h63v159M152 475V375h52v100M636 475V333h49v142M687 475V292h42v183" />
          <path d="M48 378h27m24-38h39m-36 31h33m514-14h25m14-39h24m-23 34h21" />
        </g>

        <g className="home-art-ground">
          <path d="M18 514c97-38 178-37 257-3 86 37 177 35 267-1 65-26 127-23 200 7" />
          <path d="M45 548c123-26 220-14 292 14 98 39 225 33 375-15" />
        </g>

        <g className="home-art-city">
          <path className="home-art-building-shadow" d="M278 181 455 112l211 100v306H278Z" />
          <path className="home-art-building" d="M258 173 441 99l202 99v301H258Z" />
          <path className="home-art-roof" d="m239 184 202-94 221 108-18 30-203-96-183 79Z" />
          <path className="home-art-divider" d="M258 293h385M258 397h385M441 132v367" />
          <path className="home-art-divider" d="M286 211v288M474 148v351M621 208v291" />
          <RoomDetails floor={0} />
          <RoomDetails floor={1} />
          <RoomDetails floor={2} />

          <g className="home-art-garden">
            <path d="M321 150c-6-29 14-48 37-55 0 27-10 48-37 55ZM377 128c2-27 20-40 42-41-5 26-18 42-42 41Z" />
            <path d="M321 150h102" />
            <circle cx="512" cy="128" r="17" />
            <path d="M512 145v25m-17-8h34" />
          </g>

          <g className="home-art-entry">
            <path d="M307 499v-58c0-25 19-44 43-44s43 19 43 44v58" />
            <path d="M325 499v-54c0-14 11-25 25-25s25 11 25 25v54" />
          </g>
        </g>

        <g className="home-art-trees">
          <path d="M133 494v-58m-24 58 24-82 26 82m-14-36h-25M679 510v-69m-27 69 27-91 31 91m-17-39h-29" />
        </g>

        <g className="home-art-connections">
          <path d="M85 248c90-52 141-52 215-10M546 82c72-23 120-6 164 39" />
          <circle cx="85" cy="248" r="5" />
          <circle cx="300" cy="238" r="5" />
          <circle cx="546" cy="82" r="5" />
          <circle cx="710" cy="121" r="5" />
        </g>
      </svg>
      <figcaption className="sr-only">Temporary decorative financial-city illustration. Production day and night artwork is pending.</figcaption>
    </figure>
  );
}
