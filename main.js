(function(){
    // Define the class Board, it's 
    self.Board = function(width,height){
        this.width = width;
        this.height = height;
        this.playing = false;
        this.gameOver = false;
        this.bars = [];
        this.ball = null;
        this.playing = false;
    }

    self.Board.prototype = {
        get elements(){
            var elements = this.bars.map(function(bar){return bar;});
            elements.push(this.ball);
            return elements;
        }
    }
})();

(function(){
    self.Ball = function(x, y, radius, board){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_y = 0;
        this.speed_x = 3;
        this.board = board;
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI /12;
        this.speed = 3;

        board.ball = this;
        this.kind = "circle";
    }

    self.Ball.prototype = {
        move: function(){
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);
        },
        get width(){
            return this.radius * 2;
        },
        get height(){
            return this.radius * 2;
        },
        collision: function(bar){
            // react to the bar collision.
            var relative_intersect_y = (bar.y + (bar.height / 2)) - this.y;

            var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

            this.speed_y = this.speed * -Math.sin(this.bounce_angle);
            this.speed_x = this.speed * Math.cos(this.bounce_angle);

            if(this.x > (this.board.width / 2)) {
                this.direction = -1;
            } else {
                this.direction = 1;
            }
        }
    }

})();

(function(){
    self.Bar = function(x, y, width, height, board){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 10;
    }

    self.Bar.prototype = {
        down: function(){
            this.y += this.speed;
        },
        up: function() {
            this.y -= this.speed;
        },
        toString: function(){
            return "x: " + this.x + " y: " + this.y;
        }
    }

})();

(function(){
    self.BoardView = function(canvas, board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }

    self.BoardView.prototype = {
        clean: function(){
            this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        },
        draw: function(){
            for (var i = this.board.elements.length - 1; i >= 0; i--) {
                var el = this.board.elements[i];

                draw(this.ctx, el);
            }
        },
        checkCollisions: function(){
            for (var i = this.board.bars.length - 1; i >= 0; i--){
                var bar = this.board.bars[i]
                if(hit(bar, this.board.ball)){
                    this.board.ball.collision(bar);
                }
            }
        },
        play: function(){
            if(this.board.playing){
                this.clean();
                this.draw();
                this.checkCollisions();
                this.board.ball.move();
            }
        }
    }

    function hit(object1, object2){
        var hit = false;

        // Horizontal collisions
        if(object2.x + object2.width >= object1.x && object2.x < object1.x + object1.width){
            // Vertical collisions
            if(object2.y + object2.height >= object1.y && object2.y < object1.y + object1.height) {
                hit = true;
            }
        }

        // Check if object1 collision with object2
        // Horizontal collisions
        if(object2.x <= object1.x && object2.x + object2.width >= object1.x + object1.width){
            // Vertical collisions
            if(object2.y <= object1.y && object2.y + object2.height >= object1.y + object1.height) {
                hit = true;
            }
        }

        // Check if object2 collision with object1
        // Horizontal collisions
        if(object1.x <= object2.x && object1.x + object1.width >= object2.x + object2.width){
            // Vertical collisions
            if(object1.y <= object2.y && object1.y + object1.height >= object2.y + object2.height) {
                hit = true;
            }
        }
        return hit;
    }

    function draw(ctx, element){
        switch(element.kind){
            case "rectangle":
                ctx.fillRect(element.x, element.y, element.width, element.height);
                break;
            case "circle":
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.radius, 0, 2*Math.PI);
                ctx.fill();
                ctx.closePath();
                break;

        }
    }
})();

var board = new Board(800,400);
var bar_1 = new Bar(20,100,40,100,board);
var bar_2 = new Bar(740,100,40,100,board);
var canvas = document.getElementById('canvas');
var board_view = new BoardView(canvas, board);
var ball = new Ball(350, 100, 10, board);

board_view.draw();
window.requestAnimationFrame(controller);
setTimeout(function(){
    ball.direction = -1;
},4000);

document.addEventListener("keydown", function(ev){
    console.log(ev.key)
    if(ev.key == "ArrowUp"){
        ev.preventDefault();
        bar_1.up();
    }
    else if(ev.key == "ArrowDown"){
        ev.preventDefault();
        bar_1.down();
    }
    if(ev.key.toLowerCase() == "w"){
        ev.preventDefault();
        bar_2.up();
    }
    else if(ev.key.toLowerCase() == "s"){
        ev.preventDefault();
        bar_2.down();
    }
    else if(ev.key == " "){
        ev.preventDefault();
        board.playing = !board.playing;
    }

});

//window.addEventListener("load", main);

function controller() {
    board_view.play();
    window.requestAnimationFrame(controller);
}