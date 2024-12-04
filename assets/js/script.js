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
async function fetchPokemon(pokemonLimit, startId = 1) {
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

function loadPokemonIntoCard(pokemonData) {
    const cardBackgroundColor = typeInfo[pokemonData.types[0].type.name]?.[0] || "none";
    const capitalizeName = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
    const typesString = getTypeOfPokemon(pokemonData.types);
    pokemonCardContainer.innerHTML += cardTemplate(pokemonData, cardBackgroundColor, capitalizeName, typesString);
}

function getTypeOfPokemon(pokemonTypeContainer){
    const typesString = pokemonTypeContainer
        .map(typeObj => `
            <div class="type" style="background-color: ${typeInfo[typeObj.type.name][0] || "none"}">
                <img src="${typeInfo[typeObj.type.name][1]}" alt="${typeObj.type.name} icon" class="type-icon">
                <p>${typeObj.type.name}</p>
            </div>`)
        .join(" ");
        
    return typesString
}

function loadMore() {
    showLoadingAnimation();
    let startId = pokemonLimit + 1;
    pokemonLimit += 20;
    fetchPokemon(pokemonLimit, startId);
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
        pokemonCardContainer.innerHTML = "<p>Keine Treffer gefunden.</p>";
    }
    loadMoreBtn.style.display = searchTerm.length > 0 ? "none" : "block";
}

function showPokemonDetail(id){
    const overlay = document.getElementById('overlay');
    const bigPokemonCardContainer = document.querySelector(".big-pokemon-card");
    const clickedPokemon = pokemonDataArray[id];
    const typeStrings = getTypeOfPokemon(clickedPokemon.types);
    showPokemonCardOverlay();
}

function showPokemonCardOverlay(){
    const overlay = document.getElementById('overlay');
    const bigPokemonCardContainer = document.querySelector(".big-pokemon-card");
    overlay.classList.remove("d-none");
    overlay.style.display = 'block';
}

function hidePokemonCardOverlay() {
    const overlay = document.getElementById('overlay');
    const bigPokemonCardContainer = document.querySelector(".big-pokemon-card");

    overlay.style.display = "none"
    document.body.style.overflow = '';

    bigPokemonCardContainer.innerHTML = '';
    console.clear();
}


// TODO RAUS LÖSCHEN WENN FERTIG 
// async function showPokemonDetails(id, backgroundColor, capitalizeName) {
//     const overlay = document.getElementById('overlay');
//     const bigPokemonCardContainer = document.querySelector(".big-pokemon-card");
//     const clickedPokemon = pokemonDataArray[id];
//     const typesString = clickedPokemon.types
//         .map(typeObj => `<div class="type" style="background-color: ${typeColors[typeObj.type.name] || "none"}">
//                             ${typeObj.type.name}
//                          </div>`)
//         .join(" ");

//     console.log(pokemonDataArray[id]);

//     bigPokemonCardContainer.style.backgroundColor = backgroundColor;
//     bigPokemonCardContainer.innerHTML += /*html*/`
//     <div id="big-pokemon-card-sections">
//     <div id="name-hp-section" class="big-pokemon-card-section">
//             <p>${capitalizeName}</p>
//             <p>HP: ${clickedPokemon["stats"][0]["base_stat"]}</p>
//         </div>
//         <div id="img-info-section">
//             <div id="img-section">
//                 <img src="${clickedPokemon["sprites"]["front_default"]}" alt="">
//                 <img src="${clickedPokemon["sprites"]["back_default"]}" alt="">
//             </div>   
//             <div id="info-section">
//             <p>${clickedPokemon["height"]}m</p>
//             <p>${clickedPokemon["weight"]}kg</p>
//             <p>${(Math.random() < 0.5 ? "Male ♂" : "Female ♀")}</p>
//             </div>         
            
//         </div >
//         <div id="skill-section" class="big-pokemon-card-section">
//             <p></p>
//         </div>      
//         <div class="types">        
//             ${typesString}
//         </div>
//         <div id="abilities-section">    
//             <p>1.${clickedPokemon["moves"][0]["move"]["name"]}</p>
//             <p>2.${clickedPokemon["moves"][1]["move"]["name"]}</p>            
//             <p>3.${clickedPokemon["moves"][2]["move"]["name"]}</p>
//             <p>4.${clickedPokemon["moves"][3]["move"]["name"]}</p>            
//         </div>
//         <div id="evolution">
            
//         </div>
//     </div >

//         `;
//     overlay.style.display = 'flex';
//     document.body.style.overflow = 'hidden';

//     const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${clickedPokemon.id}`);
//     const speciesData = await speciesResponse.json();
//     const evolutionUrl = speciesData.evolution_chain.url;

//     const evolutionResponse = await fetch(evolutionUrl);
//     const evolutionData = await evolutionResponse.json();
//     const evolutionChain = getEvolutionChain(evolutionData.chain);

//     // Render Evolution Chain
//     const evolutionContainer = document.getElementById("evolution");
//     evolutionContainer.innerHTML = evolutionChain
//         .map(name => `<p>${name}</p>`)
//         .join("");
// }

// function getEvolutionChain(chain) {
//     let evolutions = [];
//     let current = chain;

//     while (current) {
//         evolutions.push(current.species.name); // Pokémon-Name hinzufügen
//         current = current.evolves_to[0]; // Nächste Evolution
//     }

//     return evolutions;
// }