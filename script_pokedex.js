const mainContainer = document.querySelector(".main-container");
const pokemonContainer = document.querySelector(".pokemon-container");
const pokemonFavorite = document.querySelector(".pokemon-favorite");

const addBtn = document.querySelector(".add-btn");
const filterBtn = document.querySelectorAll(".filter-btn");

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

//Read
async function fetchPokemonList() {
  const pokemonRequest = await fetch(
    "https://pokeapi.co/api/v2/pokemon/?limit=50&offset=100"
  );
  let pokemonResult = await pokemonRequest.json();
  return pokemonResult.results;
}

//Fetch all secondary details of a pokemon
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
async function fetchPokemonInformation(pokeURL) {
  const pokemonNumber = pokeURL.match(/\/(\d+)\/$/)[1];
  const fetchPokemonResponse = await fetch(pokeURL);
  const pokemonData = await fetchPokemonResponse.json();

  return {
    pokemonName: pokemonData.name,
    pokemonImage: pokemonData.sprites.front_default,
    pokemonTypes: pokemonData.types[0].type.name,
    pokemonNumber: pokemonNumber,
  };
}

//Uses the spread syntax method
//https://www.w3schools.com/jsref/jsref_map.asp
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
async function fetchAndShowPokemon() {
  try {
    let oldAndNewPokemon = [];

    const pokemonList = await fetchPokemonList();
    const pokemonDetail = pokemonList.map((pokeMonster) =>
      fetchPokemonInformation(pokeMonster.url)
    );

    const pokemonApiDetails = await Promise.all(pokemonDetail);
    oldAndNewPokemon = [...oldAndNewPokemon, ...pokemonApiDetails];

    const pokemonStorageDetails =
      JSON.parse(localStorage.getItem("pokemonList")) || [];
    oldAndNewPokemon = [...oldAndNewPokemon, ...pokemonStorageDetails];

    pokemonCard(oldAndNewPokemon);
    showFavoritePokemon();
  } catch (error) {
    console.error("Unable to load pokemon list!", error);
  }
}

async function fetchFilterPokemon(type) {
  try {
    let newPokemonAddedToFilter = [];

    const pokemonFilteredList = await fetchPokemonList();
    const pokemonFilteredDetail = pokemonFilteredList.map((pokeMonster) =>
      fetchPokemonInformation(pokeMonster.url)
    );

    const pokemonFilteredDetails = await Promise.all(pokemonFilteredDetail);
    newPokemonAddedToFilter = [
      ...newPokemonAddedToFilter,
      ...pokemonFilteredDetails,
    ];

    const pokemonFilteredStorageDetails =
      JSON.parse(localStorage.getItem("pokemonList")) || [];
    newPokemonAddedToFilter = [
      ...newPokemonAddedToFilter,
      ...pokemonFilteredStorageDetails,
    ];

    let filteredPokemon;

    if (type === "all") {
      filteredPokemon = newPokemonAddedToFilter;
    } else {
      filteredPokemon = newPokemonAddedToFilter.filter((pokemon) =>
        pokemon.pokemonTypes.includes(type)
      );
    }
    console.log("Filtered Pokemon", filteredPokemon);
    pokemonCard(filteredPokemon);
  } catch (error) {
    console.error("Unable to load pokemon list!", error);
  }
}

filterBtn.forEach((button) => {
  button.addEventListener("click", () => {
    const chosenType = button.getAttribute("data-pokemonType");
    console.log("pokemon type", chosenType);
    fetchFilterPokemon(chosenType);
  });
});

//Write
function favoritePokemon(favePokemon) {
  let savedPokemon = JSON.parse(localStorage.getItem("savedPokemon")) || [];

  if (savedPokemon.length < 5) {
    savedPokemon.push(favePokemon);
    localStorage.setItem("savedPokemon", JSON.stringify(savedPokemon));
    console.log("Inside Favorite Pokemon", favePokemon);
    showFavoritePokemon();
  } else {
    alert(
      "You have reached the maximum numbers of saved Pokemons. Please delete pokemons!"
    );
  }
}

