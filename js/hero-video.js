/* ============================================================
   HERO VIDEO ROTATOR
   One <video autoplay muted loop playsinline> element, cycling
   through 4 clips.

   IMPORTANT TIMING FIX: each clip gets its full 9 seconds of
   visible playback ONLY AFTER it actually starts playing — not
   9 seconds from when we told the browser to load it. These are
   multi-MB files; if a clip is still buffering when a fixed timer
   fires, it gets cut off before ever rendering a frame, which is
   what caused the "poster keeps flashing back" stutter. Now the
   countdown only starts once the 'playing' event actually fires.

   Respects prefers-reduced-motion and Data Saver mode: both skip
   video entirely and leave the poster image showing instead.
   ============================================================ */
(function () {
    "use strict";

    const video = document.getElementById("heroVideo");
    if (!video) return;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (prefersReducedMotion || saveData) {
        video.removeAttribute("autoplay");
        return;
    }

    const sources = [
        "https://videos.pexels.com/video-files/4695859/4695859-uhd_2560_1440_30fps.mp4",
        "https://videos.pexels.com/video-files/12098100/12098100-uhd_2560_1440_30fps.mp4",
        "https://videos.pexels.com/video-files/16473262/16473262-uhd_2560_1440_30fps.mp4",
        "https://videos.pexels.com/video-files/1394254/1394254-uhd_2732_1440_24fps.mp4",
    ];

    let index = 0;
    let consecutiveFailures = 0;
    let holdTimer = null;
    const CLIP_DURATION_MS = 9000;

    function playClip(i) {
        video.src = sources[i];
        video.load();
        const p = video.play();
        if (p && p.catch)
            p.catch(() => {
                /* autoplay blocked — poster image stays visible */
            });
    }

    function advance() {
        index = (index + 1) % sources.length;
        playClip(index);
    }

    // Only start the "how long to show this clip" countdown once it's
    // actually rendering frames — not from when we requested it.
    video.addEventListener("playing", () => {
        consecutiveFailures = 0;
        clearTimeout(holdTimer);
        holdTimer = setTimeout(advance, CLIP_DURATION_MS);
    });

    video.addEventListener("error", () => {
        console.warn(
            '[hero-video] "' +
                sources[index] +
                '" failed to load, skipping to next clip.',
        );
        consecutiveFailures++;
        if (consecutiveFailures >= sources.length) {
            console.warn(
                "[hero-video] All sources failed — stopping and leaving the poster image visible.",
            );
            clearTimeout(holdTimer);
            return;
        }
        advance();
    });

    playClip(0);
})();
