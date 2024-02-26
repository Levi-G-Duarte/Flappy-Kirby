var background;
var startButton;
var gameStarted = false;
var bird;

var mainState = {
    preload: function(){
        // game.load.image('bird', 'assets/bird.png');
        game.load.image('pipe', 'assets/pipe.png');
        game.load.image('spikeBall', 'assets/spikeBall.png');
        game.load.image('kirbyLandscapeEnemy','assets/kirbyLandscapeEnemy.png')
        game.load.spritesheet('kirbySprite', 'assets/kirbySprite.png', 50, 50)
        game.load.audio('jump', 'assets/jump.wav');
        game.load.audio('fall', 'assets/Kirby - Falling Scream Funny (Sound Effe.mp3');
        game.load.audio('hit', 'assets/hitsound_2.mp3');
        game.load.audio('music', 'assets/kirby-dream-land-theme-song.mp3');
    },

    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);

        background = game.add.sprite(0, 0, 'kirbyLandscapeEnemy');
        background.width = game.width;
        background.height = game.height;

        gameMusic = game.add.audio('music')
        jumpSound = game.add.audio('jump');
        fallSound = game.add.audio('fall');
        hitSound = game.add.audio('hit');

        gameMusic.loop = true;

        gameMusic.play();

        

        bird = game.add.sprite(100,245, 'kirbySprite');
        bird.anchor.setTo(0.5,0.5);

        game.physics.arcade.enable(bird);

        bird.body.gravity.y = 0;

        bird.animations.add('flap', [0, 1, 2], 25 , false);

        startButton = game.add.text(game.world.centerX, game.world.centerY, 'Click to Start, Space to Jump', {font:"30px Arial", fill: "#ffffff"});
        startButton.anchor.setTo(0.5, 0.5);
        startButton.inputEnabled = true;
        startButton.events.onInputDown.add(this.startGame, this);


        game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.jump, this);

        // var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // spaceKey.onDown.add(this.jump, this);

        this.pipes = game.add.group();

        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        this.score = 0;
        this.labelScore = game.add.text(20,20, "SCORE:", {font:"30px Arial", fill: "#ffffff"})
        
        this.highScore = localStorage.getItem('highScore') || 0;
        this.labelHighScore = game.add.text(20,60, "HIGH SCORE: " + this.highScore, {font:"30px Arial", fill: "#ffffff"});


    },

    update: function(){
        if(gameStarted){
        if(bird.y < 0 || bird.y > 490){
            fallSound.play();

        }
        if(bird.y < 0 || bird.y > 590){
            fallSound.stop()

        }

        if(bird.y < 0 || bird.y > 650){
        gameMusic.stop();
        this.restartGame();

        }

        game.physics.arcade.overlap(bird, this.pipes, function(){hitSound.play(); gameMusic.stop(); this.restartGame();}, null, this);

        }
    },

    jump: function() {
        if(!gameStarted){
            bird.body.gravity.y = 1000;
            gameStarted = true;
            startButton.destroy();
    
            }

        if(gameStarted){

        bird.body.velocity.y = -350;
        bird.animations.play('flap');
        jumpSound.play();

        }
    },

    startGame: function(){
        bird.body.gravity.y = 1000;
        gameStarted = true;
        startButton.destroy();
    },

    restartGame: function(){
        // bird.destroy();
        // this.pipes.destroy(true,true);
        game.state.start('main');

        var gameOverText = game.add.text(game.world.centerX, game.world.centerY - 50, 'Game Over\nHigh Score: ' + this.highScore, {font:"30px Arial", fill:"#ffffff", align: "center"});
        gameOverText.anchor.setTo(0.5, 0,5);
    },

    addOnePipe: function(x,y, velocity) {
        var pipe = game.add.sprite(x, y, 'spikeBall');

        this.pipes.add(pipe);

        game.physics.arcade.enable(pipe);

        pipe.body.velocity.x = -250;

        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function(){
        var hole = Math.floor(Math.random() * 5) + 1;
        for(var i = 0; i < 8; i++){
            if(i != hole && i != hole + 1){
                this.addOnePipe(500, i*60 + 10);
            }
        }
        this.score += 1;
        this.labelScore.text = "SCORE: " + this.score;


        this.increasePipeVelocity();

        if(this.score > this.highScore){
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
            this.labelHighScore.text = "HIGHSCORE: " + this.highScore;
        }

    },

    increasePipeVelocity: function() {
        this.pipes.forEach(function(pipe){pipe.body.velocity.x = -300;}, this);
    },

};

var game = new Phaser.Game(500,490);

game.state.add('main', mainState);

game.state.start('main')