//Delete
function deleteStoragePokemon(pokemonDetails) {
  console.log("Inside deletstoragepokemon.", pokemonDetails);
  let deletedPokemonList =
    JSON.parse(localStorage.getItem("pokemonList")) || [];

  let deletedFavoritePokemon =
    JSON.parse(localStorage.getItem("savedPokemon")) || [];
  //Need to find the index in deletedpokemonList to be deleted.
  const pokemonToBeDeleted = deletedPokemonList.findIndex(
    (pokemon) => pokemon.pokemonNumber === pokemonDetails.pokemonNumber
  );

  const favoritePokemonToBeDeleted = deletedFavoritePokemon.findIndex(
    (favePokemon) => favePokemon.pokemonNumber === pokemonDetails.pokemonNumber
  );

  console.log("pokemon to be deleted", pokemonToBeDeleted);

  console.log("pokemon to be deleted in favorite", favoritePokemonToBeDeleted);

  if (pokemonToBeDeleted !== -1) {
    console.log("Deleted Pokemon", pokemonToBeDeleted);
    deletedPokemonList.splice(pokemonToBeDeleted, 1);
    localStorage.setItem("pokemonList", JSON.stringify(deletedPokemonList));
  } else if (favoritePokemonToBeDeleted !== -1) {
    deletedFavoritePokemon.splice(favoritePokemonToBeDeleted, 1);
    localStorage.setItem(
      "savedPokemon",
      JSON.stringify(deletedFavoritePokemon)
    );
  }
}

async function editPokemonDetails(editedPokemon) {
  console.log(editedPokemon.pokemonName);
  console.log(editedPokemon.pokemonTypes);
  console.log(editedPokemon.pokemonNumber);

  const editedPokemonName = prompt("Enter new Pokemon Name:");
  const editedPokemonType = prompt("Enter new Pokemon Type:");

  if (editedPokemonName === null || editedPokemonType === null) {
    return null;
  }

  if (!editedPokemonName.trim() || !editedPokemonType.trim()) {
    alert("Please enter the new Pokemon name and type!");
    return editPokemonDetails(editedPokemon);
  }

  editedPokemon.pokemonName = editedPokemonName.trim();
  editedPokemon.pokemonTypes = editedPokemonType.trim();

  // Updating pokemon details in the local storage pokemonList
  let editedPokemonList = JSON.parse(localStorage.getItem("pokemonList")) || [];
  console.log("existing pokemon list", editedPokemonList);
  const pokemonToBeEdited = editedPokemonList.findIndex(
    (editLocalPokemon) =>
      editLocalPokemon.pokemonNumber === editedPokemon.pokemonNumber
  );

  console.log("index of pokemon to be updated", pokemonToBeEdited);

  if (pokemonToBeEdited !== -1) {
    editedPokemonList[pokemonToBeEdited].pokemonName =
      editedPokemon.pokemonName;
    editedPokemonList[pokemonToBeEdited].pokemonTypes =
      editedPokemon.pokemonTypes;

    localStorage.setItem("pokemonList", JSON.stringify(editedPokemonList));
    console.log("Pokemon details updated");
  } else {
    console.log("not updated");
  }

  //Updating pokemon details in the local storage savedPokemon
  let editedSavedPokemonList =
    JSON.parse(localStorage.getItem("savedPokemon")) || [];
  const savedPokemonToBeEdited = editedSavedPokemonList.findIndex(
    (editLocalSavedPokemon) =>
      editLocalSavedPokemon.pokemonNumber === editedPokemon.pokemonNumber
  );

  if (savedPokemonToBeEdited !== -1) {
    editedSavedPokemonList[savedPokemonToBeEdited].pokemonName =
      editedPokemon.pokemonName;
    editedSavedPokemonList[savedPokemonToBeEdited].pokemonTypes =
      editedPokemon.pokemonTypes;

    localStorage.setItem(
      "savedPokemon",
      JSON.stringify(editedSavedPokemonList)
    );
  } else {
    console.log("not updated");
  }

  //Updating pokemon details in the API list
  try {
    const apiPokemonList = await fetchPokemonList();
    const apiEditedPokemon = apiPokemonList.find(
      (editApiPokemon) =>
        editApiPokemon.pokemonNumber === editedPokemon.pokemonNumber
    );

    console.log("api pokemon to be edited", editedPokemon.pokemonNumber);

    if (apiEditedPokemon) {
      apiEditedPokemon.pokemonName = editedPokemon.pokemonName;
      apiEditedPokemon.pokemonTypes = editedPokemon.pokemonTypes;
    }
  } catch (error) {
    console.error("Error updated the pokemon details in API", error);
  }

  console.log("New name value is", editedPokemonName);
  console.log("New type value is", editedPokemonType);
  fetchAndShowPokemon();
}

