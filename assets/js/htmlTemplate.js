/**
 * Creates an HTML template for a Pokémon card.
 * @param {object} pokemonData - The Pokémon data, including ID, sprites, and types.
 * @param {string} cardBackgroundColor - The background color of the card, based on the primary type.
 * @param {string} capitalizeName - The capitalized name of the Pokémon.
 * @param {string} typesString - An HTML string containing the Pokémon's types.
 * @returns {string} - An HTML string representing the Pokémon card.
 */
function cardTemplate(pokemonData, cardBackgroundColor, capitalizeName, typesString) {
    return /*html*/ `
    <div id="pokemon-card-${pokemonData.id}" class="pokemon-card" style="background-color: ${cardBackgroundColor}" 
        onclick='showPokemonDetails(${pokemonData.id - 1}, "${cardBackgroundColor}", "${capitalizeName}")'>
        <h2>#${pokemonData.id} <br> ${capitalizeName}</h2>
        <img id="pokemon-img" src="${pokemonData.sprites.front_default}" alt="">
        <div class="types">
            ${typesString}
        </div>
    </div>
    `;
}

/**
 * Creates an HTML template for the detailed view of a Pokémon.
 * @param {object} pokemonData - The Pokémon data, including ID, types, stats, moves, and evolutions.
 * @param {string} typesString - An HTML string containing the Pokémon's types.
 * @param {string} capitalizeName - The capitalized name of the Pokémon.
 * @param {string} background - The background color of the card, based on the primary type.
 * @param {number[]} percentages - An array of percentage values for base stats progress bars.
 * @param {boolean} isFirst - Indicates whether this is the first Pokémon (for arrow navigation logic).
 * @returns {string} - An HTML string representing the detailed Pokémon card.
 */
