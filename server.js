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
let socketcheck = {}
let usernamecheck = {}
var timer = 60
var starttime = false
let playerskipcount = 0
let Mytimer = 0

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
  socket.broadcast.emit('other:connection', {message:'hello friends!'});
  socket.on('disconnect', function(data) {
    for(let i = 0; i < players.length; i++){
      if(players[i].data.username === socketcheck[socket.id]){
         players.splice(i, 1);
         io.emit('update', {players: players, deck: deck})
      }
    }
    let uname = socketcheck[socket.id]
    usernamecheck[uname] = 0
    if(players.length == 0){
      starttime = false
      timer = 60
      clearInterval(Mytimer)
    }
   })
  socket.on('checkUsername', function(uname){
    if(usernamecheck[uname] === 1){
      socket.emit('loginPassFail', {username: uname, pass: false})
    }
    else{
      socket.emit('loginPassFail', {username: uname, pass: true})
    }
  })
  socket.on('updategame', function(data){
  	if(socketcheck[socket.id]){
      for(let i = 0; i < players.length; i++){
        if(players[i].data.username == socketcheck[socket.id]){
          players[i] = data
        }
      }
    }
  	else{
      timer = 60
  		players.push(data)
      socketcheck[socket.id] = data.data.username
      usernamecheck[data.data.username] = 1
  	}
    if(!starttime){
      Mytimer = setInterval(countdown, 1000)
      starttime = true
    }
    io.emit('update', {players: players, deck: deck})
  })
  socket.on('shuffle', function(){
    timer = 60
  	deck.shuffle()
  	io.emit('shuffled', {deck: deck})
  }) 
  socket.on('skipCount', function(){
    playerskipcount++
    if(playerskipcount === players.length){
      deck.shuffle()
      timer = 60
      playerskipcount = 0
      io.emit('shuffled', {deck: deck})
    }
  })
  socket.on('winGame', function(uname){
    clearInterval(Mytimer)
    starttime = false
    players = []
    deck.shuffle()
    io.emit('endGame', {winner: uname})
  })
  socket.on('newGame', function(data){
    timer = 60
    if(!starttime){
      Mytimer = setInterval(countdown, 1000)
      starttime = true
    }
    players.push(data)
    io.emit('update', {players: players, deck: deck})
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
















