import styles from "./KnowledgeHero.module.css";

// Shared decoration for the index, articles, news and section fallback pages.
export default function KnowledgeBackground() {
  return (
    <div className={styles.art} aria-hidden="true">
        <svg className={styles.geometry} viewBox="0 0 850 540" fill="none" focusable="false">
          <defs>
            <linearGradient id="knowledge-line" x1="240" y1="300" x2="810" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#71717a" stopOpacity=".12" />
              <stop offset="1" stopColor="#d4d4d8" stopOpacity=".48" />
            </linearGradient>
            <linearGradient id="knowledge-orange" x1="340" y1="480" x2="760" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f97316" stopOpacity=".05" />
              <stop offset=".6" stopColor="#f97316" stopOpacity=".8" />
              <stop offset="1" stopColor="#fb923c" stopOpacity=".35" />
            </linearGradient>
            <pattern id="knowledge-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
              <path d="M0 0V7" stroke="#a1a1aa" strokeOpacity=".23" />
            </pattern>
          </defs>
          <g stroke="url(#knowledge-line)" strokeWidth=".8">
            <path d="M100 106H850M130 254H850M60 434H850M258 0V530M474 0V540M710 0V540" strokeDasharray="5 7" />
            <circle cx="730" cy="256" r="285" />
            <circle cx="730" cy="256" r="252" strokeDasharray="8 6" />
            <circle cx="730" cy="256" r="190" />
            <path d="M258 106L474 434H710L826 254 710 106H474L360 254 474 434M360 254H826M474 106L710 434M710 106L474 434" />
            <path d="M536 185L650 120 783 158 826 287 713 377 581 341 536 185Z" />
            <path d="M551 196L651 138 769 172 807 281 709 358 594 325 551 196Z" />
            <path d="M581 341L601 411 733 445 848 355 826 287M713 377L733 445M783 158L804 226 848 355M650 120L673 189 804 226M673 189L560 254 601 411M560 254L692 292 804 226M692 292L733 445" />
            <circle cx="692" cy="292" r="42" />
            <ellipse cx="692" cy="292" rx="21" ry="42" transform="rotate(-32 692 292)" />
            <path d="M340 79H786M340 71V87M786 71V87M340 79L349 75M340 79L349 83M786 79L777 75M786 79L777 83M322 106V434M314 106H330M314 434H330" />
            <path d="M410 106H480L498 134H428Z M596 454H716V482H596Z" fill="url(#knowledge-hatch)" />
            <path d="M100 515L474 434 850 515M258 540L560 434M450 540L650 434M655 540L740 434M80 505H850M80 523H850" opacity=".4" />
          </g>
          <g stroke="url(#knowledge-orange)" strokeWidth="1.2">
            <path d="M545 482A288 288 0 0 1 842 0" />
            <path d="M560 455A258 258 0 0 1 833 26" strokeDasharray="5 9" />
            <path d="M756 0V495M749 0V495M474 434H810M650 120V79M581 341H474V434" />
            <circle cx="474" cy="434" r="7" />
            <circle cx="650" cy="120" r="9" />
            <circle cx="756" cy="254" r="12" />
          </g>
          <g stroke="#a1a1aa" strokeOpacity=".45" strokeWidth=".8">
            <path d="M250 106H266M258 98V114M466 254H482M474 246V262M702 106H718M710 98V114M684 292H700M692 284V300" />
          </g>
          <g fill="#fb923c" fillOpacity=".7"><circle cx="474" cy="434" r="2" /><circle cx="650" cy="120" r="2" /><circle cx="756" cy="254" r="2" /></g>
        </svg>
      </div>
  );
}
