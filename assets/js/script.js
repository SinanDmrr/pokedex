// Global Variables
const loadingPokeball = document.getElementById("loadingPokeball");
const loadingOverlay = document.getElementById("loading-overlay");
const pokemonCardContainer = document.getElementById("pokemon-card-container")
const loadMoreBtn = document.getElementById("load-more-btn");
const searchInput = document.getElementById("search-input");
const pokeApiNameOrNum = "https://pokeapi.co/api/v2/pokemon/"
const typeColors = {
    fire: "#ab5b5b",
    grass: "#73ab5b",
    water: "#5c5bab",
    electric: "#abaa5b",
    psychic: "#a55bab",
    ice: "#5b8cab",
    dragon: "orange",
    ground: "#8B6218",
    fairy: "#ab5ba0",
    fighting: "#A99A40",
    flying: "#adc4c7",
    poison: "#6d3c82",
    rock: "#6d3c82",
    ghost: "#8789ab",
    steel: "#969696",
    normal: "#b5af9e",
    bug: "green"
};
let pokemonDataArray = [];
let pokemonLimit = 20;

// Eventlistener
searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    console.log(searchTerm);
    filterPokemonCards(searchTerm);
});

document.addEventListener("click", (event) => {
    const searchInput = document.getElementById("search-input");

    if (event.target !== searchInput && !pokemonCardContainer.contains(event.target)) {
        searchInput.value = "";
        filterPokemonCards("");
    }
});

// Functions
function init() {
    checkCookieBanner();
    fetchPokemon(pokemonLimit);
}

function showLoadingAnimation() {
    const loadingOverlay = document.getElementById("loading-overlay");
    loadingOverlay.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function hideLoadingAnimation() {
    const loadingOverlay = document.getElementById("loading-overlay");
    loadingOverlay.style.display = "none";
    document.body.style.overflow = "";
}
async function fetchPokemon(pokemonLimit, startId = 0) {
    for (let i = startId; i <= pokemonLimit; i++) {
        if (pokemonDataArray.some(pokemon => pokemon.id === i)) {
            continue;
        }
        try {
            const response = await fetch(pokeApiNameOrNum + i);
            if (!response.ok) {
                throw new Error('Network response was not okay');
            }
            const pokemonData = await response.json();
            pokemonDataArray.push(pokemonData);
        } catch (error) {
            console.error('Error retrieving Pokémon:', error);
        }
    }
    pokemonCardContainer.innerHTML = "";
    for (const pokemonData of pokemonDataArray) {
        loadPokemonIntoCard(pokemonData);
    }
    hideLoadingAnimation();
    loadMoreBtn.classList.remove("d-none");
}

function showPokemonInConsole(pokemonData) {
    console.log(pokemonData);
}

function loadPokemonIntoCard(pokemonData) {
    const cardBackgroundColor = typeColors[pokemonData.types[0].type.name] || "none";
    const capitalizeName = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
    const typesString = pokemonData.types.map((typeObj, i) => {
        let typeBackgroundColor = typeColors[typeObj.type.name] || "none";

        return /*html*/`
            <div class="type" style="background-color: ${typeBackgroundColor}">
                ${typeObj.type.name}
            </div>
        `
    }).join(" ");

    pokemonCardContainer.innerHTML += cardTemplate(pokemonData, cardBackgroundColor, capitalizeName, typesString);
}

function loadMore() {
    showLoadingAnimation();
    let startId = pokemonLimit + 1;
    pokemonLimit += 20;
    // pokemonDataArray = [];
    fetchPokemon(pokemonLimit, startId);
}

function filterPokemonCards(searchTerm) {
    // Filtere Pokémon basierend auf Name oder ID
    const filteredPokemon = pokemonDataArray.filter(pokemonData => {
        const nameMatches = pokemonData.name.toLowerCase().startsWith(searchTerm);
        const idMatches = pokemonData.id.toString().startsWith(searchTerm);
        const typeMatches = pokemonData.types.some(typeObj =>
            typeObj.type.name.toLowerCase().startsWith(searchTerm)
        );
        return nameMatches || idMatches || typeMatches;
    });

    // Zeige gefilterte Pokémon an
    pokemonCardContainer.innerHTML = "";
    filteredPokemon.forEach(pokemonData => loadPokemonIntoCard(pokemonData));

    // Keine Treffer gefunden
    if (filteredPokemon.length === 0) {
        pokemonCardContainer.innerHTML = "<p>Keine Treffer gefunden.</p>";
    }

    // Button verstecken, wenn Suchmodus aktiv oder keine Treffer
    loadMoreBtn.style.display = searchTerm.length > 0 ? "none" : "block";
}