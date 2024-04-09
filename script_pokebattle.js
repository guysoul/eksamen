const mainContainer = document.querySelector(".main-container");
const pokemonList = document.querySelector(".pokemon-list");
const battleGround = document.querySelector(".battle-ground");

mainContainer.style.display = "flex";
mainContainer.style["justify-content"] = "space-between";
mainContainer.style.height = "100%";
mainContainer.style.width = "100%";

pokemonList.style.display = "flex";
pokemonList.style["align-content"] = "flex-start";
pokemonList.style["flex-wrap"] = "wrap";
pokemonList.style["row-gap"] = "10px";
pokemonList.style["gap"] = "10px 20px";
pokemonList.style.height = "100%";
pokemonList.style.width = "30%";
pokemonList.style["background-color"] = "lightblue";

battleGround.style.display = "flex";
battleGround.style["align-content"] = "flex-start";
battleGround.style["flex-wrap"] = "wrap";
battleGround.style["row-gap"] = "10px";
battleGround.style["gap"] = "10px 20px";
battleGround.style.height = "100%";
battleGround.style.width = "67%";
battleGround.style["background-color"] = "lightgreen";

//Read
async function fetchPokemonList() {
  const myTeamRequest = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=10"
  );
  let myTeamResult = await myTeamRequest.json();
  return pokemonResult.results;
}

async function fetchPokemonInformation(pokeURL) {
  const pokemonNumber = pokeURL.match(/\/(\d+)\/$/)[1];
  const fetchPokemonResponse = await fetch(pokeURL);
  const pokemonData = await fetchPokemonResponse.json();
  let pokemonHP, pokemonAttack;

  pokemonData.stats.forEach((pokeStats) => {
    if (pokeStats.stat.name === "hp") {
      pokemonHP = stat.base_stat;
    } else if (pokeStats.stat.name === "attack") {
      pokemonAttack = stat.base_stat;
    }
  });

  return {
    pokemonName: pokemonData.name,
    pokemonImage: pokemonData.sprites.front_default,
    pokemonTypes: pokemonData.types[0].type.name,
    pokemonNumber: pokemonNumber,
    pokemonHP: pokemonHP,
    pokemonAttack: pokemonAttack,
  };
}
