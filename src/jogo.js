Poke = function (game, image, x, y, movimento, som) {

    Phaser.Sprite.call(this, game, x, y, image);
	this.animations.add(movimento, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
	this.scale.x = 3;
	this.scale.y = 3;
	this.alpha = 0.75;
	this.inputEnabled = true;
    this.input.start(0, true);
    
	this.move = function(){
		this.animations.play(movimento);
		som.play();
	}
	
	this.stop = function(){
		this.animations.stop();
		som.stop();
	}
	
	game.add.existing(this)
};

Poke.prototype = Object.create(Phaser.Sprite.prototype);
Poke.prototype.constructor = Poke;



Square = function (game, image, x, y) {

    Phaser.Sprite.call(this, game, x , y, image);
	this.scale.x = 0.8;
	this.scale.y = 0.8;
	this.alpha = 0.3;
	this.inputEnabled = true;
    this.input.start(0, true);
    
	this.blink = function(){
    	var flashing = game.add.tween(this).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, 4, true);
	}
	
	game.add.existing(this)
};

Square.prototype = Object.create(Phaser.Sprite.prototype);
Square.prototype.constructor = Square;



Config = function (game, image, x, y, scale) {

    Phaser.Sprite.call(this, game,  x, y, image);
	this.scale.x= scale;
    this.scale.y= scale;
    this.inputEnabled = true;
	this.input.useHandCursor = true;
	game.add.existing(this)
	
};

Config.prototype = Object.create(Phaser.Sprite.prototype);
Config.prototype.constructor = Config;

