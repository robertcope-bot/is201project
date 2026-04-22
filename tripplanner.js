const hikeForm = document.getElementById("hikeForm");
const totalHikes = document.getElementById("totalHikes");
const totalMiles = document.getElementById("totalMiles");
const totalElevation = document.getElementById("totalElevation");
const badgeCount = document.getElementById("badgeCount");
const challengeList = document.getElementById("challengeList");
const badgeGrid = document.getElementById("badgeGrid");
const trailLog = document.getElementById("trailLog");
const resetProgress = document.getElementById("resetProgress");
const badgeTooltip = document.getElementById("badgeTooltip");
const resetModal = document.getElementById("resetModal");
const cancelReset = document.getElementById("cancelReset");
const confirmReset = document.getElementById("confirmReset");

const trailNameInput = document.getElementById("trailName");
const milesInput = document.getElementById("miles");
const elevationInput = document.getElementById("elevation");
const featureInput = document.getElementById("feature");

const starterHikes = [
    {
        trail: "Silver Ridge Loop",
        miles: 4.2,
        elevation: 850,
        feature: "forest"
    },
    {
        trail: "Cascade Falls",
        miles: 5.6,
        elevation: 1150,
        feature: "waterfall"
    }
];

const savedHikes = getSavedHikes();

const state = {
    hikes: savedHikes || [...starterHikes]
};

let activeDailyGoalDate = getDateKey();

