function checkCookieBanner() {
    const cookieBanner = document.getElementById("cookie-banner");

    // Prüfen, ob Cookies akzeptiert wurden
    if (localStorage.getItem("cookiesAccepted") === "true") {
        cookieBanner.style.display = "none";
    } else {
        cookieBanner.style.display = "flex";
    }
}

function acceptCookies() {
    const cookieBanner = document.getElementById("cookie-banner");

    // Zustimmung speichern
    localStorage.setItem("cookiesAccepted", "true");

    // Banner ausblenden
    cookieBanner.style.display = "none";
}
