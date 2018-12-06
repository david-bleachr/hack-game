var setupState = {
    create: function() {
        console.log("Setup Beginning");
        game.state.start('menu');
    }
};

function makeBackground() {
  starfield = game.add.tileSprite(0, 0, gameX*scaleRatio, gameY*scaleRatio, 'starfield');
}
