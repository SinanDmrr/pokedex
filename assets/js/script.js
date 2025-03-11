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

/**
 * Event listener for the search input. Filters Pokémon cards based on the entered search term.
 */
searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    filterPokemonCards(searchTerm);
});

/**
 * Event listener for clicks outside the search input or card container.
 * Resets the search and displays all Pokémon cards.
 */
document.addEventListener("click", (event) => {
    const searchInput = document.getElementById("search-input");

    if (event.target !== searchInput && !pokemonCardContainer.contains(event.target)) {
        searchInput.value = "";
        filterPokemonCards("");
    }
});

/**
 * Initializes the page by checking the cookie banner and loading the initial Pokémon data.
 */
function init() {
    checkCookieBanner();
    fetchPokemon(pokemonLimit);
}

/**
 * Displays a loading animation and prevents page scrolling.
 */
function showLoadingAnimation() {
    const loadingOverlay = document.getElementById("loading-overlay");
    loadingOverlay.style.display = "flex";
    document.body.style.overflow = "hidden";
}

/**
 * Hides the loading animation and restores page scrolling.
 */
function hideLoadingAnimation() {
    const loadingOverlay = document.getElementById("loading-overlay");
    loadingOverlay.style.display = "none";
    document.body.style.overflow = "";
}

/**
 * Fetches a specified number of Pokémon data from the PokeAPI and renders them as cards.
 * @param {number} pokemonLimit - The maximum number of Pokémon to load.
 * @param {number} [startId=1] - The ID to start loading from (optional, default: 1).
 * @returns {Promise<void>}
 */
async function fetchPokemon(pokemonLimit, startId = 1) {
    showLoadingAnimation();
    const fetchPromises = [];

    for (let i = startId; i <= pokemonLimit; i++) {
        if (pokemonDataArray.some(pokemon => pokemon.id === i)) continue;
        fetchPromises.push(fetchPokemonData(i).then(pokemonData =>
            fetchSpeciesData(pokemonData).then(speciesData => {
                pokemonData.evolutionChainUrl = speciesData.evolution_chain.url;
                return pokemonData;
            })
        ));
    }

    try {
        const newPokemonData = await Promise.all(fetchPromises);
        pokemonDataArray = [...pokemonDataArray, ...newPokemonData];
        renderAllPokemonCards();
    } catch (error) {
        console.error('Error retrieving Pokémon:', error);
    }

    hideLoadingAnimation();
    loadMoreBtn.classList.remove("d-none");
}

/**
 * Fetches the data of a single Pokémon from the PokeAPI.
 * @param {number} pokemonId - The ID of the Pokémon whose data is to be fetched.
 * @returns {Promise<object>} - The Pokémon data as a JSON object.
 * @throws {Error} - If the API request fails.
 */
async function fetchPokemonData(pokemonId) {
    const response = await fetch(`${pokeApiNameOrNum}${pokemonId}`);
    if (!response.ok) throw new Error('Failed to fetch Pokémon data');
    return await response.json();
}

/**
 * Fetches the species data of a Pokémon from the PokeAPI.
 * @param {object} pokemonData - The Pokémon data containing the species URL.
 * @returns {Promise<object>} - The species data as a JSON object.
 * @throws {Error} - If the API request fails.
 */
async function fetchSpeciesData(pokemonData) {
    const response = await fetch(pokemonData.species.url);
    if (!response.ok) throw new Error('Failed to fetch species data');
    return await response.json();
}

/**
 * Fetches the evolution data of a Pokémon from the PokeAPI.
 * @param {object} speciesData - The species data containing the evolution chain URL.
 * @returns {Promise<object>} - The evolution data as a JSON object.
 * @throws {Error} - If the API request fails.
 */
async function fetchEvolutionData(speciesData) {
    const response = await fetch(speciesData.evolution_chain.url);
    if (!response.ok) throw new Error('Failed to fetch evolution chain');
    return await response.json();
}

/**
 * Parses evolution data and extracts the names and images of the evolutions.
 * @param {object} evolutionData - The raw evolution chain data from the PokeAPI.
 * @returns {Promise<object>} - An object containing the names and image URLs of the evolutions.
 */
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

/**
 * Loads the evolution data of a Pokémon and adds it to the Pokémon object.
 * @param {object} pokemon - The Pokémon object whose evolution is to be loaded.
 * @returns {Promise<void>}
 */
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

/**
 * Renders all Pokémon cards in the container.
 */
