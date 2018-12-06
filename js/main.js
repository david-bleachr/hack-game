// ADD STAGES
var mainState = {
  preload: function() {
    makeBackground();
  },

  create: function() {
    createScore();
    createControlls();
    createExplosions();
    createPlayer();
    createRobots();
    createFireballs();
    initateFireballs(5);
  },

  update: function() {
    starfield.tilePosition.y += 5;

    // Controller Input
    var maxSpeed = 550;
    if (stick.isDown) {
      game.physics.arcade.velocityFromRotation(stick.rotation, stick.force * maxSpeed, player.body.velocity);
    } else {
      player.body.velocity.set(0);
    }

    if (buttonA.isDown) {
      shootBall();
    }

    // Level Stages
    var robotsLiving = robots.countLiving()
    if (!stages.robotsStart.ended && (robotsLiving / robots.children.length) === .5) {
    console.log("FIRST ENDED");
      stages.robotsStart.ended = true;
      initateFireballs(5);
      initatePowerUps(5);
    }

    if (stages.robotsStart.ended && !stages.robotsHalf.started) {
    console.log("HALF STARTED");
      stages.robotsHalf.started = true;
      initateFireballs(1);
      initatePowerUps(3);
    }

    if (!stages.robotsHalf.ended && robotsLiving === 0) {
    console.log("HALF ENDED");
      stages.robotsHalf.ended = true;
    }

    if (stages.robotsHalf.ended && !stages.increaseFireballs.started) {
    console.log("FIRE STARTED");
      stages.increaseFireballs.endTime = game.time.time + (10 * 1000);
      stages.increaseFireballs.started = true;

      projectileFireballCreator.delay = 500;
    }

    if (stages.increaseFireballs.started
          &&
        !stages.increaseFireballs.ended
          &&
        stages.increaseFireballs.endTime < game.time.time) {
    console.log("FIRE OVER", projectileFireballCreator);
      stages.increaseFireballs.ended = true;
    }

    if (stages.increaseFireballs.ended && !stages.boss.started) {
    console.log("boss STARTED");
      createBoss();
      projectileFireballCreator.delay = 1000;

       stages.boss.started = true;
    }

    // Collisons
    game.physics.arcade.overlap(powerUps, player, collectPowerUp, null, this);
    game.physics.arcade.overlap(playerProjectiles, robots, destroyRobotHandler, null, this);
    game.physics.arcade.overlap(robots, player, reducePlayerHealth, null, this);
    game.physics.arcade.overlap(playerProjectiles, boss, reduceBossHealth, null, this);
    // game.physics.arcade.overlap(bossProjectiles, player, reducePlayerHealth, null, this);
    game.physics.arcade.overlap(fireballs, player, reducePlayerHealth, null, this);
  }
};


var powerUps;
var projectileFireballCreator;

var stages = {
  robotsStart: {
    started: true,
    ended: false
  },
  robotsHalf: {
    started: false,
    ended: false
  },
  increaseFireballs: {
    started: false,
    ended: false,
    endTime: 0
  },
  boss: {
    started: false,
    ended: false
  }
}

// Game
var score = 0;
var scoreString = '';
var scoreText;
var explosions;

function createScore() {
  scoreString = 'Score : ';
  scoreText = game.add.text(10, 10, scoreString + score, { font: '48px Arial', fill: '#fff' });
}

function createExplosions() {
  explosions = game.add.group();
  explosions.createMultiple(30, 'explosion');
  explosions.forEach(setupRobot, this);
}

// Controller
var stick;
var buttonA;
var buttonB;
function createControlls() {
  pad = game.plugins.add(Phaser.VirtualJoystick);
  stick = pad.addStick((game.world.width * .25), (game.world.height * .90), 100, 'arcade');
  stick.scale = scaleRatio / 2;

  buttonA = pad.addButton((game.world.width * .65), (game.world.height * .90), 'arcade', 'button1-up', 'button1-down');
  buttonA.scale = scaleRatio / 2;

  buttonB = pad.addButton((game.world.width * .85), (game.world.height * .85), 'arcade', 'button2-up', 'button2-down');
  buttonB.scale = scaleRatio / 2;

  powerUps = game.add.group();
  powerUps.enableBody = true;
}

// Player
var player;
var playerHealth = 100;
var playerProjectiles;
var playerProjectileTime = 0;
var currentWeapon = 'basic';

