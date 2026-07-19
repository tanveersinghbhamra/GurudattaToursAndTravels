/* NAVIGATION: header scroll, mobile menu, FAQ accordion, scroll-reveal */
(function () {
    "use strict";

    // reveal-on-scroll
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add("in");
                    io.unobserve(e.target);
                }
            });
        },
        { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));

    // header solid-on-scroll
    const header = document.getElementById("siteHeader");
    function updateHeader() {
        if (window.scrollY > 60) header.classList.add("solid");
        else header.classList.remove("solid");
    }
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    const navtoggle = document.getElementById("navtoggle");
    const navlinks = document.getElementById("navlinks");
    const MENU_TRANSITION_MS = 420; // matches .navlinks max-height transition duration

    function openMenu() {
        navlinks.classList.add("open");
        navtoggle.classList.add("active");
        header.classList.add("nav-open");
    }
    function closeMenu() {
        navlinks.classList.remove("open");
        navtoggle.classList.remove("active");
        // keep the light logo colors until the dark panel has actually finished collapsing
        setTimeout(
            () => header.classList.remove("nav-open"),
            MENU_TRANSITION_MS,
        );
    }

    navtoggle.addEventListener("click", () => {
        if (navlinks.classList.contains("open")) closeMenu();
        else openMenu();
    });
    navlinks
        .querySelectorAll("a")
        .forEach((a) => a.addEventListener("click", closeMenu));

    document.querySelectorAll(".faq-item").forEach((item) => {
        item.querySelector(".faq-q").addEventListener("click", () => {
            const wasOpen = item.classList.contains("open");
            document
                .querySelectorAll(".faq-item")
                .forEach((i) => i.classList.remove("open"));
            if (!wasOpen) item.classList.add("open");
        });
    });
})();