function renderAllPokemonCards() {
    pokemonCardContainer.innerHTML = "";
    for (const pokemonData of pokemonDataArray) {
        loadPokemonIntoCard(pokemonData);
    }
}

/**
 * Fetches the image URL of a Pokémon from the PokeAPI.
 * @param {string} pokemonName - The name of the Pokémon.
 * @returns {Promise<string>} - The URL of the Pokémon image (front_default sprite).
 * @throws {Error} - If the API request fails.
 */
async function getPokemonImageUrl(pokemonName) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch data for ${pokemonName}`);
    }
    const data = await response.json();
    return data.sprites.front_default;
}

/**
 * Loads a Pokémon's data into a card and adds it to the container.
 * @param {object} pokemonData - The Pokémon data.
 */
function loadPokemonIntoCard(pokemonData) {
    const cardBackgroundColor = typeInfo[pokemonData.types[0].type.name]?.[0] || "none";
    const capitalizeName = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
    const typesString = getTypeOfPokemon(pokemonData.types);
    pokemonCardContainer.innerHTML += cardTemplate(pokemonData, cardBackgroundColor, capitalizeName, typesString);
}

/**
 * Capitalizes the first letter of a string.
 * @param {string|null} name - The string to capitalize or null.
 * @returns {string|null} - The capitalized string or null if the input is null.
 */
function capitalizeFirstLetter(name) {
    if (!name) return null;
    return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Generates an HTML string for a Pokémon's types.
 * @param {Array<object>} pokemonTypeContainer - An array of type objects for the Pokémon.
 * @returns {string} - The HTML string with type icons and names.
 */
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

/**
 * Loads additional Pokémon data and adds it to the container.
 * @returns {Promise<void>}
 */
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

/**
 * Filters Pokémon cards based on a search term and renders the results.
 * @param {string} searchTerm - The search term (name, ID, or type).
 */
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

/**
 * Displays the detailed view of a Pokémon and loads evolution data in the background.
 * @param {number} id - The ID of the Pokémon to display.
 * @returns {Promise<void>}
 */
async function showPokemonDetails(id) {
    if (id < 0) {
        return;
    } else if (id >= pokemonDataArray.length) {
        await loadMore();
    }

    const overlay = document.getElementById('overlay');
    const clickedPokemon = pokemonDataArray[id];
    let isFirst = id === 0;
    const background = typeInfo[clickedPokemon.types[0].type.name]?.[0] || "none";
    const capitalizeName = clickedPokemon.name.charAt(0).toUpperCase() + clickedPokemon.name.slice(1);
    const typesString = getTypeOfPokemon(clickedPokemon.types);
    let percentageProgress = progressBarMaxValue(clickedPokemon);

    showPokemonCardOverlay();
    overlay.innerHTML = bigCardTemplate(clickedPokemon, typesString, capitalizeName, background, percentageProgress, isFirst);


    if (!clickedPokemon.evolution) {
        loadEvolutionChain(clickedPokemon).then(() => {
            updateEvolutionSection(clickedPokemon);
        }).catch(error => {
            console.error('Fehler beim Laden der Evolution:', error);
            updateEvolutionSectionWithError();
        });
    }
}

/**
 * Displays an error message in the evolution section if loading fails.
 */
function updateEvolutionSectionWithError() {
    const evolutionSection = document.getElementById('evolution');
    if (evolutionSection) {
        evolutionSection.innerHTML = `<p>Fehler beim Laden der Evolutionsdaten.</p>`;
    }
}

/**
 * Calculates the percentage values of a Pokémon's base stats for progress bars.
 * @param {object} pokemonData - The Pokémon data.
 * @returns {number[]} - An array of percentage values for each stat.
 */
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

/**
 * Shows the overlay for the Pokémon detail view.
 */
function showPokemonCardOverlay() {
    const overlay = document.getElementById('overlay');
    overlay.classList.remove("d-none");
    overlay.style.display = "flex";
}

/**
 * Hides the overlay for the Pokémon detail view.
 */
function hidePokemonCardOverlay() {
    const overlay = document.getElementById('overlay');
    const bigPokemonCardContainer = document.querySelector(".big-pokemon-card");

    overlay.style.display = "none"
    document.body.style.overflow = '';
}

/**
 * Switches between sections (About, Stats, Evolution) in the detail view.
 * @param {string} sectionToShow - The name of the section to display ('about', 'stats', 'evolution').
 */
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