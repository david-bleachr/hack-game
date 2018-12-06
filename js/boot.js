var bootState = {
  preload: function() {

  },
  create: function() {
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();
    console.log("Booted!");
    game.state.start('load');
  }
};
