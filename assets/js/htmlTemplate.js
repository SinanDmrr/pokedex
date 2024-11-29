function cardTemplate(pokemonData, cardBackgroundColor, capitalizeName, typesString) {
    return /*html*/ `
    <div id="pokemon-card-${pokemonData.id}" class="pokemon-card" style="background-color: ${cardBackgroundColor}";>
        <h2>#${pokemonData.id} <br> ${capitalizeName}</h2>
        <img id="pokemon-img" src="${pokemonData.sprites.front_default}" alt="">
        <div class="types">
            ${typesString}
        </div>
    </div>
`;
}