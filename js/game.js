var gameX = 375;
var gameY = 667;
var canvas_x = window.innerWidth;
var canvas_y = window.innerHeight;
var scaleRatio = Math.min(canvas_x / gameX, canvas_y / gameY);

var game = new Phaser.Game(gameX * scaleRatio, gameY * scaleRatio, Phaser.CANVAS);

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('main', mainState);
game.state.add('setup', setupState);
game.state.add('menu', menuState);

game.state.start('boot');
