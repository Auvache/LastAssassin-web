const api_url = "https://api.lastassassin.app/";
const session = {
  attemptcd: 5,
  delay: 60,
  game: '',
  host: '',
  lagdistance: 3,
  mode: 'Manual',
  players: {},
  tagcd: 20,
  tagdistance: 1,
}
const player = {
  name: '',
  lat: 40.2338889,
  long: -111.6577778,
}
const heartbeat = {
  lobby: 0,
  game: 0,
  lobbyDead: false,
  gameDead: false,
}  


function Create() {
  session.host = document.getElementById('host').value;
  const request = {
    Host: session.host,
  };
  call(request, "create", "create_result");
}

function Host() {
  heartbeat.lobby = heartbeat.lobby + 1;
  document.getElementById('hb').innerText = heartbeat.lobby;
  player.name = session.host;

  const request = {
    Game: session.game,
    Player: session.host,
    Mode: session.mode,
    Delay: session.delay,
    AttemptCD: session.attemptcd,
    KillCD: session.tagcd,
    KillDistance: session.tagdistance,
    LagDistance: session.lagdistance,
  };
  call(request, "host", "host_result");  
}

function Lobby() {
  heartbeat.lobby = heartbeat.lobby + 1;
  document.getElementById('hb').innerText = heartbeat.lobby;

  const request = {
    Game: session.game,
    Player: player.name,
  };
  call(request, "lobby", "lobby2_result");
}

function KillLobby() {
    heartbeat.lobby = 1000000;
}

function StartGame() {
  console.log("start clicked");
  const request = {
    Game: session.game,
    Player: player.name,
    HomeLat: player.lat,
    HomeLong: player.long,
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
      // for testing
      console.log(route + ' data:');
      console.log(data);

      if(route == "create") {
        session.game = data.Game;
        document.getElementById('lcode').innerText = session.game;
        showLobby();
        Host();
      }

      if(route == "host") {
        var html = '';
        for (var i = 0; i < data.Players.length; i++) {
          html += '<li>' + data.Players[i] + '</li>';
        }
        document.getElementById("lobby_result").innerHTML = html;

        if (heartbeat.lobby < 1000) {
          setTimeout(function(){Host();},2000);
        } else { 
          setTimeout(function(){StartGame();},7000);
        }
      }

      if(route == "lobby") {
        if (data.GameStarted == false) {
          session.host = data.Host;
          session.players = data.Players;
  
          var html = '';
          for (var i = 0; i < data.Players.length; i++) {
            html += '<li>' + data.Players[i] + '</li>';
          }
          document.getElementById("lobby_result").innerHTML = html;
  
          if (heartbeat.lobby < 1000) {
            setTimeout(function(){Lobby();},2000);
          }
        }
        else {
          showGame();
        }
      }

      // for testing
      console.log(route + ' session object:');
      console.log(session);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

    if (route == "start") {
      showGame();
    }
}










// show page methods //////////////////////////////////////////////////

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

session.game = document.getElementById('lcode2').value;
player.name = document.getElementById('lname2').value;
document.getElementById('lcode').innerText = session.game

Lobby();
}


function showJoin() {
  let menuScreen = document.getElementById('menu-screen');
  let joinScreen = document.getElementById('join-screen');

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