function bigCardTemplate(pokemonData, typesString, capitalizeName, background, percentages, isFirst) {
    return /*html*/ `
    <div id="card-container-border" onclick="event.stopPropagation()">
        <div id="card-container" style="background-color: ${background}" >
            <div id="card-container-name-id">
                <p>#${pokemonData.id}</p>
                <p>${capitalizeName}</p>
            </div>
            <div id="card-container-types">
                ${typesString}
            </div>
            <div id="card-container-img-container">
                <img src="${pokemonData["sprites"]["other"]["official-artwork"]["front_default"]}" id="card-container-img" alt="">
            </div>
            <div id="big-pokemon-card">
                <div id="big-pokemon-card-sections">
                    <p onclick="showSection('about')">About</p>
                    <p onclick="showSection('stats')">Base Stats</p>
                    <p onclick="showSection('evolution')">Evolution</p>
                </div>
                <div id="about" class="">
                    <table>
                        <tr>
                            <td>ID:</td>
                            <td>${pokemonData.id}</td>
                        </tr>
                        <tr>
                            <td>Name:</td>
                            <td>${capitalizeName}</td>
                        </tr>
                        <tr>
                            <td>Height:</td>
                            <td>${pokemonData.height}cm</td>
                        </tr>
                        <tr>
                            <td>Weight:</td>
                            <td>${pokemonData.weight}kg</td>
                        </tr>
                        <tr>
                            <td>1.Skill:</td>
                            <td>${pokemonData.moves[0].move.name}</td>
                        </tr>
                        <tr>
                            <td>2.Skill:</td>
                            <td>${pokemonData.moves[1].move.name}</td>
                        </tr>
                        <tr>
                            <td>3.Skill:</td>
                            <td>${pokemonData.moves[2].move.name}</td>
                        </tr>
                        <tr>
                            <td>4.Skill:</td>
                            <td>${pokemonData.moves[3].move.name}</td>
                        </tr>
                    </table>
                </div>
                <div id="stats" class="d-none">
                    <table>
                        <tr>
                            <td>${(pokemonData.stats[0].stat.name).toUpperCase()}</td>
                            <td>
                                <div class="progress-bar-container">
                                    <div class="progress-bar" style="width: ${percentages[0]}%;">
                                        <span>${pokemonData.stats[0].base_stat}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>${(pokemonData.stats[1].stat.name).toUpperCase()}</td>
                            <td>
                                <div class="progress-bar-container">
                                    <div class="progress-bar" style="width: ${percentages[1]}%;">
                                        <span>${pokemonData.stats[1].base_stat}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>${(pokemonData.stats[2].stat.name).toUpperCase()}</td>
                            <td>
                                <div class="progress-bar-container">
                                    <div class="progress-bar" style="width: ${percentages[2]}%;">
                                        <span>${pokemonData.stats[2].base_stat}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>${(pokemonData.stats[3].stat.name).toUpperCase()}</td>
                            <td>
                                <div class="progress-bar-container">
                                    <div class="progress-bar" style="width: ${percentages[3]}%;">
                                        <span>${pokemonData.stats[3].base_stat}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>${(pokemonData.stats[4].stat.name).toUpperCase()}</td>
                            <td>
                                <div class="progress-bar-container">
                                    <div class="progress-bar" style="width: ${percentages[4]}%;">
                                        <span>${pokemonData.stats[4].base_stat}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>${(pokemonData.stats[5].stat.name).toUpperCase()}</td>
                            <td>
                                <div class="progress-bar-container">
                                    <div class="progress-bar" style="width: ${percentages[5]}%;">
                                        <span>${pokemonData.stats[5].base_stat}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
                <div id="evolution" class="d-none">
                    <table>
                        ${pokemonData["evolution"]?.["firstEvo"] ? `<tr>
                                <td>${pokemonData["evolution"]["firstEvo"]}</td>
                                <td>
                                    <img src="${pokemonData["evolution"]["firstEvoImg"] || ''}" alt="${pokemonData["evolution"]["firstEvo"]}" width="50">
                                </td>
                            </tr>` : ''}
                        ${pokemonData["evolution"]?.["secondEvo"] ? `<tr>
                                <td>${pokemonData["evolution"]["secondEvo"]}</td>
                                <td>
                                    <img src="${pokemonData["evolution"]["secondEvoImg"] || ''}" alt="${pokemonData["evolution"]["secondEvo"]}" width="50">
                                </td>
                            </tr>`  : ''}
                        ${pokemonData["evolution"]?.["thirdEvo"] ? `<tr>
                                <td>${pokemonData["evolution"]["thirdEvo"]}</td>
                                <td>
                                    <img src="${pokemonData["evolution"]["thirdEvoImg"] || ''}" alt="${pokemonData["evolution"]["thirdEvo"]}" width="50">
                                </td>
                            </tr>` : ''}
                    </table>
                </div>
            </div>            
        </div>   
        <div id="card-container-border-arrow-container">
            <img src="assets/img/Arraow.png" 
            onclick="showPokemonDetails(${pokemonData.id - 2})"
            class=${isFirst ? 'd-none' : ''}> 
            <img src="assets/img/Arraow.png" onclick="showPokemonDetails(${pokemonData.id})"> 
        </div> 
    </div>
`;
}

/**
 * Updates the evolution section with the loaded evolution data.
 * @param {object} pokemon - The Pokémon object containing evolution data.
 */
function updateEvolutionSection(pokemon) {
    const evolutionSection = document.getElementById('evolution');
    if (evolutionSection) {
        evolutionSection.innerHTML = /*html*/ `
            <table>
                ${pokemon.evolution?.firstEvo ? `<tr>
                    <td>${pokemon.evolution.firstEvo}</td>
                    <td>
                        <img src="${pokemon.evolution.firstEvoImg || ''}" alt="${pokemon.evolution.firstEvo}" width="50">
                    </td>
                </tr>` : ''}
                ${pokemon.evolution?.secondEvo ? `<tr>
                    <td>${pokemon.evolution.secondEvo}</td>
                    <td>
                        <img src="${pokemon.evolution.secondEvoImg || ''}" alt="${pokemon.evolution.secondEvo}" width="50">
                    </td>
                </tr>` : ''}
                ${pokemon.evolution?.thirdEvo ? `<tr>
                    <td>${pokemon.evolution.thirdEvo}</td>
                    <td>
                        <img src="${pokemon.evolution.thirdEvoImg || ''}" alt="${pokemon.evolution.thirdEvo}" width="50">
                    </td>
                </tr>` : ''}
            </table>
        `;
    }
}