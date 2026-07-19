/* TRIP BUILDER: route/vehicle/passenger customizer + WhatsApp link */
(function () {
    "use strict";

    // ---------- Trip Customizer ----------
    (function () {
        const destInput = document.getElementById("destInput");
        const vehicleChips = document.querySelectorAll(".vehicle-chip");
        const tripTypeBtns = document.querySelectorAll(
            "#tripTypeGroup .pill-btn",
        );
        const paxCount = document.getElementById("paxCount");
        const travelDate = document.getElementById("travelDate");
        if (!destInput) return;

        const routeField = document.getElementById("routeField");
        const multiDestField = document.getElementById("multiDestField");
        const stopsList = document.getElementById("stopsList");
        const addStopBtn = document.getElementById("addStopBtn");
        const multiDayField = document.getElementById("multiDayField");
        const daysList = document.getElementById("daysList");
        const addDayBtn = document.getElementById("addDayBtn");
        const pickupInput = document.getElementById("pickupInput");

        let state = {
            destination: "",
            vehicleName: "Swift Dzire",
            tripType: "oneway",
            pax: 2,
            date: "",
            stops: ["", ""],
            dayPlans: ["", "", ""],
        };
        const tripLabels = {
            oneway: "One-Way",
            round: "Round Trip",
            multidest: "Multiple Destinations",
            multiday: "Multi-Day Tour",
        };

        function renderList(container, arr, opts) {
            container.innerHTML = "";
            arr.forEach((val, i) => {
                const row = document.createElement("div");
                row.className = "stop-row";
                row.innerHTML = `<span class="stop-index">${opts.label(i)}</span><input type="text" list="destList" placeholder="${opts.placeholder}" value="${val.replace(/"/g, "")}" data-idx="${i}"><button type="button" class="stop-remove" ${arr.length <= opts.min ? "disabled" : ""} data-idx="${i}">×</button>`;
                container.appendChild(row);
            });
            container.querySelectorAll("input").forEach((inp) => {
                inp.addEventListener("input", (e) => {
                    arr[parseInt(e.target.dataset.idx)] = e.target.value;
                    update();
                });
            });
            container.querySelectorAll(".stop-remove").forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    if (arr.length <= opts.min) return;
                    arr.splice(parseInt(e.target.dataset.idx), 1);
                    renderList(container, arr, opts);
                    update();
                });
            });
        }

        const stopsOpts = {
            label: (i) => i + 1,
            placeholder: "e.g. Shirdi",
            min: 2,
        };
        const dayOpts = {
            label: (i) => "Day " + (i + 1),
            placeholder: 'e.g. Aurangabad, or "sightseeing"',
            min: 1,
        };
        renderList(stopsList, state.stops, stopsOpts);
        renderList(daysList, state.dayPlans, dayOpts);

        addStopBtn.addEventListener("click", () => {
            if (state.stops.length >= 20) return;
            state.stops.push("");
            renderList(stopsList, state.stops, stopsOpts);
            update();
        });
        addDayBtn.addEventListener("click", () => {
            if (state.dayPlans.length >= 60) return;
            state.dayPlans.push("");
            renderList(daysList, state.dayPlans, dayOpts);
            update();
        });

        function update() {
            const pickup = pickupInput.value.trim() || "Nashik";
            let routeLabel;
            let tripLabel = tripLabels[state.tripType];

            if (state.tripType === "multidest") {
                const named = state.stops.map((s) => s.trim()).filter(Boolean);
                routeLabel = named.length
                    ? pickup + " → " + named.join(" → ") + " → " + pickup
                    : "Add your destinations";
            } else if (state.tripType === "multiday") {
                const namedDays = state.dayPlans.map((s) => s.trim());
                const dayCount = state.dayPlans.length;
                tripLabel += ` (${dayCount} day${dayCount > 1 ? "s" : ""})`;
                const filled = namedDays.filter(Boolean);
                routeLabel = filled.length
                    ? pickup + " → " + filled.join(" → ") + " → " + pickup
                    : pickup + " — itinerary to be filled in";
            } else {
                const dest = state.destination.trim() || "Your Destination";
                routeLabel = pickup + " → " + dest;
            }

            document.getElementById("summaryRoute").textContent = routeLabel;
            document.getElementById("summaryVehicle").textContent =
                state.vehicleName;
            document.getElementById("summaryTripType").textContent = tripLabel;
            document.getElementById("summaryPax").textContent = state.pax;
            document.getElementById("summaryDate").textContent = state.date
                ? new Date(state.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                  })
                : "To be confirmed";

            let dayByDayText = "";
            if (state.tripType === "multiday") {
                const lines = state.dayPlans
                    .map(
                        (d, i) =>
                            `  Day ${i + 1}: ${d.trim() || "(to be planned)"}`,
                    )
                    .join("\n");
                dayByDayText = `\nDay-by-day plan:\n${lines}\n`;
            }

            const waText = encodeURIComponent(
                `Hello Gurudatta Tour's & Travels, I'd like to request a trip:\n` +
                    `Route: ${routeLabel}\n` +
                    `Vehicle: ${state.vehicleName}\n` +
                    `Trip Type: ${tripLabel}\n` +
                    dayByDayText +
                    `Passengers: ${state.pax}\n` +
                    `Date: ${state.date || "To be confirmed"}\n` +
                    `Please share the exact fare for this itinerary.`,
            );
            document.getElementById("waLink").href =
                `https://wa.me/919011712399?text=${waText}`;
        }

        destInput.addEventListener("input", () => {
            state.destination = destInput.value;
            update();
        });
        pickupInput.addEventListener("input", update);

        vehicleChips.forEach((chip) => {
            chip.addEventListener("click", () => {
                vehicleChips.forEach((c) => c.classList.remove("active"));
                chip.classList.add("active");
                const [name] = chip.dataset.vehicle.split("|");
                state.vehicleName = name;
                update();
            });
        });

        tripTypeBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                tripTypeBtns.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                state.tripType = btn.dataset.type;
                routeField.style.display = "none";
                multiDestField.style.display = "none";
                multiDayField.style.display = "none";
                if (state.tripType === "multidest")
                    multiDestField.style.display = "block";
                else if (state.tripType === "multiday")
                    multiDayField.style.display = "block";
                else routeField.style.display = "block";
                update();
            });
        });

        document.getElementById("paxMinus").addEventListener("click", () => {
            state.pax = Math.max(1, state.pax - 1);
            paxCount.textContent = state.pax;
            update();
        });
        document.getElementById("paxPlus").addEventListener("click", () => {
            state.pax = Math.min(12, state.pax + 1);
            paxCount.textContent = state.pax;
            update();
        });
        travelDate.addEventListener("change", () => {
            state.date = travelDate.value;
            update();
        });

        update();
    })();
})();
