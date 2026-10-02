"use client";

type Props = {
  playing: boolean;
  loading?: boolean;
  emphasise?: boolean;
  /** Omit to hide the shuffle button (shared radio mode). */
  shuffled?: boolean;
  onShuffle?: () => void;
  onToggle: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

const iconButton =
  "grid size-9 place-items-center rounded-full text-cream/90 transition hover:bg-cream/10 hover:text-cream active:scale-95 sm:size-10";

export default function Controls({ playing, loading, emphasise, shuffled, onShuffle, onToggle, onPrevious, onNext }: Props) {
  return (
    <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
      {onShuffle ? (
        <button
          type="button"
          aria-label="Shuffle"
          aria-pressed={shuffled}
          title={shuffled ? "Shuffle on" : "Shuffle off"}
          onClick={onShuffle}
          className={`grid size-8 place-items-center rounded-full transition hover:bg-cream/10 active:scale-95 sm:size-10 ${
            shuffled ? "bg-cream/15 text-cream" : "text-cream/55 hover:text-cream"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="size-[18px] sm:size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 7h3.5c3 0 4.5 2 6 5s3 5 6 5H21M3 17h3.5c1.6 0 2.8-.6 3.8-1.6M13.5 8.6C14.5 7.6 15.7 7 17.5 7H21" />
            <path d="m18.5 4 2.5 3-2.5 3M18.5 14l2.5 3-2.5 3" />
          </svg>
        </button>
      ) : null}

      <button type="button" aria-label="Previous song" className={iconButton} onClick={onPrevious}>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
          <path d="M6 5h2v14H6zM20 5.5v13a.5.5 0 0 1-.77.42L9.5 12.42a.5.5 0 0 1 0-.84l9.73-6.5a.5.5 0 0 1 .77.42Z" />
        </svg>
      </button>

      <button
        type="button"
        aria-label={playing ? "Pause" : "Play"}
        onClick={onToggle}
        data-emphasise={emphasise || undefined}
        className="play-button relative grid size-12 place-items-center rounded-full bg-cream text-deep-brown shadow-[0_6px_20px_rgb(0_0_0/0.3)] transition hover:scale-105 active:scale-95 sm:size-14"
      >
        {playing ? (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-current">
            <rect x="6.5" y="5" width="3.8" height="14" rx="1" />
            <rect x="13.7" y="5" width="3.8" height="14" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-0.5 size-6 fill-current">
            <path d="M8 5.6v12.8a.8.8 0 0 0 1.22.68l10.2-6.4a.8.8 0 0 0 0-1.36L9.22 4.92A.8.8 0 0 0 8 5.6Z" />
          </svg>
        )}
        {loading ? (
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-hot-red"
          />
        ) : null}
      </button>

      <button type="button" aria-label="Next song" className={iconButton} onClick={onNext}>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
          <path d="M16 5h2v14h-2zM4 5.5v13a.5.5 0 0 0 .77.42l9.73-6.5a.5.5 0 0 0 0-.84L4.77 5.08A.5.5 0 0 0 4 5.5Z" />
        </svg>
      </button>
    </div>
  );
}
