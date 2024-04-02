const pokemonContainer = document.querySelector(".pokemon-container");

let pokemonList;

//Read
async function fetchPokemonList() {
  const pokemonRequest = await fetch(
    "https://pokeapi.co/api/v2/pokemon/?limit=50"
  );
  let pokemonResult = await pokemonRequest.json();
  return pokemonResult.results;
}

//console.log(fetchPokemonList());

//Fetch all details of a pokemon
async function fetchPokemonInformation(pokeURL) {
  const fetchPokemonResponse = await fetch(pokeURL);
  const pokemonData = await fetchPokemonResponse.json();

  return {
    pokemonName: pokemonData.name,
    pokemonImage: pokemonData.sprites.front_default,
    pokemonTypes: pokemonData.types
      .map((PokemonType) => PokemonType.type.name)
      .join(", "),
  };
}

async function fetchAndShowPokemon() {
  try {
    pokemonList = await fetchPokemonList();
    const pokemonDetail = pokemonList.map();
    showAllPokemons();
  } catch (error) {
    console.error("Unable to load pokemon list!", error);
  }
}

//console.log(fetchAndShowPokemon());

function showAllPokemons() {
  pokemonContainer.innerHTML = "";

  pokemonList.forEach((pokeMonster, index) => {
    const pokedexCard = document.createElement("div");

    pokedexCard.innerHTML = `<h3>Name : ${pokeMonster.name}</h3>
                               <h3>URL : ${pokeMonster.url}</h3>`;

    pokemonContainer.appendChild(pokedexCard);
  });
}

fetchAndShowPokemon();
