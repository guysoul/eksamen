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

// reference to pokemon colour types
//www.pokemonaaah.net/artsyfartsy/colordex/
function pokemonTypeColor(color) {
  const colorType = {
    normal: "#AAB09F",
    fire: "#EA7A3C",
    water: "#539AE2",
    electric: "#E5C531",
    grass: "#71C558",
    ice: "#70CBD4",
    fighting: "#CB5F48",
    poison: "#B468B7",
    ground: "#CC9F4F",
    flying: "#7DA6DE",
    psychic: "#E5709B",
    bug: "#94BC4A",
    rock: "#B2A061",
    ghost: "#846AB6",
    dragon: "#6A7BAF",
    dark: "#736C75",
    steel: "#89A1B0",
    fairy: "#E397D1",
  };

  if (colorType[color]) {
    return colorType[color];
  } else {
    return "none";
  }
}

function pokemonCard(pokemonDetails) {
  pokemonContainer.innerHTML = "";

  pokemonDetails.forEach((pokeMonster) => {
    const bgColorCard = pokemonTypeColor(pokeMonster.pokemonTypes);
    const pokedexCard = document.createElement("div");

    pokedexCard.style.background = bgColorCard;
    pokedexCard.className = "pokemon-card";
    pokedexCard.innerHTML = ` <img src="${pokeMonster.pokemonImage}" alt="${pokeMonster.pokemonName}">
                              <p>Name : ${pokeMonster.pokemonName}</p>
                               <p>Type : ${pokeMonster.pokemonTypes}</p>
                               <button class="save-btn">Save</button>
                               <button class="edit-btn">Edit</button>
                               <button class="delete-btn">Delete</button>`;
    pokedexCard.style["border-radius"] = "15px";
    pokedexCard.style.border = "2px #000000";
    pokedexCard.style.padding = "10px";

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
