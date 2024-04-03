const mainContainer = document.querySelector(".main-container");
const pokemonContainer = document.querySelector(".pokemon-container");
const pokemonFavorite = document.querySelector(".pokemon-favorite");

mainContainer.style.display = "flex";
mainContainer.style.height = "100%";

pokemonContainer.style.display = "flex";
pokemonContainer.style["flex"] = "1";
pokemonContainer.style["align-content"] = "flex-start";
pokemonContainer.style["flex-wrap"] = "wrap";
pokemonContainer.style["row-gap"] = "10px";
pokemonContainer.style["gap"] = "10px 20px";
pokemonContainer.style.height = "100%";
pokemonContainer.style["background-color"] = "lightblue";

pokemonFavorite.style.display = "flex";
pokemonFavorite.style["flex"] = "1";
pokemonFavorite.style["align-content"] = "flex-start";
pokemonFavorite.style["flex-wrap"] = "wrap";
pokemonFavorite.style["row-gap"] = "10px";
pokemonFavorite.style["gap"] = "10px 20px";
pokemonFavorite.style.height = "100%";
pokemonFavorite.style["background-color"] = "lightgreen";

//let pokemonList;

//Read
async function fetchPokemonList() {
  const pokemonRequest = await fetch(
    "https://pokeapi.co/api/v2/pokemon/?limit=50&offset=100"
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
    pokemonTypes: pokemonData.types[0].type.name,
  };
}

async function fetchAndShowPokemon() {
  try {
    const pokemonList = await fetchPokemonList();
    const pokemonDetail = pokemonList.map((pokeMonster) =>
      fetchPokemonInformation(pokeMonster.url)
    );
    const pokemonDetails = await Promise.all(pokemonDetail);
    pokemonCard(pokemonDetails);
  } catch (error) {
    console.error("Unable to load pokemon list!", error);
  }
}

//console.log(fetchAndShowPokemon());

function pokemonCard(pokemonDetails) {
  pokemonContainer.innerHTML = "";

  pokemonDetails.forEach((pokeMonster) => {
    const pokedexCard = document.createElement("div");
    pokedexCard.className = "pokemon-card";
    pokedexCard.innerHTML = ` <img src="${pokeMonster.pokemonImage}" alt="${pokeMonster.pokemonName}">
                              <h3>Name : ${pokeMonster.pokemonName}</h3>
                               <h3>Type : ${pokeMonster.pokemonTypes}</h3>
                               <button class="save-btn">Save</button>
                               <button class="edit-btn">Edit</button>
                               <button class="delete-btn">Delete</button>`;

    const saveBtn = pokedexCard.querySelector(".save-btn");
    saveBtn.addEventListener("click", () => {
      // Insert action later
      console.log("Save button has been clicked for ", pokeMonster.pokemonName);
    });

    const editBtn = pokedexCard.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => {
      // Insert action later
      console.log("Edit button has been clicked for ", pokeMonster.pokemonName);
    });

    const deleteBtn = pokedexCard.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      // Insert action later
      console.log(
        "Delete button has been clicked for ",
        pokeMonster.pokemonName
      );
    });

    pokemonContainer.appendChild(pokedexCard);
  });
}

fetchAndShowPokemon();