function addNewPokemon() {
  const newPokemonImage =
    "https://pngfre.com/wp-content/uploads/Pokeball-1.png";
  let pokemonList = JSON.parse(localStorage.getItem("pokemonList")) || [];
  let newPokemonNumber = 0;
  const newPokemonName = prompt("Enter new Pokemon Name:");
  const newPokemonType = prompt("Enter new Pokemon Type:");

  if (newPokemonName === null || newPokemonType === null) {
    return null;
  }

  if (!newPokemonName.trim() || !newPokemonType.trim()) {
    alert("Please enter Pokemon name and type!");
    return addNewPokemon();
  }

  const newPokemon = {
    pokemonName: newPokemonName.trim(),
    pokemonImage: newPokemonImage,
    pokemonTypes: newPokemonType.trim(),
    pokemonNumber: newPokemonNumber++,
  };

  pokemonList.forEach((pokemon, index) => {
    pokemon.pokemonNumber = index + 1;
  });

  pokemonList.push(newPokemon);
  localStorage.setItem("pokemonList", JSON.stringify(pokemonList));

  fetchAndShowPokemon();
}

addBtn.addEventListener("click", function () {
  addNewPokemon();
});

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

function showFavoritePokemon() {
  pokemonFavorite.innerHTML = "";

  const favePokemon = JSON.parse(localStorage.getItem("savedPokemon")) || [];

  favePokemon.forEach((pokeMonster) => {
    const bgColorCard = pokemonTypeColor(pokeMonster.pokemonTypes);

    const pokedexCard = document.createElement("div");

    pokedexCard.style.background = bgColorCard;
    pokedexCard.className = "pokemon-card";

    pokedexCard.innerHTML = ` <img src="${pokeMonster.pokemonImage}" alt="${pokeMonster.pokemonName}" height="96" width="96">
                              <p>Name : ${pokeMonster.pokemonName}</p>
                               <p>Type : ${pokeMonster.pokemonTypes}</p>
                               <button class="delete-btn">Delete</button>`;
    pokedexCard.style["border-radius"] = "15px";
    pokedexCard.style.border = "2px";
    pokedexCard.style.padding = "10px";

    const deleteBtn = pokedexCard.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      const deleteFavoritePokemon = {
        pokemonName: pokeMonster.pokemonName,
        pokemonImage: pokeMonster.pokemonImage,
        pokemonTypes: pokeMonster.pokemonTypes,
        pokemonNumber: pokeMonster.pokemonNumber,
      };

      pokemonFavorite.removeChild(pokedexCard);
      deleteStoragePokemon(deleteFavoritePokemon);
    });
    pokemonFavorite.appendChild(pokedexCard);
  });
}

function pokemonCard(pokemonDetails) {
  pokemonContainer.innerHTML = "";

  pokemonDetails.forEach((pokeMonster) => {
    const bgColorCard = pokemonTypeColor(pokeMonster.pokemonTypes);
    const pokedexCard = document.createElement("div");

    pokedexCard.style.background = bgColorCard;
    pokedexCard.className = "pokemon-card";
    pokedexCard.innerHTML = ` <img src="${pokeMonster.pokemonImage}" alt="${pokeMonster.pokemonName}" height="96" width="96">
                              <p>Name : ${pokeMonster.pokemonName}</p>
                               <p>Type : ${pokeMonster.pokemonTypes}</p>
                               <button class="save-btn">Save</button>
                               <button class="edit-btn">Edit</button>
                               <button class="delete-btn">Delete</button>`;
    pokedexCard.style["border-radius"] = "15px";
    pokedexCard.style.border = "2px";
    pokedexCard.style.padding = "10px";

    const saveBtn = pokedexCard.querySelector(".save-btn");
    saveBtn.addEventListener("click", () => {
      const savedPokemon = {
        pokemonName: pokeMonster.pokemonName,
        pokemonImage: pokeMonster.pokemonImage,
        pokemonTypes: pokeMonster.pokemonTypes,
        pokemonNumber: pokeMonster.pokemonNumber,
      };
      favoritePokemon(savedPokemon);
    });

    const editBtn = pokedexCard.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => {
      const editedPokemon = {
        pokemonName: pokeMonster.pokemonName,
        pokemonImage: pokeMonster.pokemonImage,
        pokemonTypes: pokeMonster.pokemonTypes,
        pokemonNumber: pokeMonster.pokemonNumber,
      };
      editPokemonDetails(editedPokemon);
    });

    const deleteBtn = pokedexCard.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      const deletedPokemon = {
        pokemonName: pokeMonster.pokemonName,
        pokemonImage: pokeMonster.pokemonImage,
        pokemonTypes: pokeMonster.pokemonTypes,
        pokemonNumber: pokeMonster.pokemonNumber,
      };
      pokemonContainer.removeChild(pokedexCard);
      deleteStoragePokemon(deletedPokemon);
    });

    pokemonContainer.appendChild(pokedexCard);
  });
}

fetchAndShowPokemon();
