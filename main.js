var AM = new AssetManager();
function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse, scale) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {

    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * this.scale,
                  this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}



function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};


function Bird(game, spriteSheet, height, state, scale) {
    this.animation = new Animation(spriteSheet, 0, 0, 854, 480, .3, 4, true, false, scale);
    this.height = height;
    this.speed = 50;
    this.state = state;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, height);
}
Bird.prototype = new Entity();
Bird.prototype.constructor = Bird;

Bird.prototype.update = function() {
    this.x += this.game.clockTick * this.speed;
    if (this.x > 800) this.x = -230;
    if( this.x > 300 && this.state === 'p') {
        this.game.addEntity(new Bird(this.game, AM.getAsset("./img/bird.png"), this.height, 'n', .1));
        this.state = 'n';
    }
    Entity.prototype.update.call(this);
}
Bird.prototype.draw = function() {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);

}



function Zombie(game, spritesheet, direction) {
    
    this.speed = 25;
    this.ctx = game.ctx;
    this.direction = direction;
    this.animation = new Animation(spritesheet, 0, 0, 430, 540, .1, 10, true, false, .2);
    
    if(direction === 0) {
        Entity.call(this, game, 0, 600);
    } else {
        Entity.call(this, game, 800, 600);
    }

    //}else {
        //this.animation = new Animation(spritesheet, 0, 0, 409, 539, 1, 10, true, false, .25);
      //  Entity.call(this, game, 700, 650);
    //}
    

}
Zombie.prototype = new Entity();
Zombie.prototype.constructor = Zombie;

Zombie.prototype.update = function() {
    
    if(this.direction === 1) {
        this.x -= this.game.clockTick * this.speed;
    } else {
        this.x += this.game.clockTick * this.speed;
    }

    if (this.x > 800 && this.direction === 0) {
        this.x = -230;
    } else if(this.x < 0 && this.direction === 1) {
        this.x = 850;
    }

    
    Entity.prototype.update.call(this);
}
Zombie.prototype.draw = function() {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);

}
function Owlkin(game) {
    this.animation = new Animation(AM.getAsset("./img/Owlet.png"), 0, 0, 31, 34, .2, 6, true, false, 2);
    this.idle = true;
    this.speed = 100;
    //this.idle_animation = new Animation(AM.getAsset("./img/Owlet.png"), 0, 0, 30, 32, .1, 2, true, false, 1);
    Entity.call(this, game, 300, 635);
}
Owlkin.prototype = new Entity();
Owlkin.prototype.constructor = Owlkin;
Owlkin.prototype.update = function () {
    if( this.game.inputArray[2] === true) {
        this.idle = false;
        this.x += this.game.clockTick * this.speed;

    }else if( this.game.inputArray[3] === true) {
        this.idle = false;
        this.y -= this.game.clockTick * this.speed;
    }else if( this.game.inputArray[1] === true) {
        this.idle = false;
        this.y += this.game.clockTick * this.speed;
    } else if( this.game.inputArray[0] === true) {
        this.idle = false;

        this.x -= this.game.clockTick * this.speed;

    } else if( this.game.inputArray[4] === true) {
        this.idle = false;
        this.game.addEntity(new Rock(this.game, AM.getAsset("./img/Rock.png"), this.x, this.y, 'w', 2));
    }else if( this.game.inputArray[5] === true) {
        this.idle = false;
        this.game.addEntity(new Rock(this.game, AM.getAsset("./img/Rock.png"), this.x, this.y, 'e', 2));
    } else if( this.game.inputArray[6] === true) {
        this.idle = false;

        this.game.addEntity(new Rock(this.game, AM.getAsset("./img/Rock.png"), this.x, this.y, 's', 2));

    }else if( this.game.inputArray[7] === true) {
        this.idle = false;
        this.game.addEntity(new Rock(this.game, AM.getAsset("./img/Rock.png"), this.x, this.y, 'n', 2));
    } else {
        this.idle = true;
    }
    Entity.prototype.update.call(this);
}
Owlkin.prototype.draw = function (ctx) {
    //if(this.idle) {
      //  this.idle_animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    
        
    //} else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    //}
    Entity.prototype.draw.call(this);
}

function Rock(game, spriteSheet, x, y,  direction, scale) {
    this.animation = new Animation(spriteSheet, 0, 0, 8, 8, .3, 1, true, false, scale);
    this.x = x;
    this.y = y;
    this.speed = 60;
    this.direction = direction;
    this.ctx = game.ctx;
    Entity.call(this, game, x, y);
}
Rock.prototype = new Entity();
Rock.prototype.constructor = Bird;

Rock.prototype.update = function() {
    if(this.direction === 'w') {
        this.x -= this.game.clockTick * this.speed;
    } else if( this.direction === 'e') {
        this.x += this.game.clockTick * this.speed;
    
    } else if( this.direction === 's') {
        this.y += this.game.clockTick * this.speed;
    } else if( this.direction === 'n') {
        this.y -= this.game.clockTick * this.speed;
    }
    Entity.prototype.update.call(this);
}
Rock.prototype.draw = function() {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);

}
AM.queueDownload("./img/background.png");
AM.queueDownload("./img/bird.png");
AM.queueDownload("./img/Zombie.png");
AM.queueDownload("./img/Zombie_Right.png");
AM.queueDownload("./img/Owlet.png");
AM.queueDownload("./img/Rock.png");
AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");
    var gameEngine = new GameEngine();
    //var zombie_r = new Zombie(gameEngine, 0);
    //var zombie_l = new Zombie(gameEngine, 1);
    gameEngine.init(ctx);
    gameEngine.start();
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.png")));
    gameEngine.addEntity(new Bird(gameEngine, AM.getAsset("./img/bird.png"), 250, 'p', .2));
    gameEngine.addEntity(new Bird(gameEngine, AM.getAsset("./img/bird.png"), 150, 'p', .2));
    gameEngine.addEntity(new Zombie(gameEngine, AM.getAsset("./img/Zombie.png"), 0));
    gameEngine.addEntity(new Zombie(gameEngine, AM.getAsset("./img/Zombie_Right.png"), 1));
    gameEngine.addEntity(new Owlkin(gameEngine, AM.getAsset("./img/Owlet.png")));
  
    console.log("Done");
});
