'use strict';

const currentProfile = getActiveAccount();

//// -------------------- Game Functions --------------------

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

const gameEndEvent = () => {
    console.log("game ends")
    if (gameStatus.mode === "botMatch"){
        console.log("botmatch ended");
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

const generateBotLayout = (botName) => {
    const player2Avatar = document.createElement("img")
    player2Avatar.className = "avatar-img";
    player2Avatar.id = "player-2-avatar";
    const player2Name = document.createElement("h4");

    switch(botName){
        case "easy-bot":
            player2Avatar.src = "Assets/Images/Avatars/easy_bot_playing.gif"
            player2Name.innerText = "Takanashi Kiara"
            break;
        case "medium-bot":
            player2Avatar.src = "Assets/Images/Avatars/medium_bot_playing.gif"
            player2Name.innerText = "Gawr Gura"
            break;
        case "hard-bot":
            player2Avatar.src = "Assets/Images/Avatars/hard_bot_playing.gif"
            player2Name.innerText = "Amelia Watson"
            break;
        default:
            break;
    }
    console.log(player2Avatar.src);
    document.querySelector("#player-2-col").append(player2Avatar);
    document.querySelector("#player-2-col").append(player2Name);
}

const generatePlayerLayout = () => {
    const player1Avatar = document.createElement("img")
    player1Avatar.className = "avatar-img";
    player1Avatar.id = "player-1-avatar";
    const player1Name = document.createElement("h4");

    player1Avatar.src = currentProfile.userAvatarList[currentProfile.userAvatar];
    player1Name.innerText = currentProfile.userName;
    console.log(player1Avatar.src);
    document.querySelector("#player-1-col").append(player1Avatar);
    document.querySelector("#player-1-col").append(player1Name);
}

const clearLayouts = () => {
    document.querySelector("#player-1-col").innerHTML = "";
    document.querySelector("#player-2-col").innerHTML = "";
}

////  -------------------- Click Functions --------------------

const onClickStartGame = () => {
    gameBoard = new Board();
    displayBoard(gameBoard.board);
    gameStatus.turn = 0;
    gameStatus.gameEnd = false;
    toggleGameButtons(true);
    updateTurnStatus();
    clearLayouts();
}


const onClickUpdateBotLevel = (e) => {
    if(e.target.tagName !== "IMG"){
        return null;
    }
    gameStatus.botInfo.botLevel = parseInt(e.target.parentNode.dataset.value);
    console.log(gameStatus);
    generateBotLayout(e.target.id);
    generatePlayerLayout();
}

const onClickUpdateGameMode = (e) => {
    if (e.target.tagName !== "IMG"){
        return null;
    }
    gameStatus.mode = e.target.parentNode.dataset.value;
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
            if(!gameStatus.gameEnd){
                medBot(gameBoard,botNum,botNum,botLevel,botLevel);
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
document.querySelector("body").addEventListener('load',() => document.querySelector("#testModal").focus());
document.querySelector("#button-game-start").addEventListener("click",onClickStartGame);
document.querySelector("#piece-dropper").addEventListener("click",onClickMakeMove);
document.querySelector("#game-mode-options").addEventListener("click",onClickUpdateGameMode);
document.querySelector("#bot-level-options").addEventListener("click",onClickUpdateBotLevel);