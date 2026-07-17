/* ============================================================
   CAROUSELS
   Testimonial rotator, pilgrimage image carousel,
   fleet rail arrows + auto-scroll.
   ============================================================ */
(function () {
    "use strict";

    // testimonial rotator
    (function () {
        const rotator = document.getElementById("testiRotator");
        if (!rotator) return;
        const slides = rotator.querySelectorAll(".testi-slide");
        const dotsWrap = document.getElementById("testiDots");
        let idx = 0;
        slides.forEach((s, i) => {
            const b = document.createElement("button");
            if (i === 0) b.classList.add("active");
            b.addEventListener("click", () => show(i));
            dotsWrap.appendChild(b);
        });
        function show(i) {
            slides[idx].classList.remove("active");
            dotsWrap.children[idx].classList.remove("active");
            idx = i;
            slides[idx].classList.add("active");
            dotsWrap.children[idx].classList.add("active");
        }
        setInterval(() => {
            show((idx + 1) % slides.length);
        }, 5500);
    })();

    // pilgrimage image carousel
    (function () {
        const track = document.getElementById("pilgrimTrack");
        if (!track) return;
        const slides = track.querySelectorAll(".pilgrim-slide");
        const dotsWrap = document.getElementById("pilgrimDots");
        const prevBtn = document.getElementById("pilgrimPrev");
        const nextBtn = document.getElementById("pilgrimNext");
        let idx = 0;
        let timer;

        slides.forEach((s, i) => {
            const b = document.createElement("button");
            if (i === 0) b.classList.add("active");
            b.addEventListener("click", () => {
                go(i);
                restart();
            });
            dotsWrap.appendChild(b);
        });

        function go(i) {
            idx = (i + slides.length) % slides.length;
            track.style.transform = `translateX(-${idx * 100}%)`;
            dotsWrap
                .querySelectorAll("button")
                .forEach((d, j) => d.classList.toggle("active", j === idx));
        }
        function restart() {
            clearInterval(timer);
            timer = setInterval(() => go(idx + 1), 4800);
        }

        prevBtn.addEventListener("click", () => {
            go(idx - 1);
            restart();
        });
        nextBtn.addEventListener("click", () => {
            go(idx + 1);
            restart();
        });

        // swipe support for mobile
        let startX = 0,
            dragging = false;
        track.addEventListener(
            "touchstart",
            (e) => {
                startX = e.touches[0].clientX;
                dragging = true;
            },
            { passive: true },
        );
        track.addEventListener("touchend", (e) => {
            if (!dragging) return;
            const dx = e.changedTouches[0].clientX - startX;
            if (dx > 40) {
                go(idx - 1);
                restart();
            } else if (dx < -40) {
                go(idx + 1);
                restart();
            }
            dragging = false;
        });

        go(0);
        restart();
    })();

    // fleet rail: arrow buttons + gentle auto-scroll
    (function () {
        const rail = document.getElementById("fleetRail");
        if (!rail) return;
        const prevBtn = document.getElementById("fleetPrev");
        const nextBtn = document.getElementById("fleetNext");
        const cardWidth = 320 + 22; // card width + gap

        function atEnd() {
            return rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
        }
        function scrollByCard(dir) {
            if (dir > 0 && atEnd())
                rail.scrollTo({ left: 0, behavior: "smooth" });
            else rail.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
        }

        prevBtn.addEventListener("click", () => {
            scrollByCard(-1);
            pause();
        });
        nextBtn.addEventListener("click", () => {
            scrollByCard(1);
            pause();
        });

        let timer;
        function play() {
            clearInterval(timer);
            timer = setInterval(() => scrollByCard(1), 3800);
        }
        function pause() {
            clearInterval(timer);
            setTimeout(play, 6000);
        }

        rail.addEventListener("mouseenter", () => clearInterval(timer));
        rail.addEventListener("mouseleave", play);
        rail.addEventListener("touchstart", () => clearInterval(timer), {
            passive: true,
        });
        rail.addEventListener("touchend", pause, { passive: true });

        play();
    })();
})();
