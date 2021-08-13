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

let gameBoard = new Board();
let gameTurn = 0;
let turnDisplay = document.getElementById("turnNum")
turnDisplay.innerHTML = gameTurn;




const displayBoard = (board) => {
    for (const row of board){
        console.log(row);
    }
}

const startGame = () => {
    gameBoard = new Board();
    console.log("New board created");
    displayBoard(gameBoard.board);
}

const makeRandomMove = () => {
    let madeValidMove = false;
    while (madeValidMove === false){
        let randomMove = Math.floor(Math.random()*gameBoard.board[0].length);

        madeValidMove = gameBoard.add(randomMove,gameTurn%2+1)
    }
    gameTurn++;
    displayBoard(gameBoard.board);
}

const makeMove = () => {
    const moveList = document.getElementById("moves");
    const move = moveList.options[moveList.selectedIndex].value;
    madeValidMove = gameBoard.add(move,gameTurn%2+1)
    
    if (madeValidMove){
        displayBoard(gameBoard.board);
        const outcome = gameBoard.checkWin();
        if (outcome.result){
            console.log(`Player ${outcome.player} wins!`)
        }
        gameTurn++;
    }
}