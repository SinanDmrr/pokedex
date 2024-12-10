// Global Variables
const loadingPokeball = document.getElementById("loadingPokeball");
const loadingOverlay = document.getElementById("loading-overlay");
const pokemonCardContainer = document.getElementById("pokemon-card-container")
const loadMoreBtn = document.getElementById("load-more-btn");
const searchInput = document.getElementById("search-input");
const pokeApiNameOrNum = "https://pokeapi.co/api/v2/pokemon/"
const typeInfo = {
    fire: ["#ab5b5b", "assets/img/fire.svg"],
    grass: ["#73ab5b", "assets/img/grass.svg"],
    water: ["#5c5bab", "assets/img/water.svg"],
    electric: ["#abaa5b", "assets/img/electric.svg"],
    psychic: ["#a55bab", "assets/img/psychic.svg"],
    ice: ["#5b8cab", "assets/img/ice.svg"],
    dragon: ["orange", "assets/img/dragon.svg"],
    ground: ["#8B6218", "assets/img/ground.svg"],
    fairy: ["#ab5ba0", "assets/img/fairy.svg"],
    fighting: ["#A99A40", "assets/img/fighting.svg"],
    flying: ["#adc4c7", "assets/img/flying.svg"],
    poison: ["#6d3c82", "assets/img/poison.svg"],
    rock: ["#6d3c82", "assets/img/rock.svg"],
    ghost: ["#8789ab", "assets/img/ghost.svg"],
    steel: ["#969696", "assets/img/steel.svg"],
    normal: ["#b5af9e", "assets/img/normal.svg"],
    bug: ["green", "assets/img/bug.svg"]
};
let pokemonDataArray = [];
let pokemonLimit = 20;

// Eventlistener
searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
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

async function fetchPokemon(pokemonLimit, startId = 1) {
    for (let i = startId; i <= pokemonLimit; i++) {
        if (pokemonDataArray.some(pokemon => pokemon.id === i)) continue;

        try {
            const pokemonData = await fetchPokemonData(i);
            const speciesData = await fetchSpeciesData(pokemonData);
            pokemonData.evolutionChainUrl = speciesData.evolution_chain.url;
            pokemonDataArray.push(pokemonData);
        } catch (error) {
            console.error('Error retrieving Pokémon:', error);
        }
    }

    renderAllPokemonCards();
    hideLoadingAnimation();
    loadMoreBtn.classList.remove("d-none");
}

async function fetchPokemonData(pokemonId) {
    const response = await fetch(`${pokeApiNameOrNum}${pokemonId}`);
    if (!response.ok) throw new Error('Failed to fetch Pokémon data');
    return await response.json();
}

async function fetchSpeciesData(pokemonData) {
    const response = await fetch(pokemonData.species.url);
    if (!response.ok) throw new Error('Failed to fetch species data');
    return await response.json();
}

async function fetchEvolutionData(speciesData) {
    const response = await fetch(speciesData.evolution_chain.url);
    if (!response.ok) throw new Error('Failed to fetch evolution chain');
    return await response.json();
}

async function parseEvolutionData(evolutionData) {
    const firstEvo = evolutionData.chain?.species?.name || null;
    const secondEvo = evolutionData.chain?.evolves_to?.[0]?.species?.name || null;
    const thirdEvo = evolutionData.chain?.evolves_to?.[0]?.evolves_to?.[0]?.species?.name || null;

    return {
        firstEvo: capitalizeFirstLetter(firstEvo),
        firstEvoImg: firstEvo ? await getPokemonImageUrl(firstEvo) : null,
        secondEvo: capitalizeFirstLetter(secondEvo),
        secondEvoImg: secondEvo ? await getPokemonImageUrl(secondEvo) : null,
        thirdEvo: capitalizeFirstLetter(thirdEvo),
        thirdEvoImg: thirdEvo ? await getPokemonImageUrl(thirdEvo) : null,
    };
}

async function loadEvolutionChain(pokemon) {
    if (!pokemon.evolutionChainUrl || pokemon.evolution) return;

    try {
        const response = await fetch(pokemon.evolutionChainUrl);
        if (!response.ok) throw new Error('Failed to fetch evolution chain');

        const evolutionData = await response.json();
        pokemon.evolution = await parseEvolutionData(evolutionData);
    } catch (error) {
        console.error('Error fetching evolution chain:', error);
    }
}

function renderAllPokemonCards() {
    pokemonCardContainer.innerHTML = "";
    for (const pokemonData of pokemonDataArray) {
        loadPokemonIntoCard(pokemonData);
    }
}

