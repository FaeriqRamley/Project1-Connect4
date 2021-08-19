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

    //change color of draggable piece
    let draggablePiece = document.querySelector("#draggable-piece");
    if(gameStatus.turn%2+1 === 1){
        draggablePiece.style.backgroundColor = "red";
    } else if (gameStatus.turn%2+1 === 2){
        draggablePiece.style.backgroundColor = "yellow";
    }

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
            gameEndEvent(outcome.player);
            toggleGameButtons(false);
        } else {
            updateTurnStatus(1);
        }
    }
}

const gameEndEvent = (gameWinner) => {
    gameStatus.winner = gameWinner;
    gameStatus.gameEnd = true;
    const outcomeScreen = document.querySelector("#outcome-screen");
    const outcomeMessageDiv = document.querySelector("#outcome-message");
    const outcomeMessage = document.createElement("h1");
    let botName = ""
    let botAvatarName = ""
    let botCoins = 0;
    //Choose name of bot & potential win earnings
    switch(gameStatus.botInfo.botLevel.toString()){
        case "2":
            botName = "Kiara";
            botAvatarName = "Easy_bot"
            botCoins = 50;
            break;
        case "4":
            botName = "Gura";
            botAvatarName = "Medium_bot"
            botCoins = 150;
            break;
        case "6":
            botName = "Amelia";
            botAvatarName = "Hard_bot"
            botCoins = 500;
            break;
        default:
            botName = "Bot";
            break;
    }

    switch(gameStatus.mode){
        case "botMatch":
            gameStatus.winner = gameWinner;
            let botAvatarOutcome = "";

            
            if(gameWinner === gameStatus.botInfo.botNum){
                outcomeMessage.innerText = `You Lost to ${botName}!`;
                botAvatarOutcome = "win";

                currentProfile.userLoss += 1;
                currentProfile.userMatchOutcome.push(-1*gameStatus.botInfo.botLevel);

                
            } else if (gameWinner === 0){
                currentProfile.userDraw += 1;
                currentProfile.userMatchOutcome.push(10*gameStatus.botInfo.botLevel);
            } else {
                outcomeMessage.innerText = `You Beat ${botName}!`;
                botAvatarOutcome = "lose";

                currentProfile.userWins += 1;
                currentProfile.userMatchOutcome.push(1*gameStatus.botInfo.botLevel);
                currentProfile.userCoins += botCoins;
            }

            //update botAvatar
            const botAvatar = document.querySelector("#player-2-avatar");
            botAvatar.src = `Assets/Images/Avatars/${botAvatarName}_${botAvatarOutcome}.gif`;

            //save game
            currentProfile.userMatchHistory.push(gameBoard.copyBoard())
            saveProfile(currentProfile);
            break;
        case "hotSeat":
            outcomeMessage.innerText = `Player ${gameWinner} won!`
            break;
        default:
            break;
    }

    outcomeMessageDiv.append(outcomeMessage);
    outcomeScreen.style.display = "flex";
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
            playBotSounds("medium_bot","intro",1);
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
    gameStatus.botInfo.botName = e.target.id;
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
                minmaxBot(gameBoard,botNum,botNum,botLevel,botLevel);
            }
            break;
        default:
            break;
    }

}

const onClickBackHomeOrAgain = (e) => {
    console.log("clicked");
    console.log(e.target.value);
    if (e.target.tagName !== "BUTTON"){
        console.log("null")
        return null;
    }

    if (e.target.value === "Home"){
        window.location.assign("main_page.html");
    } else if (e.target.value === "Again"){
        document.querySelector("#outcome-screen").style.display = "none";
    }
}

const onClickToggleDragOrClick = (e) => {
    const pieceDropperDiv = document.querySelector("#piece-dropper");
    const pieceClickerDiv = document.querySelector("#piece-clicker");
    const pieceDropperObj = document.querySelector("#draggable-piece");

    const isDropper = pieceDropperDiv.style.display;
    if (isDropper === "none"){
        pieceDropperDiv.style.display = "grid";
        pieceDropperObj.style.display = "block";
        pieceClickerDiv.style.display = "none";
        e.target.innerText = "Dropper";
    } else {
        pieceDropperDiv.style.display = "none";
        pieceDropperObj.style.display = "none";
        pieceClickerDiv.style.display = "grid";
        e.target.innerText = "Clicker";
    }
} 

////  -------------------- Drag and drop --------------------
const draggablePiece = document.querySelector("#draggable-piece");
draggablePiece.addEventListener("dragstart", e=> {
    e.dataTransfer.setData("text/plain",draggablePiece.id);
});

for (const dropZone of document.querySelectorAll(".drop-zone")){
    dropZone.addEventListener("dragover", (e)=> {
        //needed to work since dragover invoked every few miliseconds
        e.preventDefault();
        dropZone.classList.add("drop-zone-over");
    });

    dropZone.addEventListener("drop", (e)=> {
        e.preventDefault();

        const droppedElementId = e.dataTransfer.getData("text/plain");
        if(droppedElementId === "draggable-piece"){
            console.log(e.target.dataset.value);

            const playerTurnDisplay = document.querySelector("#display-player-turn").children[1].innerText;
            if (playerTurnDisplay !== "1" && playerTurnDisplay !== "2"){
                console.log("Press Start Game to play")
                dropZone.classList.remove("drop-zone-over");
                return null;
            }
        
            const move = e.target.dataset.value;
            
            switch(gameStatus.mode){
                case "hotSeat":
                    makeMove(move,gameStatus.turn%2+1);
                    break;
                case "botMatch":
                    const {botLevel,botNum} = gameStatus.botInfo;
                    
                    makeMove(move,botNum%2+1);
                    if(!gameStatus.gameEnd){
                        minmaxBot(gameBoard,botNum,botNum,botLevel,botLevel);
                    }
                    break;
                default:
                    break;
            }
        };

        dropZone.classList.remove("drop-zone-over");
        
    });

    dropZone.addEventListener("dragleave", e => {
        e.preventDefault();
        dropZone.classList.remove("drop-zone-over");
    })
    
}

//// Invocations
let gameBoard = new Board();
const gameStatus = {
    gameEnd: false,
    winner:0,
    turn:0,
    mode:"botMatch",
    botInfo: {
        botName: "",
        botLevel: 0,
        botNum: 0,
    }
};

displayBoard(gameBoard.board);
document.querySelector("#outcome-buttons").addEventListener("click",onClickBackHomeOrAgain);
document.querySelector("#button-game-start").addEventListener("click",onClickStartGame);
document.querySelector("#button-toggle-drag").addEventListener("click",onClickToggleDragOrClick);
document.querySelector("#piece-clicker").addEventListener("click",onClickMakeMove);
document.querySelector("#game-mode-options").addEventListener("click",onClickUpdateGameMode);
document.querySelector("#bot-level-options").addEventListener("click",onClickUpdateBotLevel);