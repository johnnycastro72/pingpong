/**
 * Define the class Board, represent the board that contains the game
 * 
 * @param width  {int} define the width of the board
 * @param height {int} define the height of the board
 *  
 * @version 1.0
 * @author Jhonny Castro <johnny.castro@misena.edu.co>
 **/ 
(function(){
    self.Board = function(width,height){
        this.width = width;
        this.height = height;
        this.playing = false;
        this.gameOver = false;
        this.bars = [];
        this.ball = null;
        this.playing = false;
    }

    // implements board elements getters
    self.Board.prototype = {
        get elements(){
            var elements = this.bars.map(function(bar){return bar;});
            elements.push(this.ball);
            return elements;
        }
    }
})();

/**
 * Define the class Ball, represent the ball in ping pong game
 * 
 * @param x {int} define the ball horizontal initial position
 * @param y {int} define the ball vertical initial position
 * @param radius {int} define the ball radius
 * @param board  {Board} define the Board container
 *  
 * @version 1.0
 * @author Jhonny Castro <johnny.castro@misena.edu.co>
 */
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

    // implements ball methods
    self.Ball.prototype = {
        // move the ball in the board.
        move: function(){
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);
            if(this.y <= 0){
                this.y = this.board.height;
            } else if(this.y >= this.board.height) {
                this.y = 0;
            }
        },
        // getter method for width.
        get width(){
            return this.radius * 2;
        },
        // getter method for height.
        get height(){
            return this.radius * 2;
        },
        // change the ball direction after a object collision.
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

/**
 * Define the class Bar, represent the bars in ping pong game
 * 
 * @param x {int} define the bar horizontal initial position
 * @param y {int} define the bar vertical initial position
 * @param width {int} define the ball width
 * @param height {int} define the ball height
 * @param board  {Board} define the Board container
 *  
 * @version 1.0
 * @author Jhonny Castro <johnny.castro@misena.edu.co>
 */
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

   // implements bar methods
   self.Bar.prototype = {
        // Move the bar down
        down: function(){
            this.y += this.speed;
            if(this.y >= this.board.height){
                this.y = 0;
            }
        },
        // Move the bar up
        up: function() {
            this.y -= this.speed;
            if(this.y + this.height <= 0){
                this.y = this.board.height;
            }
        },
        // Return the coords of the bar
        toString: function(){
            return "x: " + this.x + " y: " + this.y;
        }
    }

})();

/**
 * Define the class BoardView, represent the view of the game
 * 
 * @param canvas {object} define the canvas object
 * @param board  {Board} define the Board container
 *  
 * @version 1.0
 * @author Jhonny Castro <johnny.castro@misena.edu.co>
 */
 (function(){
    self.BoardView = function(canvas, board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }

   // implements boardview methods
   self.BoardView.prototype = {
        // Clean the board area
        clean: function(){
            this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        },
        // Draw the objects in the board area
        draw: function(){
            for (var i = this.board.elements.length - 1; i >= 0; i--) {
                var el = this.board.elements[i];

                draw(this.ctx, el);
            }
        },
        // Check for objects collision
        checkCollisions: function(){
            for (var i = this.board.bars.length - 1; i >= 0; i--){
                var bar = this.board.bars[i]
                if(hit(bar, this.board.ball)){
                    this.board.ball.collision(bar);
                }
            }
        },
        // Play the game
        play: function(){
            if(this.board.playing){
                this.clean();
                this.draw();
                this.checkCollisions();
                this.board.ball.move();
            }
        }
    }

    /**
     * Define the function hit, determine whether two objects collision
     * 
     * @param object1 {object} define the first object
     * @param object2 {object} define the second object
     *  
     * @version 1.0
     * @author Jhonny Castro <johnny.castro@misena.edu.co>
     */
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

    /**
     * Define the function draw, draw the object in the canvas context
     * 
     * @param ctx {*} define the context
     * @param element {object} define the element to draw
     *  
     * @version 1.0
     * @author Jhonny Castro <johnny.castro@misena.edu.co>
     */
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

// objects initialization
var board = new Board(800,400);
var bar_1 = new Bar(20,100,40,100,board);
var bar_2 = new Bar(740,100,40,100,board);
var canvas = document.getElementById('canvas');
var board_view = new BoardView(canvas, board);
var ball = new Ball(350, 100, 10, board);

// draw the initial game
board_view.draw();
window.requestAnimationFrame(controller);

// Check what key was pressed and assign methods to that event.
document.addEventListener("keydown", function(ev){
    if(ev.key == "ArrowUp"){
        ev.preventDefault();
        bar_2.up();
    }
    else if(ev.key == "ArrowDown"){
        ev.preventDefault();
        bar_2.down();
    }
    if(ev.key.toLowerCase() == "w"){
        ev.preventDefault();
        bar_1.up();
    }
    else if(ev.key.toLowerCase() == "s"){
        ev.preventDefault();
        bar_1.down();
    }
    else if(ev.key == " "){
        ev.preventDefault();
        board.playing = !board.playing;
    }

});

/**
 * Define the function controller, initialize the game
 * 
 * @version 1.0
 * @author Jhonny Castro <johnny.castro@misena.edu.co>
 */
function controller() {
    board_view.play();
    window.requestAnimationFrame(controller);
}