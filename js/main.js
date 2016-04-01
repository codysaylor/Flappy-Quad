var Main = function(game){

};

Main.prototype = {
  create: function(){
    var me = this;

    //Add a platforms group to hold all of our tiles, and create a bunch of them
    me.platforms = me.game.add.group();
    me.platforms.enableBody = true;
    me.platforms.createMultiple(50, 'tile');

    me.breakables = me.game.add.group();
    me.breakables.enableBody = true;
    me.breakables.createMultiple(20, 'tile2');

    //Enable cursor keys so we can create some controls
    me.cursors = me.game.input.keyboard.createCursorKeys();

    //Set the speed for the platforms
    me.tileSpeed = -450;

    //Set the initial score
    me.score = 0;

    me.createScore();

    //Get the dimensions of the tile we are using
    me.tileWidth = me.game.cache.getImage('tile').width;
    me.tileHeight = me.game.cache.getImage('tile').height;

    //Set the background colour to blue
    me.game.stage.backgroundColor = '479cde';

    //Enable the Arcade physics system
    me.game.physics.startSystem(Phaser.Physics.ARCADE);

    //Add the player to the screen
    me.createPlayer();

    //Add an initial platform
    me.addPlatform();

    //Add a platform every 3 seconds
    me.timer = game.time.events.loop(3000, me.addPlatform, me);

    //Add particle emitter for death animation
    me.emitter = game.add.emitter(0, 0, 20);
    me.emitter.makeParticles('explode');
    me.emitter.gravity = 200;
  },
  update: function(){
    var me = this;

    //Make the sprite jump when the up key is pushed
    if(me.cursors.up.isDown) {
        me.player.body.velocity.y -= 70;
    }

    //Make the sprite collide with the ground layer
    me.game.physics.arcade.overlap(me.player, me.platforms, me.gameOver, null, me);
    me.game.physics.arcade.collide(me.player, me.breakables, me.collideTile, null, me);
    me.game.physics.arcade.collide(me.breakables, me.platforms);
  },
  gameOver: function(){
    var me = this;

    me.particleBurst(me.player.body.position.x + (me.player.body.width / 2), me.player.body.position.y + (me.player.body.height / 2));
    me.player.kill();

    //Wait a little bit before restarting game
    me.game.time.events.add(1000, function(){
        me.game.state.start('Main');
    }, me);
  },
  createPlayer: function(){
    var me = this;
    //Add the player to the game by creating a new sprite
    me.player = me.game.add.sprite(me.game.world.centerX / 2, me.game.world.centerY, 'player');

    //Set the players anchor point to be in the middle horizontally
    me.player.anchor.setTo(0.5, 0.5);

    //Enable physics on the player
    me.game.physics.arcade.enable(me.player);

    //Make the player fall by applying gravity
    me.player.body.gravity.y = 2000;

    //Make the player collide with the game boundaries
    me.player.body.collideWorldBounds = true;

    //This means the players velocity will be unaffected by collisions
    me.player.body.immovable = true;
  },
  addTile: function(x, y, immovable){
    var me = this;

    //Get a tile that is not currently on screen
    if(immovable){
      var tile = me.platforms.getFirstDead();
    } else {
      var tile = me.breakables.getFirstDead();
    }

    //Reset it to the specified coordinates
    tile.body.gravity.y = 0;
    tile.reset(x, y);
    tile.body.velocity.x = me.tileSpeed;
    tile.body.immovable = immovable;

    //When the tile leaves the screen, kill it
    tile.checkWorldBounds = true;
    tile.outOfBoundsKill = true;
},
addPlatform: function(){
    var me = this;

    //Speed up the game to make it harder
    me.tileSpeed -= 40;

    //Work out how many tiles we need to fit across the whole screen
    var tilesNeeded = Math.ceil(me.game.world.height / me.tileHeight);

    //Add a hole randomly somewhere
    var hole = Math.floor(Math.random() * (tilesNeeded - 3)) + 1;

    //Keep creating tiles next to each other until we have an entire row
    //Don't add tiles where the random hole is
    for (var i = 0; i < tilesNeeded; i++){
      if (i != hole && i != hole + 1 && i != hole + 2 && i != hole + 3){
        me.addTile(me.game.world.width - me.tileWidth, i * me.tileHeight, true);
      } else {
        me.addTile(me.game.world.width - me.tileWidth, i * me.tileHeight, false);
      }
    }
    me.incrementScore();
  },
  collideTile: function(player, tile){
    tile.body.gravity.y = 2000;
  },
  particleBurst: function(x, y){
    var me = this;
    me.emitter.x = x;
    me.emitter.y = y;
    me.emitter.start(true, 2000, null, 20);
  },
  createScore: function(){
    var me = this;
    var scoreFont = "100px Arial";
    me.scoreLabel = me.game.add.text((me.game.world.centerX), 100, "0", {font: scoreFont, fill: "#fff"});
    me.scoreLabel.anchor.setTo(0.5, 0.5);
    me.scoreLabel.align = 'center';
  },

  incrementScore: function(){
      var me = this;
      me.score += 1;
      me.scoreLabel.text = me.score;
  },
};
