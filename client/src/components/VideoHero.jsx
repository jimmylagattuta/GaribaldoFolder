
import { useEffect, useRef, useState } from "react";
import { heroMedia } from "../config/heroMedia";

const MOBILE_BREAKPOINT = "(max-width: 767px)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export default function VideoHero() {
  const videoRef = useRef(null);

  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(MOBILE_BREAKPOINT).matches
  );

  const [posterReady, setPosterReady] = useState(false);

  const [isPageVisible, setIsPageVisible] = useState(
    () =>
      typeof document === "undefined" ||
      !document.hidden
  );

  const [shouldPlay, setShouldPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [requestedVideo, setRequestedVideo] =
    useState(null);

  const mode = isMobile ? "mobile" : "desktop";
  const media = heroMedia[mode];

  // Only mount the video selected for this viewport.
  const activeVideoSrc =
    requestedVideo?.mode === mode
      ? requestedVideo.url
      : null;

  // Keep breakpoint selection synchronized.
  useEffect(() => {
    const query = window.matchMedia(MOBILE_BREAKPOINT);

    const update = () => {
      setIsMobile(query.matches);
    };

    update();

    query.addEventListener("change", update);

    return () => {
      query.removeEventListener("change", update);
    };
  }, []);

  // Respect accessibility and data-saving preferences.
  useEffect(() => {
    const motionQuery = window.matchMedia(
      REDUCED_MOTION
    );

    const updatePreferences = () => {
      const saveData =
        navigator.connection?.saveData === true;

      setShouldPlay(
        !motionQuery.matches && !saveData
      );
    };

    updatePreferences();

    motionQuery.addEventListener(
      "change",
      updatePreferences
    );

    const connection = navigator.connection;

    connection?.addEventListener?.(
      "change",
      updatePreferences
    );

    return () => {
      motionQuery.removeEventListener(
        "change",
        updatePreferences
      );

      connection?.removeEventListener?.(
        "change",
        updatePreferences
      );
    };
  }, []);

  // Pause only when the browser tab becomes hidden.
  // Scrolling no longer changes video playback.
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  // Reset the crossfade when switching video versions.
  useEffect(() => {
    setIsPlaying(false);
  }, [mode]);

  /*
   * Poster-first, idle-triggered loading.
   *
   * 1. Wait until the poster is decoded and painted.
   * 2. Wait briefly to avoid competing with initial paint.
   * 3. Wait for browser idle time.
   * 4. Attach the video URL only then.
   *
   * No IntersectionObserver or scroll visibility checks.
   */
  useEffect(() => {
    if (
      !posterReady ||
      !shouldPlay ||
      !isPageVisible ||
      activeVideoSrc
    ) {
      return;
    }

    let cancelled = false;
    let timerId;
    let idleId;
    let frame1;
    let frame2;

    const requestVideo = () => {
      if (cancelled) return;

      setRequestedVideo({
        mode,
        url: media.video,
      });
    };

    const scheduleIdleLoad = () => {
      if (cancelled) return;

      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(
          requestVideo,
          {
            timeout: 4000,
          }
        );
      } else {
        requestVideo();
      }
    };

    // Allow the poster to reach the screen first.
    frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => {
        timerId = window.setTimeout(
          scheduleIdleLoad,
          1800
        );
      });
    });

    return () => {
      cancelled = true;

      cancelAnimationFrame(frame1);

      if (frame2 !== undefined) {
        cancelAnimationFrame(frame2);
      }

      if (timerId !== undefined) {
        window.clearTimeout(timerId);
      }

      if (
        idleId !== undefined &&
        "cancelIdleCallback" in window
      ) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [
    posterReady,
    shouldPlay,
    isPageVisible,
    activeVideoSrc,
    mode,
    media.video,
  ]);

  // Pause and resume only for tab visibility or preferences.
  useEffect(() => {
    const video = videoRef.current;

    if (!video || !activeVideoSrc) return;

    if (!shouldPlay || !isPageVisible) {
      video.pause();
      return;
    }

    video.play().catch(() => {
      setIsPlaying(false);
    });
  }, [
    activeVideoSrc,
    shouldPlay,
    isPageVisible,
  ]);

  const handlePosterLoad = (image) => {
    // Avoid replacing the poster with an undecoded image.
    if (typeof image.decode === "function") {
      image
        .decode()
        .catch(() => {})
        .finally(() => {
          setPosterReady(true);
        });
    } else {
      setPosterReady(true);
    }
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-stone-900"
      aria-hidden="true"
    >
      {/* Responsive high-priority poster */}
      <picture className="absolute inset-0 block h-full w-full">
        <source
          media={MOBILE_BREAKPOINT}
          srcSet={heroMedia.mobile.posterSrcSet}
          sizes={heroMedia.mobile.posterSizes}
        />

        <img
          src={heroMedia.desktop.poster}
          srcSet={heroMedia.desktop.posterSrcSet}
          sizes={heroMedia.desktop.posterSizes}
          alt=""
          fetchPriority="high"
          loading="eager"
          decoding="async"
          onLoad={(event) =>
            handlePosterLoad(event.currentTarget)
          }
          className="h-full w-full object-cover"
        />
      </picture>

      {/* Video is created only after idle scheduling */}
      {activeVideoSrc && shouldPlay && (
        <video
          key={activeVideoSrc}
          ref={videoRef}
          src={activeVideoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          tabIndex={-1}
          onPlaying={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => setIsPlaying(false)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            isPlaying
              ? "opacity-100"
              : "opacity-0"
          }`}
        />
      )}

      {/*
        Permanent dark overlay.

        Desktop: 45% black.
        Mobile: 35% black.

        The overlay never changes during scrolling.
      */}
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-black/35 md:bg-black/45"
        aria-hidden="true"
      />
    </div>
  );
}