async function getPokemonImageUrl(pokemonName) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch data for ${pokemonName}`);
    }
    const data = await response.json();
    return data.sprites.front_default;
}

function loadPokemonIntoCard(pokemonData) {
    const cardBackgroundColor = typeInfo[pokemonData.types[0].type.name]?.[0] || "none";
    const capitalizeName = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
    const typesString = getTypeOfPokemon(pokemonData.types);
    pokemonCardContainer.innerHTML += cardTemplate(pokemonData, cardBackgroundColor, capitalizeName, typesString);
}

function capitalizeFirstLetter(name) {
    if (!name) return null;
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function getTypeOfPokemon(pokemonTypeContainer) {
    const typesString = pokemonTypeContainer
        .map(typeObj => `
            <div class="type" style="background-color: ${typeInfo[typeObj.type.name][0] || "none"}">
                <img src="${typeInfo[typeObj.type.name][1]}" alt="${typeObj.type.name} icon" class="type-icon">
                <p>${typeObj.type.name}</p>
            </div>`)
        .join(" ");

    return typesString
}

async function loadMore() {
    showLoadingAnimation();
    let startId = pokemonLimit + 1;
    pokemonLimit += 20;
    try {
        await fetchPokemon(pokemonLimit, startId);
    } catch (error) {
        console.error(error);
        hideLoadingAnimation();
    }
}

function filterPokemonCards(searchTerm) {
    const filteredPokemon = pokemonDataArray.filter(pokemonData => {
        const nameMatches = pokemonData.name.toLowerCase().startsWith(searchTerm);
        const idMatches = pokemonData.id.toString().startsWith(searchTerm);
        const typeMatches = pokemonData.types.some(typeObj =>
            typeObj.type.name.toLowerCase().startsWith(searchTerm)
        );
        return nameMatches || idMatches || typeMatches;
    });
    pokemonCardContainer.innerHTML = "";
    filteredPokemon.forEach(pokemonData => loadPokemonIntoCard(pokemonData));

    if (filteredPokemon.length === 0) {
        pokemonCardContainer.innerHTML = "<p>No hits found.</p>";
    }
    loadMoreBtn.style.display = searchTerm.length > 0 ? "none" : "block";
}

async function showPokemonDetails(id) {
    if (id < 0) {
        return
    } else if (id >= pokemonDataArray.length) {
        await loadMore();
    }
    const overlay = document.getElementById('overlay');
    const clickedPokemon = pokemonDataArray[id];
    let isFirst = id === 0;
    const background = typeInfo[clickedPokemon.types[0].type.name]?.[0] || "none";
    const capitalizeName = clickedPokemon.name.charAt(0).toUpperCase() + clickedPokemon.name.slice(1);
    const typesString = getTypeOfPokemon(clickedPokemon.types);
    let percentageProgress = progressBarMaxValue(clickedPokemon)
    await loadEvolutionChain(clickedPokemon);
    showPokemonCardOverlay();
    overlay.innerHTML = bigCardTemplate(clickedPokemon, typesString, capitalizeName, background, percentageProgress, isFirst);
}

function progressBarMaxValue(pokemonData) {
    let percentages = [];
    const stats = pokemonData.stats;
    const maxStat = Math.max(...stats.map(stat => stat.base_stat));
    stats.forEach(stat => {
        const statName = stat.stat.name.toUpperCase();
        const baseStat = stat.base_stat;
        const percentage = (baseStat / maxStat) * 100;
        percentages.push(percentage);
    })
    return percentages;
}

function showPokemonCardOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.classList.remove("d-none");
    overlay.style.display = "flex";
}

function hidePokemonCardOverlay() {
    const overlay = document.getElementById('overlay');
    const bigPokemonCardContainer = document.querySelector(".big-pokemon-card");

    overlay.style.display = "none"
    document.body.style.overflow = '';
}

function showSection(sectionToShow) {
    const aboutSection = document.getElementById("about");
    const statsSection = document.getElementById("stats");
    const evolutionSection = document.getElementById("evolution");

    aboutSection.classList.add("d-none");
    statsSection.classList.add("d-none");
    evolutionSection.classList.add("d-none");

    if (sectionToShow == "about") {
        aboutSection.classList.remove("d-none");
    } else if (sectionToShow == "stats") {
        statsSection.classList.remove("d-none");
    } else if (sectionToShow == "evolution") {
        evolutionSection.classList.remove("d-none");
    }
}