"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isPlaceholder, type Song } from "@/lib/songs";
import { radioNow } from "@/lib/radio";
import { sessionOrder, shuffle as shuffleItems } from "@/lib/shuffle";
import { loadYouTubeApi, YT_STATE, type YTPlayer } from "@/lib/youtube";

const isDev = process.env.NODE_ENV !== "production";

// Picked once per page load; only affects songs after the first.
const sessionSeed = Math.floor(Math.random() * 2 ** 32);

export type PlayerStatus = {
  song: Song | undefined;
  playing: boolean;
  loading: boolean;
  ready: boolean;
  started: boolean;
  currentTime: number;
  duration: number;
  error: string | null;
  shuffled: boolean;
};

export type PlayerActions = {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  /** Turns shuffle on (random order) or off (list order); the current song keeps playing. */
  setShuffle: (on: boolean) => void;
  /** Sets the player volume without touching the saved volume setting. */
  setOutputVolume: (volume: number) => void;
  /** Puts the player back at the saved volume setting. */
  restoreVolume: () => void;
};

type Options = {
  volume: number;
  /** Everyone hears the same song at the same offset; skipping and seeking are off. */
  radio?: boolean;
};

export function useYouTubePlayer(songs: Song[], { volume, radio = false }: Options) {
  const [order, setOrder] = useState(() =>
    radio ? songs.map((_, i) => i) : sessionOrder(songs.length, sessionSeed),
  );
  const pendingOffsetRef = useRef(0);
  const [shuffled, setShuffled] = useState(!radio);
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(songs[order[0]]?.duration ?? 0);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const readyRef = useRef(false);
  const loadStartedRef = useRef(false);
  const wantPlayRef = useRef(false);
  const posRef = useRef(0);
  const errorStreakRef = useRef(0);
  const volumeRef = useRef(volume);
  const cuedIdRef = useRef<string | null>(null);

  const songAt = useCallback(
    (p: number) => songs[order[((p % order.length) + order.length) % order.length]],
    [songs, order],
  );

  const song = songAt(pos);

  /** Moves to a queue position and loads (or just cues) that song. */
  const goTo = useCallback(
    (nextPos: number, autoplay: boolean, offset = 0) => {
      if (order.length === 0) return;
      const wrapped = ((nextPos % order.length) + order.length) % order.length;
      const target = songAt(wrapped);
      posRef.current = wrapped;
      setPos(wrapped);
      setCurrentTime(0);
      setDuration(target.duration || 0);

      const player = playerRef.current;
      if (!player || !readyRef.current) return;
      cuedIdRef.current = target.id;
      pendingOffsetRef.current = 0;
      if (autoplay) {
        setLoading(true);
        player.loadVideoById(target.id, offset);
      } else {
        player.cueVideoById(target.id);
      }
    },
    [order.length, songAt],
  );

  // Keep the latest handlers reachable from the player's event callbacks.
  const handlersRef = useRef({ goTo, songAt });
  useEffect(() => {
    handlersRef.current = { goTo, songAt };
  }, [goTo, songAt]);

  const ensurePlayer = useCallback(() => {
    if (loadStartedRef.current || order.length === 0) return;
    if (songs.every(isPlaceholder)) return;
    loadStartedRef.current = true;

    loadYouTubeApi()
      .then((YT) => {
        const container = containerRef.current;
        if (!container) return;
        const host = document.createElement("div");
        container.appendChild(host);
        const first = handlersRef.current.songAt(posRef.current);
        cuedIdRef.current = isPlaceholder(first) ? null : first.id;

        playerRef.current = new YT.Player(host, {
          width: 200,
          height: 200,
          ...(isPlaceholder(first) ? {} : { videoId: first.id }),
          host: "https://www.youtube-nocookie.com",
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            playsinline: 1,
            rel: 0,
            iv_load_policy: 3,
            origin: window.location.origin,
          },
          events: {
            onReady: ({ target }) => {
              readyRef.current = true;
              setReady(true);
              target.setVolume(volumeRef.current);
              // The queue may have moved while the API was loading.
              const current = handlersRef.current.songAt(posRef.current);
              if (current.id !== cuedIdRef.current) {
                cuedIdRef.current = current.id;
                if (wantPlayRef.current) target.loadVideoById(current.id, pendingOffsetRef.current);
                else target.cueVideoById(current.id);
              } else if (wantPlayRef.current) {
                if (pendingOffsetRef.current > 0) target.loadVideoById(current.id, pendingOffsetRef.current);
                else target.playVideo();
              }
              pendingOffsetRef.current = 0;
            },
            onStateChange: ({ target, data }) => {
              switch (data) {
                case YT_STATE.PLAYING: {
                  errorStreakRef.current = 0;
                  setPlaying(true);
                  setLoading(false);
                  setError(null);
                  const d = target.getDuration();
                  if (d > 0) setDuration(d);
                  break;
                }
                case YT_STATE.PAUSED:
                  setPlaying(false);
                  setLoading(false);
                  break;
                case YT_STATE.BUFFERING:
                  setLoading(true);
                  break;
                case YT_STATE.CUED:
                  setLoading(false);
                  break;
                case YT_STATE.ENDED:
                  handlersRef.current.goTo(posRef.current + 1, true);
                  break;
              }
            },
            onError: ({ data }) => {
              const failed = handlersRef.current.songAt(posRef.current);
              if (isDev) {
                console.warn(`[player] Skipping "${failed.title}" (${failed.id}), YouTube error ${data}`);
              }
              errorStreakRef.current += 1;
              if (errorStreakRef.current >= order.length) {
                wantPlayRef.current = false;
                setPlaying(false);
                setLoading(false);
                setError("None of the songs could be played right now.");
                return;
              }
              handlersRef.current.goTo(posRef.current + 1, wantPlayRef.current);
            },
          },
        });
      })
      .catch((err: unknown) => {
        loadStartedRef.current = false;
        setLoading(false);
        setError("Couldn't reach YouTube. Check your connection.");
        if (isDev) console.warn("[player]", err);
      });
  }, [order.length, songs]);

  // Load the API once the page has painted, or sooner on first interaction.
  useEffect(() => {
    const events = ["pointerdown", "keydown", "touchstart"] as const;
    const onInteract = () => ensurePlayer();
    events.forEach((e) => window.addEventListener(e, onInteract, { once: true, passive: true }));

    const idle = window.setTimeout(ensurePlayer, 2500);

    return () => {
      events.forEach((e) => window.removeEventListener(e, onInteract));
      window.clearTimeout(idle);
    };
  }, [ensurePlayer]);

  // Tear the player down on unmount.
  useEffect(() => {
    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
      readyRef.current = false;
    };
  }, []);

  // Poll the playhead while playing.
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) return;
      setCurrentTime(player.getCurrentTime());
    }, 250);
    return () => window.clearInterval(id);
  }, [playing]);

  // Forward volume changes to the player.
  useEffect(() => {
    volumeRef.current = volume;
    if (readyRef.current) playerRef.current?.setVolume(volume);
  }, [volume]);

  // When the tab comes back, trust the player rather than our last known state.
  // Playback is left running while hidden so lock-screen controls keep working.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState !== "visible") return;
      const player = playerRef.current;
      if (!player || !readyRef.current) return;
      const state = player.getPlayerState();
      setPlaying(state === YT_STATE.PLAYING);
      if (state !== YT_STATE.PLAYING) wantPlayRef.current = false;
      setCurrentTime(player.getCurrentTime());
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const play = useCallback(() => {
    if (order.length === 0) return;
    if (songs.every(isPlaceholder)) {
      setError("Add real songs to data/songs.json to start playing.");
      return;
    }
    wantPlayRef.current = true;
    setStarted(true);
    setError(null);
    errorStreakRef.current = 0;
    const player = playerRef.current;
    if (radio) {
      // Join the live schedule wherever it is right now.
      const { index, offset } = radioNow(songs, Date.now());
      pendingOffsetRef.current = offset;
      goTo(index, true, offset);
      if (!(player && readyRef.current)) {
        setLoading(true);
        ensurePlayer();
      }
    } else if (player && readyRef.current) {
      player.playVideo();
    } else {
      setLoading(true);
      ensurePlayer();
    }
  }, [ensurePlayer, goTo, order.length, radio, songs]);

  const pause = useCallback(() => {
    wantPlayRef.current = false;
    setPlaying(false);
    setLoading(false);
    playerRef.current?.pauseVideo();
  }, []);

  const setOutputVolume = useCallback((value: number) => {
    if (readyRef.current) playerRef.current?.setVolume(value);
  }, []);

  const restoreVolume = useCallback(() => {
    if (readyRef.current) playerRef.current?.setVolume(volumeRef.current);
  }, []);

  const setShuffle = useCallback(
    (on: boolean) => {
      if (radio) return;
      const currentIndex = order[posRef.current];
      const others = order.filter((i) => i !== currentIndex);
      const next = on
        ? [currentIndex, ...shuffleItems(others, Math.floor(Math.random() * 2 ** 32))]
        : songs.map((_, i) => i);
      const nextPos = on ? 0 : currentIndex;
      posRef.current = nextPos;
      setOrder(next);
      setPos(nextPos);
      setShuffled(on);
    },
    [order, radio, songs],
  );

  const toggle = useCallback(() => {
    if (wantPlayRef.current) pause();
    else play();
  }, [pause, play]);

  const next = useCallback(() => {
    if (radio) return;
    goTo(posRef.current + 1, wantPlayRef.current);
  }, [goTo, radio]);

  const seek = useCallback((seconds: number) => {
    if (radio) return;
    const player = playerRef.current;
    setCurrentTime(seconds);
    if (player && readyRef.current) player.seekTo(seconds, true);
  }, [radio]);

  const previous = useCallback(() => {
    if (radio) return;
    const player = playerRef.current;
    const elapsed = player && readyRef.current ? player.getCurrentTime() : 0;
    if (elapsed > 3) seek(0);
    else goTo(posRef.current - 1, wantPlayRef.current);
  }, [goTo, radio, seek]);

  const status: PlayerStatus = {
    song,
    playing,
    loading,
    ready,
    started,
    currentTime,
    duration,
    error,
    shuffled,
  };
  const actions = useMemo<PlayerActions>(
    () => ({ play, pause, toggle, next, previous, seek, setShuffle, setOutputVolume, restoreVolume }),
    [play, pause, toggle, next, previous, seek, setShuffle, setOutputVolume, restoreVolume],
  );

  return { status, actions, containerRef };
}
