var GameOver = function(game){};

GameOver.prototype = {
  create: function(){
    var me = this;

    me.particleBurst(me.player.body.position.x + (me.player.body.width / 2), me.player.body.position.y + (me.player.body.height / 2));
    me.player.kill();

    //Wait a little bit before restarting game
    me.game.time.events.add(1000, function(){
        me.game.state.start('Main');
    }, me);
  },
  restartGame: function(){
    this.game.state.start('Main');
  }
};
