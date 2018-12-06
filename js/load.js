var loadState = {
  preload: function() {
    // Menu Items
    game.load.image('play-button', "assets/menu/play-button.png");

    game.load.image('health', 'assets/health.png');
    game.load.image('rapidShot', 'assets/rapidShot.png');
    game.load.image('starfield', 'assets/starfield.png');
    game.load.image('spreadShot', 'assets/spreadShot.png');
    game.load.image('playerShip', 'assets/player-ship.png');

    game.load.spritesheet('boss', 'assets/boss.png', 122, 110);
    game.load.spritesheet('robot', 'assets/robot.png', 77.5, 63);
    game.load.spritesheet('explosion', 'assets/explode.png', 128, 128);
    game.load.spritesheet('fireball', 'assets/fireball.png', 265, 265, 10);
    game.load.spritesheet('bossProjectile', 'assets/blue-flame.png', 32, 32);
    game.load.spritesheet('playerProjectile', 'assets/tennis-ball.png', 19.75, 19.75);

    this.load.atlas('arcade', 'assets/virtualjoystick/arcade-joystick.png', 'assets/virtualjoystick/arcade-joystick.json');
  },

  create: function() {
    console.log("Loaded!");
    game.state.start('setup');
  }
};
