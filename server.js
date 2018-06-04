var express = require("express");
var path = require("path");
var app = express();
var bodyParser = require('body-parser');

function Deck(){
  this.deck = []
  const suits = ['S', 'H', 'D', 'C']
  for(var i = 1; i < 11; i ++){
  		for(var j = 0; j < suits.length; j++){
  			this.deck.push({id: i+suits[j], value: i, clicked: false, sub: "Red_Back"})
  		}
  	}
  this.shuffle = function(){
    for(var i=0; i<this.deck.length; i++){
      let rand = Math.floor(Math.random()*40)
      let temp = this.deck[i]
      this.deck[i] = this.deck[rand]
      this.deck[rand] = temp
    }
    return this
  } 
} 
let deck = new Deck().shuffle()
let players = []
var timer = 60
var starttime = false

app.use(bodyParser.json());
app.use(express.static( __dirname + '/client/dist' ));

app.all("*", (req,res,next) => {
  res.sendFile(path.resolve("./client/dist/index.html"))
});

var server = app.listen(8000, function() {
 console.log("listening on port 8000");
});
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  console.log("Client/socket is connected!");
  console.log("Client/socket id is: ", socket.id);
  socket.broadcast.emit('other:connection', {message:'hello friends!'});
  socket.on('disconnect', function(data) {
      var i = players.indexOf(socket);
      players.splice(i, 1);
      io.emit('update', {players: players, deck: deck})
   })
  socket.on('startgame', function(data){
  	let inplayers = false
  	for(let i = 0; i < players.length; i++){
  		if(players[i].data.username === data.data.username){
  			players[i] = data
  			inplayers = true
  		}
  	}
  	if(!inplayers){
  		players.push(data)
  	}
    if(!starttime){
      setInterval(countdown, 1000)
      starttime = true
    }
    io.emit('update', {players: players, deck: deck})
  })
  socket.on('shuffle', function(){
    timer = 60
  	deck.shuffle()
  	io.emit('shuffled', {deck: deck})
  }) 
  function countdown(){
    if(timer > 0){
      io.emit('timer', { countdown: timer })
      timer--;
    }
    else{
      io.emit('timer', { countdown: timer })
      timer = 60
      deck.shuffle()
      io.emit('shuffled', {deck: deck})
    }
  }
  ;

  io.sockets.on('connection', function (socket) {  
    socket.on('reset', function (data) {
      countdown = 1000;
      io.sockets.emit('timer', { countdown: timer });
    });
  });
}) 
