function createPlayer() {
  player = game.add.sprite((game.world.width * .50), (game.world.height * .80), 'playerShip');
  player.anchor.setTo(.5, 1);
  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.collideWorldBounds = true;

  createHealthBar();
  createPlayerProjectiles();
}

function createHealthBar() {
  var bmd = game.add.bitmapData(150, 15);
  bmd.ctx.beginPath();
  bmd.ctx.rect(0, 0, 180, 30);
  bmd.ctx.fillStyle = '#00ff11';
  bmd.ctx.fill();

  healthBar = game.add.sprite((game.world.width * .57), (game.world.height * .10), 20, bmd);
  healthBar.anchor.setTo(0, .5);
}

function createPlayerProjectiles() {
  playerProjectiles = game.add.group();
  playerProjectiles.enableBody = true;
  playerProjectiles.physicsBodyType = Phaser.Physics.ARCADE;
  playerProjectiles.createMultiple(100, 'playerProjectile');
  playerProjectiles.setAll('anchor.x', 0.5);
  playerProjectiles.setAll('anchor.y', 1);
  playerProjectiles.setAll('outOfBoundsKill', true);
  playerProjectiles.setAll('checkWorldBounds', true);
}

function shootBall() {
  switch (currentWeapon) {
    case 'basic':
      if (game.time.now > playerProjectileTime) {
        playerProjectile = playerProjectiles.getFirstExists(false);
        if (playerProjectile) {
          playerProjectile.scale.setTo(1.75, 1.75);
          playerProjectile.reset(player.x, player.y - 100);
          playerProjectile.body.velocity.y = -500;
          playerProjectileTime = game.time.now + 200;
        }
      }
      break;
    case 'rapidShot':
      if (game.time.now > playerProjectileTime) {
        playerProjectile = playerProjectiles.getFirstExists(false);
        if (playerProjectile) {
          playerProjectile.scale.setTo(1.75, 1.75);
          playerProjectile.reset(player.x, player.y - 100);
          playerProjectile.body.velocity.y = -400;
          playerProjectileTime = game.time.now + 50;
        }
      }
      break;
    case 'spreadShot':
      if (game.time.now > playerProjectileTime) {
        playerProjectile = playerProjectiles.getFirstExists(false);
        if (playerProjectile) {
          playerProjectile.scale.setTo(1.75, 1.75);

          var i;
          for (i = 0; i < 3; i++) {
            playerProjectile = playerProjectiles.getFirstExists(false);
            playerProjectile.scale.setTo(1.75, 1.75);
            playerProjectile.reset(player.x, player.y - 100); // where shot is fired
            playerProjectile.body.velocity.y = -400;
            playerProjectile.body.velocity.x = (i * -50);
            playerProjectileTime = game.time.now + 200; // change shot rate

            if (i === 1) {
              playerProjectile.body.velocity.x = 50;
            } else if (i === 2) {
              playerProjectile.body.velocity.x = -50;
            }
          }
        }
      }
      break;
    default:
  }
}

function reducePlayerHealth(player, fireball) {
  fireball.kill();

  if (healthBar.width > 0) {
    healthBar.width -= 15;
    healthBar.alpha -= (healthBar.alpha * .1);

    var explosion = explosions.getFirstExists(false);
    explosion.scale.setTo(0.15, 0.15)
    explosion.reset(player.x, player.y);
    explosion.play('explosion', 60, false, true);

    shake(0.01, 100);
  } else {
    var explosion = explosions.getFirstExists(false);
    explosion.scale.setTo(1, 1)
    explosion.reset(player.x, player.y);
    explosion.play('explosion', 10, false, true);
    player.kill();
  }
}


// Robots
function createRobots() {
  robots = game.add.group();
  robots.enableBody = true;
  robots.physicsBodyType = Phaser.Physics.ARCADE;


  for (var y = 0; y < 4; y++) {
    for (var x = 0; x < 4; x++) {
      var robot = robots.create(x * 150, y * 125, 'robot');
      robot.scale.setTo(1.75,1.75);
      robot.anchor.setTo(0.5, 0.5);
      robot.animations.add('fly', [ 0, 1, 2, 3 ], 10, true);
      robot.play('fly');
      robot.body.allowGravity = true;
      robot.body.gravity.y = 3;
    }
  }

  robots.x = 100;
  robots.y = 50;
  robots.setAll('outOfBoundsKill', true);
  robots.setAll('checkWorldBounds', true);

  var tween = game.add.tween(robots).to( { x: gameX  }, 2000, Phaser.Easing.Linear.None, true, 0, 10, true);
  stageInitated = true
}

