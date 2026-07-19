/* MICRO-INTERACTIONS: stat counters, cursor spotlight, hero glow, magnetic buttons */
(function () {
    "use strict";

    // count-up numbers
    const counters = document.querySelectorAll(".stat-num[data-count]");
    const countIO = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.dataset.count, 10);
                const suffix = el.dataset.suffix || "";
                const duration = 1400;
                const start = performance.now();
                function tick(now) {
                    const p = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    const val = Math.round(target * eased);
                    el.textContent = val.toLocaleString("en-IN") + suffix;
                    if (p < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
                countIO.unobserve(el);
            });
        },
        { threshold: 0.6 },
    );
    counters.forEach((el) => countIO.observe(el));

    // spotlight cursor glow on cards
    document.querySelectorAll(".spot-card").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty(
                "--x",
                ((e.clientX - r.left) / r.width) * 100 + "%",
            );
            card.style.setProperty(
                "--y",
                ((e.clientY - r.top) / r.height) * 100 + "%",
            );
        });
    });

    // hero ambient glow follows cursor
    const heroGlow = document.getElementById("heroGlow");
    const heroSection = document.querySelector(".hero");
    if (heroGlow && heroSection) {
        heroSection.addEventListener("mousemove", (e) => {
            const r = heroSection.getBoundingClientRect();
            heroGlow.style.setProperty(
                "--hx",
                ((e.clientX - r.left) / r.width) * 100 + "%",
            );
            heroGlow.style.setProperty(
                "--hy",
                ((e.clientY - r.top) / r.height) * 100 + "%",
            );
        });
    }

    // magnetic primary buttons
    document.querySelectorAll(".btn-primary").forEach((btn) => {
        btn.addEventListener("mousemove", (e) => {
            const r = btn.getBoundingClientRect();
            const mx = (e.clientX - r.left - r.width / 2) * 0.25;
            const my = (e.clientY - r.top - r.height / 2) * 0.35;
            btn.style.transform = `translate(${mx}px, ${my}px)`;
        });
        btn.addEventListener("mouseleave", () => {
            btn.style.transform = "translate(0,0)";
        });
    });
})();
