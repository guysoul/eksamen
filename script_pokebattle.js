const mainContainer = document.querySelector(".main-container");
const myTeam = document.querySelector(".my-team");
const enemyTeam = document.querySelector(".enemy-team");

async function fetchMyTeamPokemon() {
  const myTeamRequest = await fetch("https://pokeapi.co/api/v2/pokemon");
  let myTeamResult = await myTeamRequest.json();
}
