const api_url = "http://lastapi.stevenrummler.com/";
const heart = {
  gamebeat: 0,
  lobbybeat: 0
}

function Create() {
  fetch(api_url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      console.log("Response: ", response);
      return response.json();
    })
    .then((data) => {
      document.getElementById("create_result").innerHTML = JSON.stringify(data);
      // Set other game code inputs to this code.
      console.log(data);
      document.getElementById("scode").innerHTML = data.Game;
      document.getElementById("lcode").value = data.Game;
      document.getElementById("code").value = data.Game;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

    showCreate(document.getElementById("code"));
}

function Start() {
  heart.lobbybeat = 1000000;

  const code = document.getElementById("scode").innerHTML;
  const request = {
    Game: code,
  };
  fetch(api_url, {
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
      document.getElementById("start_result").innerHTML = JSON.stringify(data);
      showGame();
      // show loading screen here before calling Game();
      setTimeout(function(){Game();},5000);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function Lobby() {
  heart.lobbybeat = heart.lobbybeat + 1;
  document.getElementById('hb').innerText = heart.lobbybeat;

  const code = document.getElementById("lcode").value;
  const name = document.getElementById("lname").value;
  document.getElementById("name").value = name;
  const request = {
    Game: code,
    Player: name,
  };
  fetch(api_url, {
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
      var html = '';
      for (var i = 0; i < data.Players.length; i++) {
        html += '<li>' + data.Players[i] + '</li>';
      }
      document.getElementById("lobby_result").innerHTML = html;
      if (heart.lobbybeat < 100) {
        setTimeout(function(){Lobby();},3000);
      };
    })
    .catch((error) => {
      console.error("Error:", error);
    });

    document.getElementById("scode").innerHTML = document.getElementById("lcode").value;
    
}

function Lobby2(hb2) {
  heart.lobbybeat = heart.lobbybeat + 1;
  document.getElementById('hb').innerText = heart.lobbybeat;

  const code = document.getElementById("lcode2").value;
  const name = document.getElementById("lname2").value;
  document.getElementById("name").value = name;
  const request = {
    Game: code,
    Player: name,
  };
  fetch(api_url, {
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
      var html = '';
      for (var i = 0; i < data.Players.length; i++) {
        html += '<li>' + data.Players[i] + '</li>';
      }
      document.getElementById("lobby_result").innerHTML = html;
      if (heart.lobbybeat < 100) {
        setTimeout(function(){Lobby2();},3000);
      };
    })
    .catch((error) => {
      console.error("Error:", error);
    })
    
    document.getElementById("scode").innerHTML = document.getElementById("lcode2").value;
    
    
}

function Game() {
  heart.gamebeat = heart.gamebeat + 1;
  document.getElementById('ghb').innerText = heart.gamebeat;

  const code = document.getElementById("code").value;
  const name = document.getElementById("name").value;
  const lat = document.getElementById("lat").value;
  const long = document.getElementById("long").value;
  const timestamp = document.getElementById("timestamp").value;
  const request = {
    Game: code,
    Player: name,
    Latitude: lat,
    Longitude: long,
    Timestamp: timestamp,
  };
  fetch(api_url, {
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
      document.getElementById("game_result").innerHTML = JSON.stringify(data);
      if (heart.gamebeat < 1000000) {
        setTimeout(function(){Game();},3000);
      };
    })
    .catch((error) => {
      console.error("Error:", error);
    });    
}

// show page methods
function showCreate(c) {
    let code = c;
    let menuScreen = document.getElementById('menu-screen');
    let createScreen = document.getElementById('create-screen');
    let joinScreen = document.getElementById('join-screen');
    let lobbyScreen = document.getElementById('lobby-screen');
    let gameScreen = document.getElementById('game-screen');
    let endScreen = document.getElementById('end-screen');
    let loadScreen = document.getElementById('loading-screen');

    menuScreen.classList.add("hide");
    createScreen.classList.remove("hide");
}

function showLobby() {
  let menuScreen = document.getElementById('menu-screen');
  let createScreen = document.getElementById('create-screen');
  let joinScreen = document.getElementById('join-screen');
  let lobbyScreen = document.getElementById('lobby-screen');
  let gameScreen = document.getElementById('game-screen');
  let endScreen = document.getElementById('end-screen');
  let loadScreen = document.getElementById('loading-screen');

  createScreen.classList.add("hide");
  joinScreen.classList.add("hide");
  lobbyScreen.classList.remove("hide");

  Lobby();
}

function showLobby2() {
  let menuScreen = document.getElementById('menu-screen');
  let createScreen = document.getElementById('create-screen');
  let joinScreen = document.getElementById('join-screen');
  let lobbyScreen = document.getElementById('lobby-screen');
  let gameScreen = document.getElementById('game-screen');
  let endScreen = document.getElementById('end-screen');
  let loadScreen = document.getElementById('loading-screen');

  createScreen.classList.add("hide");
  joinScreen.classList.add("hide");
  lobbyScreen.classList.remove("hide");

  Lobby2();
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

