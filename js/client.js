/* TODO:
The client is the main connection between server and player(s)
Requires Socket.IO connection
must emit players and player actions
*/
var Client = {};
Client.socket = io.connect();
//Creating required modules

//emit newplayer to all sockets
Client.NewPlayer = function(){
    Client.socket.emit('newplayer');
};
//for movement to occur the socket must emit a click action with x,y coordinates
Client.sendClick = function(x,y){
  Client.socket.emit('click',{x:x,y:y});
};
//adding newplayer into the game object constructor requires id, x,y coordinate to init
Client.socket.on('newplayer',function(playerData){
    Game.addPlayer(playerData.id,playerData.x,playerData.y);
});
/* We will need controllers for player activity
adding all players to the game
if a player moves
if a player disconnects*/
Client.socket.on('allplayers',function(allPlayersData){
    for(var i = 0; i < allPlayersData.length; i++){
        Game.addPlayer(allPlayersData[i].id,allPlayersData[i].x,allPlayersData[i].y);
    }

    Client.socket.on('move',function(movementData){
        Game.movePlayer(movementData.id,movementData.x,movementData.y);
    });

    Client.socket.on('remove',function(playerId){
        Game.removePlayer(playerId);
    });
});


