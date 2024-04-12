const mainContainer = document.querySelector(".main-container");
const pokemonList = document.querySelector(".pokemon-list");
const battleGround = document.querySelector(".battle-ground");
const battleContainer = document.querySelector(".battle-container");

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

battleGround.style.height = "100vh";
battleGround.style.width = "67%";
battleGround.style["background-image"] =
  "url('https://cdna.artstation.com/p/assets/images/images/052/645/660/large/chrysope-battle-background-new.jpg')";
battleGround.style["background-size"] = "cover";
battleGround.style["background-position"] = "center";
battleGround.style["min-height"] = "640px";
battleGround.style.overflow = "hidden";

let currentEnemyRandomPokemon = null;

//Read
async function fetchPokemonList() {
  const myTeamRequest = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=10"
  );
  let myTeamResult = await myTeamRequest.json();
  return myTeamResult.results;
}

//fetched pokemonDetails from API
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
    pokemonFrontImage: pokemonData.sprites.front_default,
    pokemonBackImage: pokemonData.sprites.back_default,
    pokemonTypes: pokemonData.types[0].type.name,
    pokemonNumber: pokemonNumber,
    pokemonHP: pokemonHP,
    pokemonOriginalHP: pokemonHP,
    pokemonAttack: pokemonAttack,
  };
}

//Display pokemon list and team pokemon
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

