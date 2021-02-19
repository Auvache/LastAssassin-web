// variables /////////////////////////////////////////////////////////////////////////
const api_url = "https://lastapi.stevenrummler.com/";
const heart = {
  gamebeat: 0,
  lobbybeat: 0
}
const user = {
  alive: true,
  kills: 0,
  myLat: 0,
  myLong: 0,
  target: '',
  targetLat: 0,
  targetLong: 0,
  playersAlive: 0,
  marker: '',
  map: '',
}
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 100000
};

// GAME FUNCTIONS /////////////////////////////////////////////////////////////////////

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
      initMap();
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
        setTimeout(function(){Lobby();},1000);
      };
      
    })
    .catch((error) => {
      console.error("Error:", error);
    });

    document.getElementById("scode").innerHTML = document.getElementById("lcode").value;
    
}

function Lobby2() {
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
        setTimeout(function(){Lobby2();},1000);
      };

      if (data.GameStarted == true) {
        document.getElementById("code").value = code;
        heart.lobbybeat = 1000000;
        showGame();
        Game();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    })
    
    document.getElementById("scode").innerHTML = document.getElementById("lcode2").value;
    
    
}

function Game() {
  heart.gamebeat = heart.gamebeat + 1;
  document.getElementById('ghb').innerText = heart.gamebeat;
  getLatLon();

  const code = document.getElementById("code").value;
  const name = document.getElementById("name").value;
  const lat = user.myLat;
  const long = user.myLong;
  const request = {
    Game: code,
    Player: name,
    Latitude: lat,
    Longitude: long,
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
      
      user.alive = data.CurrentlyAlive;
      user.kills = data.CurrentKills;
      user.target = data.TargetName;
      user.targetLat = data.TargetLatitude;
      user.targetLong = data.TargetLongitude;
      user.playersAlive = data.PlayersAlive;

      document.getElementById('target').innerText = user.target;
      document.getElementById('kills').innerText = user.kills;
      document.getElementById('leftAlive').innerText = user.playersAlive;
      document.getElementById('lat').innerText = user.targetLat;
      document.getElementById('long').innerText = user.targetLong;

      mapTargetLocation();
    
      if (heart.gamebeat < 1000000) {
        setTimeout(function(){
          Game();
        },1000);
      };
    })
    .catch((error) => {
      console.error("Error:", error);
    });    
}

// Google Maps functionality

function initMap() {
  const targetLocation = { lat: user.targetLat, lng: user.targetLong };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: targetLocation,
  });
  user.marker = new google.maps.Marker({
    position: targetLocation,
    map: map,
  });
}
function success(pos) {
  var crd = pos.coords;

  user.myLat = crd.latitude
  user.myLong = crd.longitude

  console.log('My lat and long:');
  console.log(user.myLat);
  console.log(user.myLong);

}
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}
function mapTargetLocation() {
  var newLatLng = new google.maps.LatLng(user.targetLat, user.targetLong);
    user.marker.setPosition(newLatLng);
    // user.map.panTo( new google.maps.LatLng(newLatLng) );
}

function getLatLon() {
  navigator.geolocation.getCurrentPosition(success, error, options);
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

  document.getElementById('startBtn').classList.add('hide');

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

