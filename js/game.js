/* Here we have the game.js file which will handle all game related requests
loading of sprites
map handling
new player handling
coordinate handling
moving and removing players from session

TODO --
Game.Init
Game.preload
Game.create
Game.addPlayer
*/
var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};
/*We must preload the tilemap, tilesheet, and sprite for the character.
map.json uses json to know what image goes where and how to place it. This reminds me of XML but in a more modern fashion.
the tilesheet contains all of the buildings that are used in the game
the sprite is the character image */
Game.preload = function() {
    game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/map/tilesheet.png',32,32);
    game.load.image('sprite','assets/sprites/sprite.png');
};
/*After we have loaded the images we will need to initilize the game 
some first steps to take into consideration -- We need to create the map object and initilize it with layers, with no layers
I was running into a lot of issues. Since the map is a layered image of sorts the map object will require these same layers.
*/
Game.create = function(){
    Game.playerMap = {}; //Player map initilization, there will be a service that controls adding players to this map
    const map = game.add.tilemap('map'); //add the phaser tile map
    map.addTilesetImage('tilesheet', 'tileset'); //add the tileset, this contains our building images
    var layer;
    /* Something phaser related requires that our map has multiple layers, we can check the number of layers required by using 
    map.layers.length. I believe this is due to the way images are placed on the map in a layer fashion likely from the json file
    */
    for(var i = 0; i < map.layers.length; i++) {
        layer = map.createLayer(i);
    }
    layer.inputEnabled = true; // Allows clicking on the map
    layer.events.onInputUp.add(Game.getCoordinates, this);
    Client.NewPlayer();
};
//init new player by taking the player in the map by ID and setting the sprite
Game.addPlayer = function(id,x,y){
    Game.playerMap[id] = game.add.sprite(x,y,'sprite');
};
//When clicking get and send to client
Game.getCoordinates = function(layer,pointer){
    Client.sendClick(pointer.worldX,pointer.worldY);
};
/*We need to create a basic movement function. This will take in player ID, current location
create necessary objects, compute difference using phaser methods and move character to that location computed 
Tween is an object in phaser which animates smoothy when changing properties rather than a static image. My assumption is that 
we will use tween to move the character*/
Game.movePlayer = function(id,x,y){
    var player = Game.playerMap[id];
    var distance = Phaser.Math.distance(player.x,player.y,x,y);
    var tween = game.add.tween(player);
    var duration = distance*10;
    tween.to({x:x,y:y}, duration);
    tween.start();
};
//Remove disconnected player by calling the game's function to destory the object
Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};