function jogo() {
	var bulba01;
	var charm01;
	var squir01;
	var pika01;
	var N = 1;
	var pontoText;
	var currentCount = 0;
	var userCount = 0;
	var sequencia = [];
	var quadradoSelecionado;
	var pokeSez = false;
	var loser = false;
	var winner;
	var litSquare;
	var timeCheck;
	var somFundo;
	var podeClicar;

	this.preload = function () {
		game.load.image("tela", "assets/tela_jogo.png");
		game.load.image("voltar", "assets/BackNovo.png");	
		game.load.image("fundo_pontos", "assets/Visor.png");
		game.load.image("som","assets/Sound.png");
		game.load.image("nosom","assets/NoSound.png");
		
		game.load.image("squir_square", "assets/squir_square.png");
		game.load.image("pika_square", "assets/pika_square.png");
		game.load.image("bulba_square", "assets/bulba_square.png");
		game.load.image("charm_square", "assets/charm_square.png");
		
		game.load.spritesheet("bulba01", "assets/001Bulbasaur.png", 43, 41);
		game.load.spritesheet("charm01", "assets/004Charmander.png", 50, 55);
		game.load.spritesheet("squir01", "assets/007Squirtle.png", 49, 53);
		game.load.spritesheet("pika01", "assets/025Pikachu.png", 66.5, 63);
		
		game.load.audio("somFundo", "assets/MM.mp3");
		game.load.audio("pikachu", "assets/pikachu.mp3");
		game.load.audio("bulbasaur", "assets/bulbasaur.mp3");
		game.load.audio("charmander", "assets/charmander.mp3");
		game.load.audio("squirtle", "assets/squirtle.mp3");
	};
	
	this.create = function () {
	    somFundo = game.add.audio("somFundo", 0.2);
	    somFundo.loop = true;
	    
		somSquir = game.add.audio("squirtle", 0.2);
		somPika = game.add.audio("pikachu", 0.2);
		somBulba = game.add.audio("bulbasaur", 0.2);
		somCharm = game.add.audio("charmander", 0.2);

		game.add.image(0,0,"tela");
		voltar = new Config(game, "voltar", 40, 40, 0.2)
		voltar.events.onInputDown.add(voltarFoiClicado);
		
		som = new Config(game, "som", 520, 840, 0.4);
		som.events.onInputDown.add(switchSom);
		som.visible = preferencia_Som;
	    
	    nosom = new Config(game, "nosom", 520, 840, 0.4);
	    nosom.events.onInputDown.add(switchSom);
	    nosom.visible = !preferencia_Som;
	    
	    fundo_recorde = game.add.image(180,10,"fundo_pontos");
		fundo_recorde.scale.x = 0.5;
		fundo_recorde.scale.y = 0.5;
		
		fundo_pontos = game.add.image(-20,800,"fundo_pontos");
		fundo_pontos.scale.x = 0.5;
		fundo_pontos.scale.y = 0.5;
		
		pontos = 0;
		pontoText = game.add.text(75, 860, pontos, { font: "normal 33px 'Press Start 2P'", fill: '#000' });
		pontoText.setText("RODADA  "+ pontos);
		recordeText = game.add.text(265, 70, pontos, { font: "normal 33px 'Press Start 2P'", fill: '#000' });
		recordeText.setText("RECORDE  " + recorde);
		
		squir_square = new Square(game, 'squir_square', 340, 200);
		bulba_square = new Square(game, "bulba_square", 40, 200);
		charm_square = new Square(game, "charm_square", 40, 480);
		pika_square = new Square(game, "pika_square", 340, 480);
			
		bulba01 = new Poke(game, 'bulba01', 105, 270, 'movimentob01', somBulba);
		charm01 = new Poke(game, 'charm01', 105, 520, 'movimentoc01', somCharm);
		squir01 = new Poke(game, 'squir01', 400, 270, 'movimentos01', somSquir);
		pika01 = new Poke(game, 'pika01', 390, 500, 'movimento_p01', somPika);
		
		pokemons = [bulba01, squir01,
					charm01, pika01];
					
		squares = [bulba_square, squir_square,
					charm_square, pika_square];
					
		[pokemons, squares].forEach(function(array){
				array.forEach(function(item, i){
					PokeSquareBehavior(item);
					item.index = i;
				});
			}
		)
		
		podeClicar = false;
		geraQuadrado();
	    setTimeout(function(){
	    	simonSequence()
	    	podeClicar = true;
	    	}, 2000);
		
		restart();
		checkSomPref();
		fadeIn();
		
	};
	
	this.update = function () {
		if(podeClicar && pokeSez) {
			if(game.time.now - timeCheck > 1000 - N*40){
				pokeQuadrado[0].alpha = 0.7;
				pokeQuadrado[0].stop();
				pokeQuadrado[1].alpha = 0.3;
				podeClicar = false;
				setTimeout(function()
	            {
	                if (currentCount < N)
	                {
	                    simonSequence();
	                }
	                else
	                {
	                    pokeSez = false;
	                }
	    			podeClicar = true;
	            }, 400 - N * 20);
			}
		}
	}
	
	this.render = function() {
		if(pontos > recorde){
			recorde = pontos;
			recordeText.setText("RECORDE  " + recorde)
		}
		pontoText.setText("RODADA  "+ pontos);
	};
	
	function playerSequence(selected) {
		
	    quadradoCerto = sequencia[userCount];
	    userCount++;
	    quadradoSelecionado = selected.index;
		
	    if (quadradoSelecionado == quadradoCerto)
	    {
	    	if(userCount == N) {
                userCount = 0;
                currentCount = 0;
                N++;
                console.log("Sequencia: " + N);
                pokeSez = true;
	    	}
	    }
	   	else
	    {
	    	loser = true;
	    	podeClicar = false;
	        setTimeout(function(){
	        	restart();
	        }, 1000);
	    }
	    pontos = N - 1;
	};
	
	function restart() {
		N = 1;
	    userCount = 0;
	    currentCount = 0;
	    sequencia = [];
		if(loser){
			game_over_screen();
		}
	}
	
	function geraQuadrado() {
        novoQuadrado = game.rnd.integerInRange(0,3);
        sequencia.push(novoQuadrado);
	};
	
	function simonSequence () {
		geraQuadrado();
	    pokeSez = true;
	    quadradoPiscando = sequencia[currentCount];
	    console.log("Quadrado Piscando: " + quadradoPiscando);
	    pokeQuadrado = [pokemons[quadradoPiscando], squares[quadradoPiscando]];
	    pokeQuadrado[0].move();
	    pokeQuadrado[0].alpha = 1;
	    pokeQuadrado[1].alpha = 1;
	    timeCheck = game.time.now;
	    currentCount++;
	}

	function select(item, pointer) {
		if(podeClicar && !pokeSez){
			var index = item.index;
			item.checkSelectedFirst = true;
			pokemons[index].move();
			pokemons[index].alpha = 1;
			squares[index].alpha = 0.75;
		}
	};
	
	function release(item, pointer) {
		if(podeClicar && !pokeSez){
			if(item.checkSelectedFirst){
				var index = item.index;
				var pokemon = pokemons[index];
				console.log("Pokemon Selecionado: " + index);
				
				pokemon.alpha = 0.7;
				pokemon.stop();
				squares[item.index].alpha = 0.3;
				playerSequence(item);

				item.checkSelectedFirst = false;
			}	
		}
	};
	
	function moveOff(item, pointer) {
		if(podeClicar && !pokeSez){
			var pokemon = pokemons[item.index];
			pokemon.alpha = 0.7;
			pokemon.stop();
			squares[item.index].alpha = 0.3;
		}
	};
	
	function PokeSquareBehavior(item) {
        item.events.onInputDown.add(select);
        item.events.onInputUp.add(release);
        item.events.onInputOut.add(moveOff);
	};

	function switchSom(){
		preferencia_Som = !preferencia_Som;
		checkSomPref();
	};
	
	function checkSomPref(){
		if(!preferencia_Som){
    		somFundo.stop(); 		
    		somSquir.volume = 0.0;
			somPika.volume = 0.0;
			somBulba.volume = 0.0;
			somCharm.volume = 0.0;
			
 			som.visible = false;
    		nosom.visible = true;
		} else {
    		somFundo.play();
    		somSquir.volume = 0.2;
			somPika.volume = 0.2;
			somBulba.volume = 0.2;
			somCharm.volume = 0.2;
			
			som.visible = true;
    		nosom.visible = false;
		}
	}

	function voltarFoiClicado() {
		fadeOut(fadeOutVoltarAcabou);
	};
	
	function fadeOutVoltarAcabou() {
		somFundo.stop();
		game.state.start("menu");
	};
	
	function game_over_screen() {
		fadeOut(fadeOutGameOverAcabou);
	}
	
	function fadeOutGameOverAcabou() {
		somFundo.stop();
		game.state.start("game_over");
	}

}
