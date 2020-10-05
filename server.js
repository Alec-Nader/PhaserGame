/*TODO--
node modules
serve static files
socket.IO connection */
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
//creating required modules
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));
//serving static files and serving index.html below for the client.js
app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.existingPlayerID = 0;
//Setting the port to listen on 8080, connection can be made at http://localhost:8080/
server.listen(process.env.PORT || 8080,function(){
    console.log('Listening on '+server.address().port);
});
//My first time using socket.io, we will open a socket connection
io.on('connection',function(socket){
//When there is a new player, open socket and initilize player with ID and random position
    socket.on('newplayer',function(){
        socket.player = {
            id: server.existingPlayerID++,
            x: Math.floor(Math.random() * 200),
            y: Math.floor(Math.random() * 200)
        };
        //We will need to emit a custom event which will broadcast the new player to the server
        socket.emit('allplayers',getAllPlayers());
        socket.broadcast.emit('newplayer',socket.player);
        //This binds the click action to move the character on the screen
        socket.on('click',function(location){
            socket.player.x = location.x;
            socket.player.y = location.y;
            io.emit('move',socket.player);
        });
        //Disconnection handling to remove the socket from the player who disconnected
        socket.on('disconnect',function(){
            io.emit('remove',socket.player.id);
        });
    });
});
/*Create a service which will find all available sockets and get the connected player ID
return the array of player IDs 
This is a service created to view all of the current players in the server/connected to the socket.*/
function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}