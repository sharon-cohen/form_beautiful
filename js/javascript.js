const numberRegex = new RegExp("^[0-9]+$");



// Helper Functions
const scoreChanger = score => {
    if (score >= 5) {
        submitButton.removeAttribute('disabled');
        canvasNode.style.display = 'none';
        formContainerNode.style.display = 'inherit';
    }
};
const validateInput = (typeOfInput, inputNode) => {
    const { value } = inputNode;
    switch (typeOfInput) {
        case 'fullName': {
            if (!value.length || value.trim() === '') {
                inputNode.classList.add('is-invalid');
                return false
            }
            const strArr = [...value];
            let checkForSpace = strArr.every(letter => letter !== ' ');
            if (!checkForSpace) {
                inputNode.classList.remove('is-invalid');
                inputNode.classList.add('is-valid');
                return true

            }
            inputNode.classList.add('is-invalid');
            return false
        }
        case 'pass': {
            if (value.length === 6 && numberRegex.test(value)) {
                inputNode.classList.remove('is-invalid');
                inputNode.classList.add('is-valid');
                return true;
            }
            else {
                inputNode.classList.add('is-invalid');
                inputNode.classList.remove('is-valid');
                return false
            }
        }
        case 'phone': {
            if (value.length === 9 && numberRegex.test(value)) {
                inputNode.classList.add('is-valid');
                inputNode.classList.remove('is-invalid');
                return true;
            }
            inputNode.classList.add('is-invalid');
            return false;
        }
        case 'interests[]': {
           const interestsArr =  [interests[0], interests[1], interests[2], interests[3]];
           let isChecked = false;
           interestsArr.forEach(interestNode => {
               if (isChecked) return true;
               isChecked = interestNode.checked
           });
           return isChecked
        }
        default: {
            return true
        }
    }
};
const validateForm = () => {
    if (!validateInput('fullName', fullNameNode)) return false;
    if (!validateInput('pass', passwordNode)) return false;
    if (!validateInput('phone', phoneNode)) return false;
    return validateInput('interests[]', interests);
};
const submitForm = event => {
    const isFormValid = validateForm();
    if (!isFormValid) return event.preventDefault();
    else {
        console.log('Valid');
    }
};

// Nodes
const formContainerNode = document.getElementsByClassName('form-container')[0];
const fullNameNode = document.getElementsByName('fullName')[0];
const interests = document.getElementsByName('interests[]');
const passwordNode = document.getElementsByName('pass')[0];
const phoneNode = document.getElementsByName('phone')[0];
const ageLabelNode = document.getElementById('ageLabel');
const ageNode = document.getElementsByName('age')[0];
const myForm = document.getElementById('snake-form');
const canvasNode = document.getElementById('stage')
const submitButton = document.getElementById('submitButton');
formContainerNode.style.display = 'none';

// Listeners
fullNameNode.addEventListener('input', () => validateInput("fullName", fullNameNode));
passwordNode.addEventListener('input', () => validateInput("pass", passwordNode));
phoneNode.addEventListener('input',    () => validateInput("phone", phoneNode));
ageNode.addEventListener('input', () => {
    ageLabelNode.innerText = `Age - ${ ageNode.value }`;
});
myForm.addEventListener('submit',   event => submitForm(event));

//

