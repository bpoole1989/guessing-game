/* 

Write your guess-game code here! Don't forget to look at the test specs as a guide. You can run the specs
by running "testem".

In this file, you will also include the event listeners that are needed to interact with your HTML file when
a user clicks a button or adds a guess to the input field.

*/

function generateWinningNumber() {return Math.ceil(Math.random()*100)}

function shuffle(array) {
    let unshuffled = array.length;

    while (unshuffled > 0) {
        let selectedIndex = Math.floor(Math.random() * unshuffled--);
        let temp = array[selectedIndex];
        array[selectedIndex] = array[unshuffled];
        array[unshuffled] = temp;
    }

    return array;
}

class Game {
    constructor(){
        this.playersGuess = null;
        this.pastGuesses = [];
        this.winningNumber = generateWinningNumber();
        this.gameState = 'playing';
    }

    difference() {
        return Math.abs(this.playersGuess - this.winningNumber);
    }

    isLower() {
        return this.playersGuess < this.winningNumber;
    }

    playersGuessSubmission(guess) {
        if (guess < 1 || guess > 100 || typeof guess !== 'number')
            throw 'That is an invalid guess.';

        this.playersGuess = guess;

        return this.checkGuess();
    }

    checkGuess() {
        if (this.pastGuesses.includes(this.playersGuess))
            return 'You have already guessed that number.';
               
        this.pastGuesses.push(this.playersGuess);
            
        if (this.playersGuess === this.winningNumber) { 
            this.gameState = 'win';

            return 'You Win!';
        }
        
        if (this.pastGuesses.length >= 5) {
            this.gameState = 'lose'; 

            return 'You Lose.';
        }

        let difference = this.difference();
        
        if (difference < 10) 
            return "You're burning up!";

        if (difference < 25) 
            return "You're lukewarm.";

        if (difference < 50) 
            return "You're a bit chilly.";

        return "You're ice cold!";
    }

    provideHint() {
        let num1 = generateWinningNumber();
        let num2 = generateWinningNumber();

        while (num1 === num2 || num1 === this.winningNumber || num2 === this.winningNumber) {
            num1 = generateWinningNumber();
            num2 = generateWinningNumber();
        }

        return shuffle([this.winningNumber, num1, num2]);
    }
}

const newGame = () => new Game();


let counter = document.getElementById('counter');
let hint = document.getElementById('hint');
let guesses = Array.from(document.getElementsByClassName('guess'));
let result = document.getElementById('guess-result');
let input = document.getElementById('input');
let submit = document.getElementById('submit');
let reset = document.getElementById('reset');

let game = newGame();

//Start Over button resets the game
reset.addEventListener('click', () => {
    counter.innerHTML = 'You Get 5 Guesses';
    hint.style.border = 'solid black 2px';
    hint.innerHTML = 'Want a Hint?';
    hint.style.color = 'black';
    hint.disabled = false;
    guesses.forEach(guess => {
        guess.innerHTML = '';
        guess.style['text-decoration'] = 'red line-through';
        guess.style.fontWeight = 'normal';
        guess.style.color = 'black';
    });
    result.innerHTML = 'New Game! Give it another shot';
    input.placeholder = 'Take a Guess';
    input.value = '';
    input.disabled = false;
    submit.innerHTML = 'Submit!';
    submit.disabled = false;
    
    game = newGame();
});

//Hint button
hint.addEventListener('click', () => {
    hint.disabled = true;
    hint.innerHTML = `The number is one of these: ${game.provideHint()}`;
    hint.style.border = 'none';
    hint.style.color = 'blue';
    hint.style.width = '200px';
});

//Guess submission button, checks the guess value and advances the game
submit.addEventListener('click', () => {
    let guess = parseInt(input.value);
    input.value = '';

    if (guess < 1 || guess > 100 || typeof guess !== 'number') {
        result.innerHTML = 'That is an invalid guess.';
        return;
    }
    
    //set feedback text to the string returned from the method of the Game class that checks the guess
    result.innerHTML = game.playersGuessSubmission(guess);

    //copy the number of the last valid guess that was stored in the Game object (position n) to the nth item of the HTML guesslist
    guesses[game.pastGuesses.length - 1].innerHTML = `${game.pastGuesses[game.pastGuesses.length - 1]}`;

    //resolve win/lose conditions (set by checkGuess method on the Game object), otherwise tell the user number of guesses left and give a clue
    switch (game.gameState) {
        case 'win':
            guesses[game.pastGuesses.length - 1].style.fontWeight = 'bold';
            guesses[game.pastGuesses.length - 1].style.color = 'blue';
            guesses[game.pastGuesses.length - 1].style['text-decoration'] = 'none';
            counter.innerHTML = 'CONGRATS!!';
            hint.innerHTML = 'You Did It!';
            hint.style.color = 'blue';
            input.placeholder = 'Holy';
            input.disabled = true;
            submit.innerHTML = 'Balls';
            submit.disabled = true;
            break;

        case 'lose':
            guesses.forEach(guess => {guess.innerHTML = 'X_X'});
            guesses.forEach(guess => {guess.style['text-decoration'] = 'none'});
            counter.innerHTML = `My number was ${game.winningNumber}`;
            hint.innerHTML = 'Ya Blew It';
            hint.style.color = 'blue';
            input.placeholder = 'Way To Go';
            input.disabled = true;
            submit.innerHTML = 'Idiot';
            submit.disabled = true;
            break;

        default:
            counter.innerHTML = game.pastGuesses.length === 4 ? 
                `Last Chance!!!` : `You Have ${5 - game.pastGuesses.length} Guesses Left`;
            
            result.innerHTML += game.isLower() ? ' Aim Higher!' : ' Aim Lower!';
    }
});

