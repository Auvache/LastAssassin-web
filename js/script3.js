const api_url = "https://api.lastassassin.app/";
const game = {
  code: '',
  host: '',
  players: {},
  mode: 'manual',
  delay: 60,
  attemptcd: 5,
  tagcd: 20,
  tagdistance: 1,
  lagdistance: 3,
  route: '',
  result: '',
}
const player = {
  name: '',
  lat: 0,
  long: 0,
}
const heartbeat = {
  lobby: 0,
  game: 0,
}

let gameData;
  


function Create() {
  const host = document.getElementById("host").value;
  const request = {
    Host: host,
  };
  call(request, "create", "create_result");
  Host();
  showLobby();
}

function Host() {
  heartbeat.lobby = heartbeat.lobby + 1;
  document.getElementById('hb').innerText = heartbeat.lobby;
  player.name = game.host;

  const code = game.code;
  const name = game.host;
  const mode = game.mode;
  const delay = game.delay;
  const attempt_cd = game.attemptcd;
  const kill_cd = game.tagcd;
  const kill_distance = game.tagdistance;
  const lag_distance = game.lagdistance;
  const request = {
    Game: code,
    Player: name,
    Mode: mode,
    Delay: delay,
    AttemptCD: attempt_cd,
    KillCD: kill_cd,
    KillDistance: kill_distance,
    LagDistance: lag_distance,
  };
  call(request, "host", "host_result");
  if (heartbeat.lobby < 100) {
    setTimeout(function(){Host();},1000);
  };
  
}

function Lobby() {
  heartbeat.lobby = heartbeat.lobby + 1;
  document.getElementById('hb').innerText = heartbeat.lobby;

  const code = game.code;
  const name = player.name;
  const request = {
    Game: code,
    Player: name,
  };
  call(request, "lobby", "lobby2_result");
  
}

function Start() {
  heartbeat.lobby = 1000000;

  const code = game.code;
  const name = player.name;
  const lat = player.lat;
  const long = player.long;
  const request = {
    Game: code,
    Player: name,
    HomeLat: lat,
    HomeLong: long,
  };
  call(request, "start", "start_result");
}

function Game() {
  const code = game.code;
  const name = player.name;
  const lat = player.lat;
  const long = player.long;
  const request = {
    Game: code,
    Player: name,
    Latitude: lat,
    Longitude: long,
  };
  call(request, "game", "game_result");
}

function Kill() {
  const code = document.getElementById("acode").value;
  const name = document.getElementById("aname").value;
  const request = {
    Game: code,
    Player: name,
  };
  call(request, "kill", "kill_result");
}

function Verify() {
  const code = document.getElementById("vcode").value;
  const name = document.getElementById("vname").value;
  const hunter = document.getElementById("hunter").value;
  const verify = document.getElementById("verify").value;
  const request = {
    Game: code,
    Player: name,
  };
  call(request, "verify", "verify_result");
}

function call(request, route, result) {
  fetch(api_url + route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(request),
  })
    .then((response) => {
      console.log("Response: ", response);
      return response.json();
    })
    .then((data) => {
      gameData = data;
      document.getElementById(result).innerHTML = JSON.stringify(data);
      console.log('data:');
      console.log(gameData);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// show page methods
function showCreate() {
  let menuScreen = document.getElementById('menu-screen');
  let createScreen = document.getElementById('create-screen');

  menuScreen.classList.add("hide");
  createScreen.classList.remove("hide");
}

function showLobby() {
let createScreen = document.getElementById('create-screen');
let joinScreen = document.getElementById('join-screen');
let lobbyScreen = document.getElementById('lobby-screen');

createScreen.classList.add("hide");
joinScreen.classList.add("hide");
lobbyScreen.classList.remove("hide");
}

function showLobby2() {
let createScreen = document.getElementById('create-screen');
let joinScreen = document.getElementById('join-screen');
let lobbyScreen = document.getElementById('lobby-screen');

document.getElementById('startBtn').classList.add('hide');

createScreen.classList.add("hide");
joinScreen.classList.add("hide");
lobbyScreen.classList.remove("hide");

game.code = document.getElementById('lcode2').value;
player.name = document.getElementById('lname2').value;
document.getElementById('lcode').innerText = game.code

Lobby();
}


function showJoin() {
  let menuScreen = document.getElementById('menu-screen');
  let createScreen = document.getElementById('create-screen');
  let joinScreen = document.getElementById('join-screen');
  let lobbyScreen = document.getElementById('lobby-screen');
  let gameScreen = document.getElementById('game-screen');
  let endScreen = document.getElementById('end-screen');
  let loadScreen = document.getElementById('loading-screen');

  menuScreen.classList.add("hide");
  joinScreen.classList.remove("hide");
}

function showGame() {
let menuScreen = document.getElementById('menu-screen');
let createScreen = document.getElementById('create-screen');
let joinScreen = document.getElementById('join-screen');
let lobbyScreen = document.getElementById('lobby-screen');
let gameScreen = document.getElementById('game-screen');
let endScreen = document.getElementById('end-screen');
let loadScreen = document.getElementById('loading-screen');

lobbyScreen.classList.add("hide");
gameScreen.classList.remove("hide");
}