// SNAKE
var Game      = Game      || {};
var Keyboard  = Keyboard  || {};
var Component = Component || {};
Keyboard.Keymap = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};
Keyboard.ControllerEvents = function() {

    // Setts
    var self      = this;
    this.pressKey = null;
    this.keymap   = Keyboard.Keymap;

    // Keydown Event
    document.onkeydown = function(event) {
        self.pressKey = event.which;
    };

    // Get Key
    this.getKey = function() {
        return this.keymap[this.pressKey];
    };
};
Component.Stage = function(canvas, conf) {

    // Sets
    this.keyEvent  = new Keyboard.ControllerEvents();
    this.width     = canvas.width;
    this.height    = canvas.height;
    this.length    = [];
    this.food      = {};
    this.score     = 0;
    this.direction = 'right';
    this.conf      = {
        cw   : 10,
        size : 5,
        fps  : 1000
    };

    // Merge Conf
    if (typeof conf == 'object') {
        for (var key in conf) {
            if (conf.hasOwnProperty(key)) {
                this.conf[key] = conf[key];
            }
        }
    }

};
Component.Snake = function(canvas, conf) {

    // Game Stage
    this.stage = new Component.Stage(canvas, conf);
    // Init Snake
    this.initSnake = function() {

        // Itaration in Snake Conf Size
        for (var i = 0; i < this.stage.conf.size; i++) {
            // Add Snake Cells
            this.stage.length.push({x: i, y:0});
        }
    };

    // Call init Snake
    this.initSnake();

    // Init Food
    this.initFood = function() {
        // Add food on stage
        this.stage.food = {
            x: Math.round(Math.random() * (this.stage.width - this.stage.conf.cw) / this.stage.conf.cw),
            y: Math.round(Math.random() * (this.stage.height - this.stage.conf.cw) / this.stage.conf.cw),
        };
    };

    // Init Food
    this.initFood();

    // Restart Stage
    this.restart = function() {
        this.stage.length            = [];
        this.stage.food              = {};
        this.stage.score             = 0;
        this.stage.direction         = 'right';
        this.stage.keyEvent.pressKey = null;
        this.initSnake();
        this.initFood();
    };
};
Game.Draw = function(context, snake) {

    // Draw Stage
    this.drawStage = function() {

        // Check Keypress And Set Stage direction
        var keyPress = snake.stage.keyEvent.getKey();
        if (typeof(keyPress) != 'undefined') {
            snake.stage.direction = keyPress;
        }

        // Draw White Stage
        context.fillStyle = "white";
        context.fillRect(0, 0, snake.stage.width, snake.stage.height);

        // Snake Position
        var nx = snake.stage.length[0].x;
        var ny = snake.stage.length[0].y;

        // Add position by stage direction
        switch (snake.stage.direction) {
            case 'right':
                nx++;
                break;
            case 'left':
                nx--;
                break;
            case 'up':
                ny--;
                break;
            case 'down':
                ny++;
                break;
        }

        // Check Collision
        if (this.collision(nx, ny) == true) {
            snake.restart();
            return;
        }

        // Logic of Snake food
        if (nx == snake.stage.food.x && ny == snake.stage.food.y) {
            var tail = {x: nx, y: ny};
            snake.stage.score++;
            scoreChanger(snake.stage.score)
            snake.initFood();
        } else {
            var tail = snake.stage.length.pop();
            tail.x   = nx;
            tail.y   = ny;
        }
        snake.stage.length.unshift(tail);

        // Draw Snake
        for (var i = 0; i < snake.stage.length.length; i++) {
            var cell = snake.stage.length[i];
            this.drawCell(cell.x, cell.y);
        }

        // Draw Food
        this.drawCell(snake.stage.food.x, snake.stage.food.y);

        // Draw Score
        context.fillText('Score: ' + snake.stage.score, 5, (snake.stage.height - 5));
    };

    // Draw Cell
    this.drawCell = function(x, y) {
        context.fillStyle = 'rgb(0, 200, 200)';
        context.beginPath();
        context.arc((x * snake.stage.conf.cw + 6), (y * snake.stage.conf.cw + 6), 4, 0, 2*Math.PI, false);
        context.fill();
    };

    // Check Collision with walls
    this.collision = function(nx, ny) {
        if (nx == -1 || nx == (snake.stage.width / snake.stage.conf.cw) || ny == -1 || ny == (snake.stage.height / snake.stage.conf.cw)) {
            return true;
        }
        return false;
    }
};
Game.Snake = function(elementId, conf) {

    // Sets
    var canvas   = document.getElementById(elementId);
    var context  = canvas.getContext("2d");
    var snake    = new Component.Snake(canvas, conf);
    var gameDraw = new Game.Draw(context, snake);

    // Game Interval
    setInterval(function() {gameDraw.drawStage();}, snake.stage.conf.fps);
};
window.onload = function() {
    var snake = new Game.Snake('stage', {fps: 100, size: 4});
};