async function fetchRandomEnemyPokemon() {
  try {
    if (currentEnemyRandomPokemon) {
      return currentEnemyRandomPokemon;
    }
    const fetchEnemyResponse = await fetch("https://pokeapi.co/api/v2/pokemon");
    let enemyData = await fetchEnemyResponse.json();
    const randomPokemonId = Math.floor(Math.random() * 1000) + 1;

    const fetchedEnemyResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`
    );
    const fetchedEnemyData = await fetchedEnemyResponse.json();
    let pokemonEnemyHP, pokemonEnemyAttack;

    fetchedEnemyData.stats.forEach((pokeEnemyStats) => {
      if (pokeEnemyStats.stat.name === "hp") {
        pokemonEnemyHP = pokeEnemyStats.base_stat;
      } else if (pokeEnemyStats.stat.name === "attack") {
        pokemonEnemyAttack = pokeEnemyStats.base_stat;
      }
    });

    currentEnemyRandomPokemon = {
      pokemonEnemyName: fetchedEnemyData.name,
      pokemonEnemyFrontImage: fetchedEnemyData.sprites.front_default,
      pokemonEnemyBackImage: fetchedEnemyData.sprites.back_default,
      pokemonEnemyNumber: randomPokemonId,
      pokemonEnemyHP: pokemonEnemyHP,
      pokemonOriginalEnemyHP: pokemonEnemyHP,
      pokemonEnemyAttack: pokemonEnemyAttack,
    };

    return currentEnemyRandomPokemon;
  } catch (error) {
    console.error("Unable to fetch random enemy pokemon", error);
  }
}

//Added to the localStorage for keeping the values
function myTeamPokemon(addedPokemon) {
  let teamPokemon = JSON.parse(localStorage.getItem("teamPokemon")) || [];

  if (teamPokemon.length < 3) {
    teamPokemon.push(addedPokemon);
    localStorage.setItem("teamPokemon", JSON.stringify(teamPokemon));
    console.log("Inside Favorite Pokemon", addedPokemon);
    showTeamPokemon();
    showEnemyPokemon();
  } else {
    alert(
      "You have reached the maximum numbers of you members. Please delete pokemons!"
    );
  }
}

async function showEnemyPokemon() {
  try {
    const enemyPokemon = await fetchRandomEnemyPokemon();

    const enemyPokemonCard = document.createElement("div");
    enemyPokemonCard.className = "enemyimg-container";
    enemyPokemonCard.innerHTML = `<img src="${enemyPokemon.pokemonEnemyFrontImage}" alt="${enemyPokemon.pokemonEnemyName}" height="150" width="150">
                                  <div>${enemyPokemon.pokemonEnemyName}<br/>
                                 ${enemyPokemon.pokemonEnemyHP} / ${enemyPokemon.pokemonEnemyHP}<br/>
                                 Attack Damage: ${enemyPokemon.pokemonEnemyAttack}</div>`;
    enemyPokemonCard.style.position = "absolute";
    enemyPokemonCard.style.top = "50%";
    enemyPokemonCard.style.left = "50%";
    enemyPokemonCard.style.transform = "translate(-50%, -50%)";

    battleGround.appendChild(enemyPokemonCard);
  } catch (error) {
    console.error("Unable to display the enemy Pokemon", error);
  }
}

function showTeamPokemon() {
  battleGround.innerHTML = "";

  const teamPokemon = JSON.parse(localStorage.getItem("teamPokemon")) || [];

  const pokedexCardWidth = 50 / teamPokemon.length;

  teamPokemon.forEach((pokeMonster, index) => {
    const pokedexCard = document.createElement("div");

    pokedexCard.className = `pokeimg-container-${index}`;
    pokedexCard.innerHTML = `<img src="${pokeMonster.pokemonBackImage}" alt="${pokeMonster.pokemonName}" height="150" width="150">
                              <div>${pokeMonster.pokemonName}<br/>
                                 ${pokeMonster.pokemonHP} / ${pokeMonster.pokemonHP}</div>`;
    pokedexCard.style.position = "absolute";
    pokedexCard.style.bottom = "5%";
    pokedexCard.style.left = `${index * pokedexCardWidth}%`;

    pokedexCard.addEventListener("click", () => {
      const attackerPokemon = {
        pokemonNumber: pokeMonster.pokemonNumber,
        pokemonName: pokeMonster.pokemonName,
        pokemonHP: pokeMonster.pokemonHP,
        pokemonOriginalHP: pokeMonster.pokemonHP,
        pokemonAttack: pokeMonster.pokemonAttack,
        pokemonAlive: pokeMonster.pokemonAlive,
      };

      attackEnemyPokemon(attackerPokemon);
    });

    battleGround.appendChild(pokedexCard);
  });
}

function pokemonCard(pokemonDetails) {
  pokemonList.innerHTML = "";
  const pokemonStatusAlive = true;

  pokemonDetails.forEach((pokeMonster) => {
    const pokedexCard = document.createElement("div");

    pokedexCard.style.background = "#71C558";
    pokedexCard.className = "pokemon-card";
    pokedexCard.innerHTML = `<img src="${pokeMonster.pokemonFrontImage}" alt="${pokeMonster.pokemonName}" height="96" width="96">
                              <p>Name : ${pokeMonster.pokemonName}<br/>
                                 Type : ${pokeMonster.pokemonTypes}<br/>
                                 HP: ${pokeMonster.pokemonHP}<br/>
                                 Attack : ${pokeMonster.pokemonAttack}<br/>
                              </p>
                              <button class="add-btn">Select</button>`;
    pokedexCard.style["border-radius"] = "15px";
    pokedexCard.style.border = "2px";
    pokedexCard.style.padding = "10px";

    const addBtn = pokedexCard.querySelector(".add-btn");
    addBtn.addEventListener("click", () => {
      const addedPokemon = {
        pokemonName: pokeMonster.pokemonName,
        pokemonFrontImage: pokeMonster.pokemonFrontImage,
        pokemonBackImage: pokeMonster.pokemonBackImage,
        pokemonTypes: pokeMonster.pokemonTypes,
        pokemonNumber: pokeMonster.pokemonNumber,
        pokemonHP: pokeMonster.pokemonHP,
        pokemonOriginalHP: pokeMonster.pokemonHP,
        pokemonAttack: pokeMonster.pokemonAttack,
        pokemonAlive: pokemonStatusAlive,
      };
      myTeamPokemon(addedPokemon);
    });
    pokemonList.appendChild(pokedexCard);
  });
}

//Team Pokemon Attacks the enemy pokemon
async function attackEnemyPokemon(attackerPokemon) {
  try {
    const fetchedCurrentEnemy = await fetchRandomEnemyPokemon();
    alert(
      `${attackerPokemon.pokemonName} has done ${attackerPokemon.pokemonAttack} damage to ${fetchedCurrentEnemy.pokemonEnemyName} `
    );
    fetchedCurrentEnemy.pokemonEnemyHP -= attackerPokemon.pokemonAttack;

    const enemyPokemonCard = document.querySelector(".enemyimg-container");
    enemyPokemonCard.innerHTML = `<img src="${fetchedCurrentEnemy.pokemonEnemyFrontImage}" alt="${fetchedCurrentEnemy.pokemonEnemyName}" height="150" width="150">
                                  <div>${fetchedCurrentEnemy.pokemonEnemyName}<br/>
                                 ${fetchedCurrentEnemy.pokemonEnemyHP} / ${fetchedCurrentEnemy.pokemonOriginalEnemyHP}<br/>
                                 Attack Damage : ${fetchedCurrentEnemy.pokemonEnemyAttack}
                                 </div>`;

    //check when enemy is defeated
    if (fetchedCurrentEnemy.pokemonEnemyHP <= 0) {
      isRandomEnemyDefeated(enemyPokemonCard);
    }

    //get the list of alive in teampokemon
    let myTeamPokemon = JSON.parse(localStorage.getItem("teamPokemon")) || [];
    const alivePokemonList = myTeamPokemon.filter(
      (alivePokemon) => alivePokemon.pokemonHP > 0
    );

    if (alivePokemonList.length >= 0) {
      const attackRandomAlivePokemon = Math.floor(
        Math.random() * alivePokemonList.length
      );
      const alivePokemonToAttack = alivePokemonList[attackRandomAlivePokemon];

      attackMyTeamPokemon(alivePokemonToAttack, fetchedCurrentEnemy);
    } else {
      console.log("All pokemon are dead! You lost the game!");
    }
  } catch (error) {
    console.log("Unable to attack the enemy", error);
  }
}

//Enemy attacks the team pokemon randomly
function attackMyTeamPokemon(pokemonWhoAttacked, enemyPokemon) {
  const myTeamPokemon = JSON.parse(localStorage.getItem("teamPokemon")) || [];

  try {
    const attackerHealthDamage = enemyPokemon.pokemonEnemyAttack;
    pokemonWhoAttacked.pokemonHP -= attackerHealthDamage;

    alert(
      `${enemyPokemon.pokemonEnemyName} has attacked ${pokemonWhoAttacked.pokemonName}`
    );

    //checks if one of team pokemon is still alive
    if (pokemonAlive(pokemonWhoAttacked)) {
      const pokemonToBeDeleted = myTeamPokemon.findIndex(
        (pokeMonster) =>
          pokeMonster.pokemonNumber === pokemonWhoAttacked.pokemonNumber
      );

      //deletes the pokemon in the localstorage
      if (pokemonToBeDeleted != -1) {
        myTeamPokemon.splice(pokemonToBeDeleted, 1);
        localStorage.setItem("teamPokemon", JSON.stringify(myTeamPokemon));
        showTeamPokemon();
      }
    }

    myTeamPokemon.forEach((pokeMonster, index) => {
      if (pokeMonster.pokemonNumber === pokemonWhoAttacked.pokemonNumber) {
        const pokedexCard = document.querySelector(
          `.pokeimg-container-${index}`
        );
        console.log("pokedexCard", pokedexCard);
        pokedexCard.innerHTML = `<img src="${pokemonWhoAttacked.pokemonBackImage}" alt="${pokemonWhoAttacked.pokemonName}" height="150" width="150">
                              <div>${pokemonWhoAttacked.pokemonName}<br/>
                                 ${pokemonWhoAttacked.pokemonHP} / ${pokemonWhoAttacked.pokemonOriginalHP}</div>`;
        console.log("Found the correct Pokemon");
      }
    });
  } catch (error) {
    console.error("My team pokemon is unable to attack", error);
  }
}

function isRandomEnemyDefeated(enemyPokemonCard) {
  alert("Team Pokemon have won!");
  enemyPokemonCard.parentNode.removeChild(enemyPokemonCard);
}

function pokemonAlive(teamPokemon) {
  return teamPokemon.pokemonHP <= 0;
}

fetchAndShowPokemon();
showEnemyPokemon();