const challenges = [
    {
        id: "first-steps",
        title: "Log your first hike",
        badge: "First Steps",
        description: "Add 1 hike to your trail log.",
        target: 1,
        progress: (hikes) => hikes.length
    },
    {
        id: "trail-regular",
        title: "Complete 5 hikes",
        badge: "Trail Regular",
        description: "Add 5 total hikes to your trail log.",
        target: 5,
        progress: (hikes) => hikes.length
    },
    {
        id: "pathfinder",
        title: "Complete 10 hikes",
        badge: "Pathfinder",
        description: "Add 10 total hikes to your trail log.",
        target: 10,
        progress: (hikes) => hikes.length
    },
    {
        id: "five-over-five",
        title: "5 hikes over 5 miles",
        badge: "Endurance Badge",
        description: "Complete 5 separate hikes that are each at least 5 miles long.",
        target: 5,
        progress: (hikes) => hikes.filter((hike) => hike.miles >= 5).length
    },
    {
        id: "long-hauler",
        title: "Complete a 10 mile hike",
        badge: "Long Hauler",
        description: "Log 1 hike that is at least 10 miles long.",
        target: 1,
        progress: (hikes) => hikes.filter((hike) => hike.miles >= 10).length
    },
    {
        id: "marathon-mountain",
        title: "Log 26.2 total miles",
        badge: "Marathon Mountain",
        description: "Build up 26.2 total miles across all logged hikes.",
        target: 26.2,
        unit: "mi",
        progress: (hikes) => hikes.reduce((sum, hike) => sum + hike.miles, 0)
    },
    {
        id: "fifty-mile-club",
        title: "Log 50 total miles",
        badge: "Fifty Mile Club",
        description: "Build up 50 total miles across all logged hikes.",
        target: 50,
        unit: "mi",
        progress: (hikes) => hikes.reduce((sum, hike) => sum + hike.miles, 0)
    },
    {
        id: "waterfall-hunter",
        title: "Visit 3 waterfalls",
        badge: "Waterfall Hunter",
        description: "Log 3 hikes with Waterfall selected as the trail feature.",
        target: 3,
        progress: (hikes) => hikes.filter((hike) => hike.feature === "waterfall").length
    },
    {
        id: "cascade-chaser",
        title: "Visit 5 waterfalls",
        badge: "Cascade Chaser",
        description: "Log 5 hikes with Waterfall selected as the trail feature.",
        target: 5,
        progress: (hikes) => hikes.filter((hike) => hike.feature === "waterfall").length
    },
    {
        id: "vertical-climber",
        title: "Climb 2,000 ft elevation",
        badge: "Vertical Climber",
        description: "Log hikes until your total elevation gain reaches 2,000 feet.",
        target: 2000,
        unit: "ft",
        progress: (hikes) => hikes.reduce((sum, hike) => sum + hike.elevation, 0)
    },
    {
        id: "summit-pusher",
        title: "Climb 5,000 ft elevation",
        badge: "Summit Pusher",
        description: "Log hikes until your total elevation gain reaches 5,000 feet.",
        target: 5000,
        unit: "ft",
        progress: (hikes) => hikes.reduce((sum, hike) => sum + hike.elevation, 0)
    },
    {
        id: "skyline-legend",
        title: "Climb 10,000 ft elevation",
        badge: "Skyline Legend",
        description: "Log hikes until your total elevation gain reaches 10,000 feet.",
        target: 10000,
        unit: "ft",
        progress: (hikes) => hikes.reduce((sum, hike) => sum + hike.elevation, 0)
    },
    {
        id: "peak-bagger",
        title: "Reach 3 summits",
        badge: "Peak Bagger",
        description: "Log 3 hikes with Summit selected as the trail feature.",
        target: 3,
        progress: (hikes) => hikes.filter((hike) => hike.feature === "summit").length
    },
    {
        id: "summit-master",
        title: "Reach 6 summits",
        badge: "Summit Master",
        description: "Log 6 hikes with Summit selected as the trail feature.",
        target: 6,
        progress: (hikes) => hikes.filter((hike) => hike.feature === "summit").length
    },
    {
        id: "lake-seeker",
        title: "Find 2 lake trails",
        badge: "Lake Seeker",
        description: "Log 2 hikes with Lake selected as the trail feature.",
        target: 2,
        progress: (hikes) => hikes.filter((hike) => hike.feature === "lake").length
    },
    {
        id: "alpine-swimmer",
        title: "Find 5 lake trails",
        badge: "Alpine Swimmer",
        description: "Log 5 hikes with Lake selected as the trail feature.",
        target: 5,
        progress: (hikes) => hikes.filter((hike) => hike.feature === "lake").length
    },
    {
        id: "forest-walker",
        title: "Explore 3 forest trails",
        badge: "Forest Walker",
        description: "Log 3 hikes with Forest selected as the trail feature.",
        target: 3,
        progress: (hikes) => hikes.filter((hike) => hike.feature === "forest").length
    },
    {
        id: "green-tunnel",
        title: "Explore 6 forest trails",
        badge: "Green Tunnel",
        description: "Log 6 hikes with Forest selected as the trail feature.",
        target: 6,
        progress: (hikes) => hikes.filter((hike) => hike.feature === "forest").length
    },
    {
        id: "wildlife-watcher",
        title: "Spot wildlife 3 times",
        badge: "Wildlife Watcher",
        description: "Log 3 hikes with Wildlife selected as the trail feature.",
        target: 3,
        progress: (hikes) => hikes.filter((hike) => hike.feature === "wildlife").length
    },
    {
        id: "all-terrain",
        title: "Try every trail feature",
        badge: "All Terrain",
        description: "Log at least 1 summit, waterfall, lake, forest, and wildlife hike.",
        target: 5,
        progress: (hikes) => new Set(hikes.map((hike) => hike.feature)).size
    }
];