function destroyRobotHandler(playerProjectile, robot) {
  playerProjectile.kill();
  robot.kill();

  score += 100;
  scoreText.text = scoreString + score;

  var explosion = explosions.getFirstExists(false);
  explosion.reset(robot.body.x, robot.body.y);
  explosion.play('explosion', 30, false, true);
}

function setupRobot(robot) {
  robot.animations.add('explosion');
}

// Fireballs
function createFireballs() {
  fireballs = game.add.group();
  fireballs.enableBody = true;
  fireballs.physicsBodyType = Phaser.Physics.ARCADE;
}

function generateFireballs() {
  var xAxis = ((game.world.width - 75) * Math.random());
  var fireball = fireballs.create(66, 50, 'fireball');
  var travelSpeed = getRandomInt((game.world.height * .25), (game.world.height * .95))

  fireball.anchor.setTo(0.5, 0.5);
  fireball.animations.add('fly', [ 0,1,2,3,4,5,6,7,8,9,10 ], 30, true);
  fireball.play('fly');
  fireball.body.allowGravity = true;
  fireball.body.gravity.y = travelSpeed;

  fireball.y = -100;
  fireball.x = xAxis;
}

function initateFireballs(interval) {
  projectileFireballCreator = game.time.events.loop(
    Phaser.Timer.SECOND * interval,
    generateFireballs,
    this
  );
}


// Power Ups
function createPowerUps() {
  fireballs = game.add.group();
  fireballs.enableBody = true;
  fireballs.physicsBodyType = Phaser.Physics.ARCADE;
}

function generatePowerUps() {
  const powerUpSelection = getRandomInt(0, 10);

  var xAxis = (game.world.width * Math.random());
  var fallRate = getRandomInt(75, 200);

  if (powerUpSelection === 2) {
    powerUp = powerUps.create(xAxis, 0, "health");
    powerUp.body.velocity.y = fallRate;
    powerUp.alpha = 0.5;
  } else if ((powerUpSelection % 2) === 0 && currentWeapon != "rapidShot") {
    powerUp = powerUps.create(xAxis, 0, "rapidShot");
    powerUp.scale.setTo(1.5, 1.5);
    powerUp.body.velocity.y = fallRate;
    powerUp.alpha = 0.5;
  } else if ((powerUpSelection % 2) === 1 && currentWeapon != "spreadShot") {
    powerUp = powerUps.create(xAxis, 0, "spreadShot");
    powerUp.scale.setTo(1.5, 1.5);
    powerUp.body.velocity.y = fallRate;
    powerUp.alpha = 0.5;
  }
}

function initatePowerUps(interval) {
  this.projectilePowerUpCreator = game.time.events.loop(
    Phaser.Timer.SECOND * interval,
    generatePowerUps,
    this
  );
}

function collectPowerUp(player, projectilePowerUp) {
  if (projectilePowerUp.key === "health") {
    healthBar.width = 150
  } else {
    currentWeapon = projectilePowerUp.key;
  }

  projectilePowerUp.kill();
}

// Boss
var boss;
var bossLife = 20;
var bossProjectile;
var bossProjectileTime = 0;

function createBoss() {
  bossGroup = game.add.group();
  bossGroup.enableBody = true;
  bossGroup.physicsBodyType = Phaser.Physics.ARCADE;

  boss = bossGroup.create(66, 50, 'boss');
boss.scale.setTo(1.75, 1.75);
  boss.anchor.setTo(0.5, 0.5);
  boss.animations.add('fly', [ 0, 1, 2, 3 ], 5, true);
  boss.play('fly');

  boss.x = 125;
  boss.y = 150;

  // moving boss around
  var tween = game.add.tween(boss).to( { x: (game.world.width - 200) }, 2000,  Phaser.Easing.Back.InOut, true, 0, 1000, true);
}

function reduceBossHealth(boss, playerProjectile) {
  playerProjectile.kill();

  if (bossLife > 0) {
    bossLife -= 1;
    var explosion = explosions.getFirstExists(false);
    explosion.scale.setTo(0.15, 0.15)
    explosion.reset(boss.x, boss.y);
    explosion.play('kaboom', 60, false, true);
  } else {
    var explosion = explosions.getFirstExists(false);
    explosion.scale.setTo(1, 1)
    explosion.reset(boss.x, boss.y);
    explosion.play('kaboom', 10, false, true);
    boss.kill();
  }
}

// Utility functions
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function shake(intensity, duration) {
  game.camera.shake(intensity, duration);
}
