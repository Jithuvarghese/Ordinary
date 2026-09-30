"use client";

type Props = {
  playing: boolean;
  loading?: boolean;
  emphasise?: boolean;
  onToggle: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

const iconButton =
  "grid size-9 place-items-center rounded-full text-cream/90 transition hover:bg-cream/10 hover:text-cream active:scale-95 sm:size-10";

export default function Controls({ playing, loading, emphasise, onToggle, onPrevious, onNext }: Props) {
  return (
    <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
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