const dailyGoals = [
    {
        title: "Log 1 hike today",
        target: 1,
        progress: (hikes) => hikes.length
    },
    {
        title: "Hike 2 miles today",
        target: 2,
        unit: "mi",
        progress: (hikes) => hikes.reduce((sum, hike) => sum + hike.miles, 0)
    },
    {
        title: "Hike 3 miles today",
        target: 3,
        unit: "mi",
        progress: (hikes) => hikes.reduce((sum, hike) => sum + hike.miles, 0)
    },
    {
        title: "Climb 300 ft today",
        target: 300,
        unit: "ft",
        progress: (hikes) => hikes.reduce((sum, hike) => sum + hike.elevation, 0)
    },
    {
        title: "Climb 500 ft today",
        target: 500,
        unit: "ft",
        progress: (hikes) => hikes.reduce((sum, hike) => sum + hike.elevation, 0)
    },
    {
        title: "Visit a forest trail today",
        target: 1,
        progress: (hikes) => hikes.filter((hike) => hike.feature === "forest").length
    },
    {
        title: "Find water on the trail today",
        target: 1,
        progress: (hikes) => hikes.filter((hike) => hike.feature === "waterfall" || hike.feature === "lake").length
    },
    {
        title: "Reach one summit today",
        target: 1,
        progress: (hikes) => hikes.filter((hike) => hike.feature === "summit").length
    },
    {
        title: "Spot wildlife today",
        target: 1,
        progress: (hikes) => hikes.filter((hike) => hike.feature === "wildlife").length
    },
    {
        title: "Try any scenic feature today",
        target: 1,
        progress: (hikes) => hikes.filter((hike) => hike.feature !== "").length
    }
];

function getSavedHikes() {
    try {
        const saved = localStorage.getItem("hikingChallengeHikes");
        const parsedHikes = saved ? JSON.parse(saved) : null;
        return Array.isArray(parsedHikes) ? parsedHikes : null;
    } catch (error) {
        return null;
    }
}

function saveHikes() {
    try {
        localStorage.setItem("hikingChallengeHikes", JSON.stringify(state.hikes));
    } catch (error) {
        return;
    }
}

function getTotals() {
    return state.hikes.reduce(
        (totals, hike) => ({
            hikes: totals.hikes + 1,
            miles: totals.miles + hike.miles,
            elevation: totals.elevation + hike.elevation
        }),
        {
            hikes: 0,
            miles: 0,
            elevation: 0
        }
    );
}

function getUnlockedBadges() {
    return challenges.filter((challenge) => challenge.progress(state.hikes) >= challenge.target);
}

function getDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getLocalDayNumber(date = new Date()) {
    return Math.floor(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 86400000);
}

function getTodaysHikes() {
    const today = getDateKey();
    return state.hikes.filter((hike) => hike.date === today);
}

function getDailyGoals() {
    const dayNumber = getLocalDayNumber();
    const startIndex = dayNumber % dailyGoals.length;

    return Array.from({ length: 5 }, (_, index) => dailyGoals[(startIndex + index) % dailyGoals.length]);
}

function renderStats() {
    const totals = getTotals();
    const unlockedBadges = getUnlockedBadges();

    totalHikes.textContent = totals.hikes;
    totalMiles.textContent = totals.miles.toFixed(1);
    totalElevation.textContent = `${Math.round(totals.elevation).toLocaleString()} ft`;
    badgeCount.textContent = unlockedBadges.length;
}

function renderChallenges() {
    const todaysHikes = getTodaysHikes();

    challengeList.innerHTML = getDailyGoals()
        .map((challenge) => {
            const progress = challenge.progress(todaysHikes);
            const percent = Math.min(100, Math.round((progress / challenge.target) * 100));
            const value = `${Math.min(progress, challenge.target).toLocaleString()} / ${challenge.target.toLocaleString()}${challenge.unit ? ` ${challenge.unit}` : ""}`;

            return `
                <div class="challenge">
                    <div>
                        <strong>${challenge.title}</strong>
                        <div class="challenge-meta">${value}</div>
                    </div>
                    <div class="progress-track" aria-label="${challenge.title} progress">
                        <div class="progress-fill" style="width: ${percent}%"></div>
                    </div>
                </div>
            `;
        })
        .join("");
}

function renderBadges() {
    badgeGrid.innerHTML = challenges
        .map((challenge) => {
            const unlocked = challenge.progress(state.hikes) >= challenge.target;

            return `
                <div
                    class="badge ${unlocked ? "" : "locked"}"
                    tabindex="0"
                    data-badge="${challenge.badge}"
                    data-description="${challenge.description}"
                >
                    <span class="badge-icon">${unlocked ? "🏅" : "○"}</span>
                    <strong>${challenge.badge}</strong>
                    <div class="badge-status">${unlocked ? "Unlocked" : "Locked"}</div>
                </div>
            `;
        })
        .join("");
}

