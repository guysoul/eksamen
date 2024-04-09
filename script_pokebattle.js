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
battleGround.style["background-image"] =
  "url('https://cdna.artstation.com/p/assets/images/images/052/645/660/large/chrysope-battle-background-new.jpg')";
battleGround.style["background-size"] = "cover";
battleGround.style["background-position"] = "center";
battleGround.style["min-height"] = "640px";
battleGround.style.overflow = "hidden";

//Read
async function fetchPokemonList() {
  const myTeamRequest = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=10"
  );
  let myTeamResult = await myTeamRequest.json();
  return myTeamResult.results;
}

async function fetchPokemonInformation(pokeURL) {
  const pokemonNumber = pokeURL.match(/\/(\d+)\/$/)[1];
  const fetchPokemonResponse = await fetch(pokeURL);
  const pokemonData = await fetchPokemonResponse.json();
  let pokemonHP, pokemonAttack;

  pokemonData.stats.forEach((pokeStats) => {
    if (pokeStats.stat.name === "hp") {
      pokemonHP = pokeStats.base_stat;
    } else if (pokeStats.stat.name === "attack") {
      pokemonAttack = pokeStats.base_stat;
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

async function fetchAndShowPokemon() {
  try {
    let apiAndStoragePokemon = [];

    const pokemonList = await fetchPokemonList();
    const pokemonDetail = pokemonList.map((pokeMonster) =>
      fetchPokemonInformation(pokeMonster.url)
    );

    const pokemonDetails = await Promise.all(pokemonDetail);
    apiAndStoragePokemon = [...apiAndStoragePokemon, ...pokemonDetails];

    pokemonCard(apiAndStoragePokemon);
  } catch (error) {
    console.error("Unable to load pokemon list!", error);
  }
}

//Write
function myTeamPokemon(addedPokemon) {
  let teamPokemon = JSON.parse(localStorage.getItem("teamPokemon")) || [];

  if (teamPokemon.length < 3) {
    teamPokemon.push(addedPokemon);
    localStorage.setItem("teamPokemon", JSON.stringify(teamPokemon));
    console.log("Inside Favorite Pokemon", addedPokemon);
    showTeamPokemon();
  } else {
    alert(
      "You have reached the maximum numbers of you members. Please delete pokemons!"
    );
  }
}

function showTeamPokemon() {}

function pokemonCard(pokemonDetails) {
  pokemonList.innerHTML = "";

  pokemonDetails.forEach((pokeMonster) => {
    const pokedexCard = document.createElement("div");

    pokedexCard.style.background = "#71C558";
    pokedexCard.className = "pokemon-card";
    pokedexCard.innerHTML = `<img src="${pokeMonster.pokemonImage}" alt="${pokeMonster.pokemonName}" height="96" width="96">
                              <p>Name : ${pokeMonster.pokemonName}<br/>
                                 Type : ${pokeMonster.pokemonTypes}<br/>
                                 HP: ${pokeMonster.pokemonHP}<br/>
                                 Attack : ${pokeMonster.pokemonAttack}<br/>
                              </p>
                              <button class="add-btn">Add Pokemon</button>`;
    pokedexCard.style["border-radius"] = "15px";
    pokedexCard.style.border = "2px";
    pokedexCard.style.padding = "10px";

    const addBtn = pokedexCard.querySelector(".add-btn");
    addBtn.addEventListener("click", () => {
      const addedPokemon = {
        pokemonName: pokeMonster.pokemonName,
        pokemonImage: pokeMonster.pokemonImage,
        pokemonTypes: pokeMonster.pokemonTypes,
        pokemonNumber: pokeMonster.pokemonNumber,
        pokemonHP: pokemonHP,
        pokemonAttack: pokemonAttack,
      };
      myTeamPokemon(addedPokemon);
    });
    pokemonList.appendChild(pokedexCard);
  });
}

fetchAndShowPokemon();
