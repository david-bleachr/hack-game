var menuState = {
	create: function() {
		// Start button
		gameStart = game.add.button(game.world.centerX, game.world.centerY, 'play-button', startClick, this);

		function startClick() {
			game.state.start('main');
		}
	}
}
