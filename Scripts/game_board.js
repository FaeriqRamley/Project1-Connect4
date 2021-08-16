'use strict';

//// Game Functions

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

const startGame = () => {
    gameBoard = new Board();
    displayBoard(gameBoard.board);
    gameStatus.turn = 0;
    gameStatus.gameEnd = false;
    toggleGameButtons(true);
    updateTurnStatus();
}

const updateTurnStatus = (turnChange=0) => {
    const gameTurnDisplay = document.querySelector("#display-turn-number");
    const playerTurnDisplay = document.querySelector("#display-player-turn");
    
    gameStatus.turn += turnChange;
    gameTurnDisplay.children[1].innerText = `${gameStatus.turn}`;
    playerTurnDisplay.children[1].innerText = `${gameStatus.turn%2+1}`;

}

const toggleGameButtons = (toggle) => {
    const pieceDropper = document.querySelector("#piece-dropper")
    for (const button of pieceDropper.children){
        button.disabled = !toggle;
    }
}

const makeMove = (move,player) => {
    let madeValidMove = gameBoard.add(parseInt(move),player)
    
    if (madeValidMove){
        displayBoard(gameBoard.board);
        const outcome = gameBoard.checkWin();
        if (outcome.result){
            console.log(`Player ${outcome.player} wins!`)
            gameStatus.gameEnd = true;
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
    
    switch(gameStatus.mode){
        case "hotSeat":
            makeMove(move,gameStatus.turn%2+1);
            break;
        case "botMatch":
            const {botLevel,botNum} = gameStatus.botInfo;
            
            makeMove(move,botNum%2+1);
            toggleGameButtons(false);
            medBot(gameBoard,botNum,botNum,botLevel,botLevel);
            if(!gameStatus.gameEnd){
                toggleGameButtons(true);
            }
            break;
        default:
            break;
    }

}

//// Invocations
let gameBoard = new Board();
// **change gameMode value to variable later
const gameStatus = {
    gameEnd: false,
    winner:0,
    turn:0,
    mode:"botMatch",
    botInfo: {
        botLevel: 6,
        botNum: 2,
    }
};

displayBoard(gameBoard.board);

document.querySelector("#button-game-start").addEventListener("click",startGame);
document.querySelector("#piece-dropper").addEventListener("click",onClickMakeMove);