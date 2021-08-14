class Board {
    constructor(
        board = [
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0]
        ]
    ){
        this.board = board;
    }

    returnBoard () {
        return this.board;
    }

    add (col,currPlayer){
        if (this.board[0][col] !== 0){
            console.log("Column is full. Pick another")
            return false

        } else {
            console.log((`Player ${currPlayer} plays column ${col}`))
            for (let i=1;i<this.board.length;i++){
                if(this.board[i][col] !== 0){
                    this.board[i-1][col] = currPlayer;
                    return true;
                }
            }
            this.board[this.board.length-1][col] = currPlayer;
            return true;
        }
    }

    //function to check if this move was played what will happen
    //returns checkWin object
    checkAdd (col,currPlayer){
        if (this.board[0][col] !== 0){
            return {result:false,player:0,valid:false}

        } else {
            //row where piece was add
            const rowPlaced = this.board.length-1;
            for (let i=1;i<this.board.length;i++){
                if(this.board[i][col] !== 0){
                    this.board[i-1][col] = currPlayer;
                    rowPlaced = i-1;
                }
            }
            this.board[this.board.length-1][col] = currPlayer;
        }

        const outcome = this.checkWin();
        this.board[rowPlaced][col] = 0;
        outcome["valid"] = true;
        return outcome;
    }

    checkWin(){
        const boardCols = this.board[0].length;
        const boardRows = this.board.length;

        //Row Victory Check
        for (const row of this.board){
            for (let i=0; i < boardCols-3; i++){
                if (row[i] !== 0){
                    if (row[i] === row[i+1] && row[i+1] === row[i+2] && row[i+2] === row[i+3]){
                        return {
                            result: true,
                            player: row[i]
                        };
                    }
                }
            }
        }
        
        //Col Victory Check
        for (let col = 0; col<boardCols; col++){

            for (let row = 0; row<boardRows-3; row++){
                if (this.board[row][col] !== 0){
                    if (
                        this.board[row][col] === this.board[row+1][col] &&
                        this.board[row+1][col] === this.board[row+2][col] &&
                        this.board[row+2][col] === this.board[row+3][col]
                    ){
                        return {
                            result: true,
                            player: this.board[row][col]
                        };
                    }
                }
            }
        }

        //TopLeft to BotRight Diag Victory Check
        for (let row = 0; row < boardRows-3; row++){
            for (let col = 0; col < boardCols-3; col++){
                if(
                    this.board[row][col] !== 0 &&
                    this.board[row][col] === this.board[row+1][col+1] &&
                    this.board[row+1][col+1] === this.board[row+2][col+2] &&
                    this.board[row+2][col+2] === this.board[row+3][col+3]
                ){
                    console.log(this.board[row][col],this.board[row+1][col+1],this.board[row+2][col+2],this.board[row+3][col+3])
                    return {
                        result: true,
                        player: this.board[row][col]
                    };
                }
            }
        }

        //TopRight to BotLeft Victory Check
        for (let row = 0; row < boardRows-3; row++){
            for (let col = 3; col < boardCols; col++){
                if(
                    this.board[row][col] !== 0 &&
                    this.board[row][col] === this.board[row+1][col-1] &&
                    this.board[row+1][col-1] === this.board[row+2][col-2] &&
                    this.board[row+2][col-2] === this.board[row+3][col-3]
                ){
                    console.log(this.board[row][col],this.board[row+1][col-1],this.board[row+2][col-2],this.board[row+3][col-3])
                    return {
                        result: true,
                        player: this.board[row][col]
                    };
                }
            }
        }
        return {result: false,player:0}
    }
}

const displayBoard = (board) => {
    const displayGrid = document.querySelector("#board-display")
    for (let row = 0; row<board.length;row++){
        for (let col = 0; col<board[row].length;col++){
            const gamePiece = document.createElement("div");
            gamePiece.className = `player-${board[row][col]}`
            gamePiece.style.gridColumnStart = `${col+1}`;
            gamePiece.style.gridRowStart = `${row+1}`;
            gamePiece.innerText = "O";
            displayGrid.append(gamePiece);
        }
    }
}

//// Game Functions
const startGame = () => {
    gameBoard = new Board();
    displayBoard(gameBoard.board);
    gameStatus.gameTurn = 0;
    toggleGameButtons(true);
    updateTurnStatus();
}

const updateTurnStatus = (turnChange=0) => {
    const gameTurnDisplay = document.querySelector("#display-turn-number");
    const playerTurnDisplay = document.querySelector("#display-player-turn");
    
    gameStatus.gameTurn += turnChange;
    gameTurnDisplay.children[1].innerText = `${gameStatus.gameTurn}`;
    playerTurnDisplay.children[1].innerText = `${gameStatus.gameTurn%2+1}`;

}

const toggleGameButtons = (toggle) => {
    const pieceDropper = document.querySelector("#piece-dropper")
    for (const button of pieceDropper.children){
        button.disabled = !toggle;
    }
}

const makeMove = (move) => {
    madeValidMove = gameBoard.add(parseInt(move),gameStatus.gameTurn%2+1)
    
    if (madeValidMove){
        displayBoard(gameBoard.board);
        const outcome = gameBoard.checkWin();
        if (outcome.result){
            console.log(`Player ${outcome.player} wins!`)
            toggleGameButtons(false);
        } else {
            updateTurnStatus(1);
        }
    }
}

const onClickMakeMove = (e) => {
    if (e.target.tagName !== "BUTTON"){
        return null;
    }

    const playerTurnDisplay = document.querySelector("#display-player-turn").children[1].innerText;
    if (playerTurnDisplay !== "1" && playerTurnDisplay !== "2"){
        console.log("Press Start Game to play")
        return null;
    }

    const move = e.target.value;
    makeMove(move);
}

// // Save for EasyBot
// const makeRandomMove = () => {
//     let madeValidMove = false;
//     while (madeValidMove === false){
//         let randomMove = Math.floor(Math.random()*gameBoard.board[0].length);

//         madeValidMove = gameBoard.add(randomMove,gameTurn%2+1)
//     }
//     gameTurn++;
//     displayBoard(gameBoard.board);
// }

//// Invocations
let gameBoard = new Board();
// **change gameMode value to variable later
const gameStatus = {gameEnd: false, winner:0, gameTurn:0, gameMode:"hotSeat"};

displayBoard(gameBoard.board);

document.querySelector("#button-game-start").addEventListener("click",startGame);
document.querySelector("#piece-dropper").addEventListener("click",onClickMakeMove);