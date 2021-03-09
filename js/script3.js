// variables /////////////////////////////////////////////////////////////////

const api_url = "https://api.lastassassin.app/";
const session = {
  attemptcd: 5,
  delay: 10,
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
  living: true,
  playersalive: 0,
  tags: 0,
  targetlat: 40.2338889,
  targetlong: -111.6577778,
  targetname: '',
  targetdistance: 0,
  hunter: '',
  status: '',
}
const heartbeat = {
  lobby: 0,
  game: 0,
  lobbyDead: false,
  gameDead: false,
}  


// main game functionality methods ////////////////////////////////////////////////

function call(request, route) {
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
      if (response.status == 200) {
        return response.json();
      } else {
        return response;
      }
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
        session.players = data.Players;
        var html = '';
        for (var i = 0; i < data.Players.length; i++) {
          html += '<li>' + data.Players[i] + '</li>';
        }
        document.getElementById("lobby_result").innerHTML = html;

        if (heartbeat.lobby < 1000) {
          setTimeout(function(){Host();},2000);
        } else { 
          StartGame();
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

      if(route == "game") {
        if (data.Countdown > 0) {
          document.getElementById('countdown').innerText = data.Countdown;
        } else {
          player.living = data.Living;
          player.tags = data.Tags;
          player.targetname = data.TargetName;
          player.targetlat = data.TargetLat;
          player.targetlong = data.TargetLong;
          player.playersalive = data.PlayersAlive;
          player.targetdistance = distance(player.lat, player.long, player.targetlat, player.targetlong)
          player.hunter = data.Pending;
          player.status = data.Status;
        }

        if (data.LastStanding) {
          heartbeat.game = 100000000;
        }

        if (heartbeat.game < 10000000) {
          setTimeout(function(){Game();},1000);
        } else {
          document.getElementById("last_standing").innerText = data.LastStanding;
          var html = '';
          for (var i = 0; i < session.players.length; i++) {
            html += '<li>' + session.players[i] + ': ' + data.FinalScores[session.players[i]] + '</li>';
          }
          document.getElementById("end_result").innerHTML = html;
          // document.getElementById("end_result").innerHTML = data.FinalScores;
          console.log(data.FinalScores);
          EndGame();
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });

    if (route == "start") {
      showGame();
    }
}

function Create() {
  session.host = document.getElementById('host').value;
  const request = {
    Host: session.host,
  };
  call(request, "create");
}

function distance(lat1, lon1, lat2, lon2) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		dist = dist * 1609.344
		return dist;
	}
}

function EndGame() {

  showEnd();

}

function Game() {

  if (heartbeat.game > 0) {
    document.getElementById('target').innerText = player.targetname;
    document.getElementById('kills').innerText = player.tags ;
    document.getElementById('leftAlive').innerText = player.playersalive;
    document.getElementById('targetLat').innerText = player.targetlat;
    document.getElementById('targetLong').innerText = player.targetlong;
    document.getElementById('targetDistance').innerText = player.targetdistance;
  }

  heartbeat.game = heartbeat.game + 1;
  document.getElementById('ghb').innerText = heartbeat.game;

  // if (player.Pending != "") {
  //   document.getElementById('confirmBtn').classList.remove('hide');
  // }

  // get player latitude and longitude
  navigator.geolocation.getCurrentPosition(function(location) {
    player.lat = location.coords.latitude;
    player.long = location.coords.longitude;
    console.log(location.coords.latitude);
    console.log(location.coords.longitude);
    console.log(location.coords.accuracy);
  });

  const request = {
    Game: session.game,
    Player: player.name,
    Latitude: player.lat,
    Longitude: player.long,
  };
  call(request, "game");
}

function Host() {
  heartbeat.lobby = heartbeat.lobby + 1;
  // document.getElementById('hb').innerText = heartbeat.lobby;
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
  call(request, "host");  
}

function Lobby() {
  heartbeat.lobby = heartbeat.lobby + 1;
  // document.getElementById('hb').innerText = heartbeat.lobby;

  const request = {
    Game: session.game,
    Player: player.name,
  };
  call(request, "lobby");
}

function Kill() {
  const request = {
    Game: session.game,
    Player: player.name,
  };
  call(request, "tag");
}

function KillLobby() {
  heartbeat.lobby = 1000000;
}

function StartGame() {
  const request = {
    Game: session.game,
    Player: player.name,
    HomeLat: player.lat,
    HomeLong: player.long,
  };
  call(request, "start");
}

function Verify() {
  const request = {
    Game: session.game,
    Player: player.name,
    Hunter: player.hunter,
    Accept: true,
  };
  call(request, "verify");
}


// show page methods ////////////////////////////////////////////////////////

function showCreate() {
  document.getElementById('menu-screen').classList.add("hide");
  document.getElementById('create-screen').classList.remove("hide");
}

function showEnd() {
  document.getElementById('game-screen').classList.add("hide");
  document.getElementById('end-screen').classList.remove("hide");
}

function showGame() {
  document.getElementById('lobby-screen').classList.add("hide");
  document.getElementById('game-screen').classList.remove("hide");
  Game();
}

function showJoin() {
  document.getElementById('menu-screen').classList.add("hide");
  document.getElementById('join-screen').classList.remove("hide");
}

function showLobby() {
  document.getElementById('create-screen').classList.add("hide");
  document.getElementById('join-screen').classList.add("hide");
  document.getElementById('lobby-screen').classList.remove("hide");
}

function showLobby2() {
  document.getElementById('startBtn').classList.add('hide');
  document.getElementById('create-screen').classList.add("hide");
  document.getElementById('join-screen').classList.add("hide");
  document.getElementById('lobby-screen').classList.remove("hide");
  session.game = document.getElementById('lcode2').value;
  player.name = document.getElementById('lname2').value;
  document.getElementById('lcode').innerText = session.game
  Lobby();
}