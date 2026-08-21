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
        const travelTime = document.getElementById("travelTime");
        const useLocationBtn = document.getElementById("useLocationBtn");
        const locationBtnText = document.getElementById("locationBtnText");
        const locationNote = document.getElementById("locationNote");
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
            maxPax: 4,
            date: "",
            time: "",
            stops: ["", ""],
            dayPlans: ["", "", ""],
            locationLink: "",
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
                routeLabel =
                    state.tripType === "round"
                        ? pickup + " → " + dest + " → " + pickup
                        : pickup + " → " + dest;
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
            document.getElementById("summaryTime").textContent = state.time
                ? formatTime(state.time)
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

            const locationLinkText = state.locationLink
                ? `\nExact pickup pin: ${state.locationLink}\n`
                : "";

            const waText = encodeURIComponent(
                `Hello Gurudatta Tour's & Travels, I'd like to request a trip:\n` +
                    `Route: ${routeLabel}\n` +
                    locationLinkText +
                    `Vehicle: ${state.vehicleName}\n` +
                    `Trip Type: ${tripLabel}\n` +
                    dayByDayText +
                    `Passengers: ${state.pax}\n` +
                    `Date: ${state.date || "To be confirmed"}\n` +
                    `Pickup Time: ${state.time ? formatTime(state.time) : "To be confirmed"}\n` +
                    `Please share the exact fare for this itinerary.`,
            );
            document.getElementById("waLink").href =
                `https://wa.me/918485098277?text=${waText}`;
        }

        function formatTime(t) {
            // t is "HH:MM" from a time input; format as a friendly 12-hour string
            const [h, m] = t.split(":").map(Number);
            const period = h >= 12 ? "PM" : "AM";
            const h12 = h % 12 === 0 ? 12 : h % 12;
            return `${h12}:${String(m).padStart(2, "0")} ${period}`;
        }

        destInput.addEventListener("input", () => {
            state.destination = destInput.value;
            update();
        });

        vehicleChips.forEach((chip) => {
            chip.addEventListener("click", () => {
                vehicleChips.forEach((c) => c.classList.remove("active"));
                chip.classList.add("active");
                const [name, , , seats] = chip.dataset.vehicle.split("|");
                state.vehicleName = name;
                state.maxPax = parseInt(seats, 10) || 12;
                if (state.pax > state.maxPax) {
                    state.pax = state.maxPax;
                    paxCount.textContent = state.pax;
                }
                updatePaxButtons();
                update();
            });
        });

        function updatePaxButtons() {
            document.getElementById("paxPlus").disabled =
                state.pax >= state.maxPax;
            document.getElementById("paxMinus").disabled = state.pax <= 1;
            const maxNote = document.getElementById("paxMaxNote");
            if (maxNote)
                maxNote.textContent = `Max ${state.maxPax} for ${state.vehicleName}`;
        }

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
            updatePaxButtons();
            update();
        });
        document.getElementById("paxPlus").addEventListener("click", () => {
            state.pax = Math.min(state.maxPax, state.pax + 1);
            paxCount.textContent = state.pax;
            updatePaxButtons();
            update();
        });
        travelDate.addEventListener("change", () => {
            state.date = travelDate.value;
            update();
        });
        travelTime.addEventListener("change", () => {
            state.time = travelTime.value;
            update();
        });

        // "Use current location" — fills the pickup field and attaches a map pin
        // link to the WhatsApp message, since we don't have a paid reverse-geocoding
        // API to turn coordinates into a street address. A map link the driver can
        // tap is actually more precise than a guessed address anyway.
        pickupInput.addEventListener("input", () => {
            state.locationLink = "";
            update();
        }); // typing manually clears any previous pin
        if (useLocationBtn) {
            useLocationBtn.addEventListener("click", () => {
                if (!navigator.geolocation) {
                    locationNote.textContent =
                        "Your browser doesn't support location access. Please type your pickup address instead.";
                    locationNote.className = "location-note error";
                    return;
                }
                useLocationBtn.disabled = true;
                locationBtnText.textContent = "Locating…";
                locationNote.textContent = "";
                locationNote.className = "location-note";

                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const { latitude, longitude } = pos.coords;
                        state.locationLink = `https://maps.google.com/?q=${latitude},${longitude}`;
                        pickupInput.value = "My Current Location";
                        useLocationBtn.disabled = false;
                        locationBtnText.textContent = "Use Current Location";
                        locationNote.textContent =
                            "Location added. Your exact pin will be shared with the driver.";
                        locationNote.className = "location-note success";
                        update();
                    },
                    (err) => {
                        useLocationBtn.disabled = false;
                        locationBtnText.textContent = "Use Current Location";
                        if (err.code === err.PERMISSION_DENIED) {
                            locationNote.textContent =
                                "Location permission denied. Please type your pickup address instead.";
                        } else {
                            locationNote.textContent =
                                "Couldn't get your location. Please type your pickup address instead.";
                        }
                        locationNote.className = "location-note error";
                    },
                    { enableHighAccuracy: true, timeout: 10000 },
                );
            });
        }

        updatePaxButtons();
        update();
    })();

    // ---------- Customer Feedback ----------
    (function () {
        const starRating = document.getElementById("starRating");
        if (!starRating) return;

        const stars = starRating.querySelectorAll(".star");
        const nameInput = document.getElementById("feedbackName");
        const routeInput = document.getElementById("feedbackRoute");
        const textInput = document.getElementById("feedbackText");
        const submitBtn = document.getElementById("feedbackSubmit");
        const note = document.getElementById("feedbackNote");
        let rating = 0;

        function paintStars(value) {
            stars.forEach((s) =>
                s.classList.toggle(
                    "filled",
                    parseInt(s.dataset.value, 10) <= value,
                ),
            );
        }

        stars.forEach((star) => {
            star.addEventListener("click", () => {
                rating = parseInt(star.dataset.value, 10);
                paintStars(rating);
            });
            star.addEventListener("mouseenter", () =>
                paintStars(parseInt(star.dataset.value, 10)),
            );
        });
        starRating.addEventListener("mouseleave", () => paintStars(rating));

        submitBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const name = nameInput.value.trim();
            const route = routeInput.value.trim();
            const text = textInput.value.trim();

            if (!text) {
                note.textContent =
                    "Please add a line about your experience before sending.";
                note.style.color = "var(--rust)";
                textInput.focus();
                return;
            }

            const stars =
                rating > 0
                    ? "★".repeat(rating) +
                      "☆".repeat(5 - rating) +
                      ` (${rating}/5)`
                    : "Not rated";
            const message =
                `Hello Gurudatta Tour's & Travels, I'd like to share some feedback:\n` +
                `Name: ${name || "Not provided"}\n` +
                (route ? `Trip: ${route}\n` : "") +
                `Rating: ${stars}\n` +
                `Feedback: ${text}`;

            submitBtn.href = `https://wa.me/918485098277?text=${encodeURIComponent(message)}`;
            window.open(submitBtn.href, "_blank", "noopener");
            note.textContent =
                "Thanks! Complete sending it in WhatsApp to submit your feedback.";
            note.style.color = "var(--ink-soft)";
        });
    })();
})();