function showBadgeTooltip(badge) {
    badgeTooltip.innerHTML = `<strong>${badge.dataset.badge}</strong>${badge.dataset.description}`;
    badgeTooltip.classList.add("visible");
}

function moveBadgeTooltip(event) {
    const offset = 18;
    const tooltipWidth = badgeTooltip.offsetWidth;
    const tooltipHeight = badgeTooltip.offsetHeight;
    const left = Math.min(event.clientX + offset, window.innerWidth - tooltipWidth - 16);
    const top = Math.min(event.clientY + offset, window.innerHeight - tooltipHeight - 16);

    badgeTooltip.style.left = `${Math.max(16, left)}px`;
    badgeTooltip.style.top = `${Math.max(16, top)}px`;
}

function hideBadgeTooltip() {
    badgeTooltip.classList.remove("visible");
}

function openResetModal() {
    resetModal.classList.add("visible");
    resetModal.setAttribute("aria-hidden", "false");
    confirmReset.focus();
}

function closeResetModal() {
    resetModal.classList.remove("visible");
    resetModal.setAttribute("aria-hidden", "true");
    resetProgress.focus();
}

function renderTrailLog() {
    trailLog.innerHTML = state.hikes
        .slice()
        .reverse()
        .slice(0, 5)
        .map(
            (hike) =>
                `<li><strong>${hike.trail}</strong> · ${hike.miles.toFixed(1)} mi · ${hike.elevation.toLocaleString()} ft · ${hike.feature}</li>`
        )
        .join("");
}

function renderApp() {
    renderStats();
    renderChallenges();
    renderBadges();
    renderTrailLog();
}

hikeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const trail = trailNameInput.value.trim();
    const miles = Number(milesInput.value);
    const elevation = Number(elevationInput.value);

    if (!trail || miles <= 0 || elevation < 0) {
        return;
    }

    state.hikes.push({
        trail,
        miles,
        elevation,
        feature: featureInput.value,
        date: getDateKey()
    });

    saveHikes();
    hikeForm.reset();
    featureInput.value = "summit";
    renderApp();
});

resetProgress.addEventListener("click", () => {
    openResetModal();
});

confirmReset.addEventListener("click", () => {
    state.hikes = [];
    saveHikes();
    hikeForm.reset();
    featureInput.value = "summit";
    hideBadgeTooltip();
    closeResetModal();
    renderApp();
});

cancelReset.addEventListener("click", closeResetModal);

resetModal.addEventListener("click", (event) => {
    if (event.target === resetModal) {
        closeResetModal();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && resetModal.classList.contains("visible")) {
        closeResetModal();
    }
});

badgeGrid.addEventListener("mouseover", (event) => {
    const badge = event.target.closest(".badge");

    if (!badge) {
        return;
    }

    showBadgeTooltip(badge);
    moveBadgeTooltip(event);
});

badgeGrid.addEventListener("mousemove", (event) => {
    if (!event.target.closest(".badge")) {
        return;
    }

    moveBadgeTooltip(event);
});

badgeGrid.addEventListener("mouseout", (event) => {
    const badge = event.target.closest(".badge");

    if (!badge || badge.contains(event.relatedTarget)) {
        return;
    }

    hideBadgeTooltip();
});

badgeGrid.addEventListener("focusin", (event) => {
    const badge = event.target.closest(".badge");

    if (!badge) {
        return;
    }

    const rect = badge.getBoundingClientRect();
    showBadgeTooltip(badge);
    moveBadgeTooltip({
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2
    });
});

badgeGrid.addEventListener("focusout", hideBadgeTooltip);

setInterval(() => {
    const currentDate = getDateKey();

    if (currentDate !== activeDailyGoalDate) {
        activeDailyGoalDate = currentDate;
        renderChallenges();
    }
}, 60000);

renderApp();
