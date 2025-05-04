/* Properties of the dark theme. */
const DARK_THEME = {
    "fp-primary-background-color": "#010409",
    "fp-primary-text-color": "#c9d1d9",
    "fp-heading-text-color": "#c9d1d9",
    "fp-main-box-background-color": "#0d1117",
    "fp-main-box-border-color": "#30363d",
    "fp-input-field-base-text-color": "#ffffff",
    "fp-input-field-base-background-color": "#010409",
    "fp-input-field-base-label-text-color": "#c9d1d9",
    "fp-input-field-base-border-color": "#30363d",
    "fp-header-background-color": "#161b22",
    "fp-divider-color": "#30363d",
    "fp-negative-message-background-color": "#bb1a1d36",
    "fp-negative-message-header-color": "#c9d1d9",
    "fp-negative-message-border-color": "#7c1212",
    "fp-positive-message-background-color": "#0080001f",
    "fp-positive-message-header-color": "#c9d1d9",
    "fp-positive-message-border-color": "#067406",
    "fp-info-message-background-color": "#4141ff1f",
    "fp-info-message-header-color": "#c9d1d9",
    "fp-info-message-border-color": "#1010b9",
    "fp-warning-message-background-color": "#834e0442",
    "fp-warning-message-header-color": "#c9d1d9",
    "fp-warning-message-border-color": "#b56c07"
}

/* Properties of the light theme. */
const LIGHT_THEME = {
    "fp-primary-background-color": "#ffffff",
    "fp-primary-text-color": "rgba(0,0,0,.87)",
    "fp-heading-text-color": "rgba(0,0,0,.87)",
    "fp-main-box-background-color": "#ffffff",
    "fp-main-box-border-color": "rgba(34,36,38,.15)",
    "fp-input-field-base-text-color": "rgba(0,0,0,.87)",
    "fp-input-field-base-background-color": "#ffffff",
    "fp-input-field-base-label-text-color": "rgba(0,0,0,.87)",
    "fp-input-field-base-border-color": "rgba(34,36,38,.15)",
    "fp-header-background-color": "#f2f2f2",
    "fp-divider-color": "rgba(34,36,38,.15)",
    "fp-negative-message-background-color": "#FFF6F6",
    "fp-negative-message-header-color": "#912D2B",
    "fp-negative-message-border-color": "transparent",
    "fp-positive-message-background-color": "#FCFFF5",
    "fp-positive-message-header-color": "#1A531B",
    "fp-positive-message-border-color": "transparent",
    "fp-info-message-background-color": "#F8FFFF",
    "fp-info-message-header-color": "#0E566C",
    "fp-info-message-border-color": "transparent",
    "fp-warning-message-background-color": "#FFFAF3",
    "fp-warning-message-header-color": "#573A08",
    "fp-warning-message-border-color": "transparent"
}

/* Get the theme checkbox element. */
const themChangeCheckbox = document.getElementById("fp-checkbox");

/* Check the previously stored theme and activate. */
const storedTheme = localStorage.getItem("food_paradise_theme");

if (storedTheme === "LIGHT") {
    themChangeCheckbox.checked = true;
    setTheme(LIGHT_THEME);
} else if (storedTheme === "DARK") {
    themChangeCheckbox.checked = false;
    setTheme(DARK_THEME);
} else {
    themChangeCheckbox.checked = true;
    setTheme(LIGHT_THEME);
}

/* Create event listner for checkbox element. */
themChangeCheckbox.addEventListener("change", function(e) {
    const checked = e.target.checked;

    if (checked) {
        localStorage.setItem("food_paradise_theme", "LIGHT");
        setTheme(LIGHT_THEME);
    } else {
        localStorage.setItem("food_paradise_theme", "DARK");
        setTheme(DARK_THEME);
    }
});

/* Function for set the properties of theme object into styles. */
function setTheme(themValueObj) {
    for (const key in themValueObj) {
        document.documentElement.style.setProperty(`--${key}`, themValueObj[key]);
    }
}
