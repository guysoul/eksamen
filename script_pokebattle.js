const mainContainer = document.querySelector(".main-container");
const pokemonList = document.querySelector(".pokemon-list");
const battleGround = document.querySelector(".battle-ground");

const pokemonHealthContainer = document.querySelector(
  ".pokemon-health-containers"
);
const healthbarContainers = document.querySelector(".healthbar-containers");
const healthMemberOne = document.querySelector(".healthbar-member-one");
const textContainer = document.querySelector(".text-container");

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
    let apiPokemon = [];

    const pokemonList = await fetchPokemonList();
    const pokemonDetail = pokemonList.map((pokeMonster) =>
      fetchPokemonInformation(pokeMonster.url)
    );

    const pokemonListDetails = await Promise.all(pokemonDetail);
    apiPokemon = [...apiPokemon, ...pokemonListDetails];

    pokemonCard(apiPokemon);
    showTeamPokemon();
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

function showTeamPokemon() {
  battleGround.innerHTML = "";

  const teamPokemon = JSON.parse(localStorage.getItem("teamPokemon")) || [];

  teamPokemon.forEach((pokeMonster) => {
    const pokedexCard = document.createElement("div");
    pokedexCard.className = "pokeimg-container-one";
    pokedexCard.innerHTML = `<img src="${pokeMonster.pokemonImage}" alt="${pokeMonster.pokemonName}" height="96" width="96">
                              <div>${pokeMonster.pokemonName}<br/>
                                 ${pokeMonster.pokemonHP} / ${pokeMonster.pokemonHP}</div>`;
    pokedexCard.style.position = "absolute";
    pokedexCard.style.bottom = "5%";
    pokedexCard.style.left = "3%";

    battleGround.appendChild(pokedexCard);
  });
}

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
        pokemonHP: pokeMonster.pokemonHP,
        pokemonAttack: pokeMonster.pokemonAttack,
      };
      myTeamPokemon(addedPokemon);
    });
    pokemonList.appendChild(pokedexCard);
  });
}

fetchAndShowPokemon();
