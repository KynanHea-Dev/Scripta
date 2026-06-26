const themes = {
    blue: {
        name: "Ocean Blue",
        accent: "#4da6ff",
        bg1: "#081120",
        bg2: "#162235",
        glass: "rgba(255,255,255,0.10)"
    },

    purple: {
        name: "Royal Purple",
        accent: "#a855f7",
        bg1: "#1b102f",
        bg2: "#31184f",
        glass: "rgba(255,255,255,0.10)"
    },

    green: {
        name: "Forest Green",
        accent: "#4ade80",
        bg1: "#081d14",
        bg2: "#163327",
        glass: "rgba(255,255,255,0.10)"
    },

    gold: {
        name: "Golden Light",
        accent: "#fbbf24",
        bg1: "#2a2007",
        bg2: "#45350e",
        glass: "rgba(255,255,255,0.10)"
    },

    crimson: {
        name: "Crimson Red",
        accent: "#ef4444",
        bg1: "#240b0b",
        bg2: "#401414",
        glass: "rgba(255,255,255,0.10)"
    },

    midnight: {
        name: "Midnight",
        accent: "#60a5fa",
        bg1: "#05070d",
        bg2: "#101827",
        glass: "rgba(255,255,255,0.08)"
    }
};

/* Apply a theme */
function applyTheme(themeName) {
    const theme = themes[themeName];

    if (!theme) return;

    document.documentElement.style.setProperty(
        "--accent",
        theme.accent
    );

    document.documentElement.style.setProperty(
        "--bg1",
        theme.bg1
    );

    document.documentElement.style.setProperty(
        "--bg2",
        theme.bg2
    );

    document.documentElement.style.setProperty(
        "--glass",
        theme.glass
    );

    localStorage.setItem(
        "selectedTheme",
        themeName
    );

    const selector = document.getElementById("themeSelect");

    if (selector) {
        selector.value = themeName;
    }
}

/* Apply a custom accent color */
function applyCustomColor(color) {
    document.documentElement.style.setProperty(
        "--accent",
        color
    );

    localStorage.setItem(
        "customAccent",
        color
    );

    const picker = document.getElementById("customColor");

    if (picker) {
        picker.value = color;
    }
}

/* Load saved theme */
function loadTheme() {
    const savedTheme =
        localStorage.getItem("selectedTheme");

    const savedColor =
        localStorage.getItem("customAccent");

    if (savedTheme && themes[savedTheme]) {
        applyTheme(savedTheme);
    } else {
        applyTheme("blue");
    }

    if (savedColor) {
        applyCustomColor(savedColor);
    }
}

/* Initialize controls */
document.addEventListener("DOMContentLoaded", () => {

    const themeSelect =
        document.getElementById("themeSelect");

    const colorPicker =
        document.getElementById("customColor");

    if (themeSelect) {
        themeSelect.addEventListener(
            "change",
            e => {
                applyTheme(e.target.value);
            }
        );
    }

    if (colorPicker) {
        colorPicker.addEventListener(
            "input",
            e => {
                applyCustomColor(e.target.value);
            }
        );
    }

    loadTheme();
});
