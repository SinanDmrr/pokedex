function checkCookieBanner() {
    const cookieBanner = document.getElementById("cookie-banner");

    if (localStorage.getItem("cookiesAccepted") === "true") {
        cookieBanner.style.display = "none";
    } else {
        cookieBanner.style.display = "flex";
    }
}

function acceptCookies() {
    const cookieBanner = document.getElementById("cookie-banner");
    localStorage.setItem("cookiesAccepted", "true");
    cookieBanner.style.display = "none";
}
