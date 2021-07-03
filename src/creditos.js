function creditos() {
	var voltar;
	var integ;
	
	this.preload = function () {
		game.load.image("fundo", "assets/Background.png");
        game.load.image("voltar", "assets/BackNovo.png");	
	    game.load.image("integrantes", "assets/integrantes.png");
	};
	
	this.create = function () {
		
		game.add.image(0,0,"fundo");
	
		voltar=game.add.image(40,40,"voltar");
		voltar.scale.x=0.2;
	    voltar.scale.y=0.2;
		voltar.inputEnabled = true;
		voltar.input.useHandCursor = true;
		voltar.events.onInputDown.add(voltarFoiClicado);
		
		integ=game.add.image(17, 200, "integrantes");
		integ.scale.x=0.8;
		integ.scale.y=0.8;
	
		fadeIn();
	};
	
	this.update = function () {
		
	};
	
	function voltarFoiClicado() {
		fadeOut(fadeOutVoltarAcabou);
	}
	
	function fadeOutVoltarAcabou() {
		game.state.start("menu");
}
}