const loadingPokeball = document.getElementById("loadingPokeball");
const pokemonCardContainer = document.getElementById("pokemon-card-container")

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

function init() {
    fetchPokemon(pokemonLimit);
}

async function fetchPokemon(pokemonLimit) {
    for (let i = 1; i <= pokemonLimit; i++) {
        try {
            const response = await fetch(pokeApiNameOrNum + i);
            if (!response.ok) {
                throw new Error('Network response was not okay');
            }
            const pokemonData = await response.json();
            pokemonDataArray.push(pokemonData)
        } catch (error) {
            console.error('Error retrieving Pokémon:', error);
        }
    }
    for (const pokemonData of pokemonDataArray) {
        loadPokemonIntoCard(pokemonData);
    }
    loadingPokeball.classList.add("d-none");
    //TODO showPokemonInConsole am ende raus löschen ist nur während der DevTime wichtig
    showPokemonInConsole(pokemonDataArray[0]);
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
