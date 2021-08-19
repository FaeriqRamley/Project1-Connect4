'use strict';

const currentProfile = getActiveAccount();

const displayBasicUserInfo = () => {
    const userNameDiv = document.querySelector("#user-name");
    const statsDiv = document.querySelector("#user-stats");
    const playerAvatar = document.querySelector("#user-avatar")

    if (userNameDiv.innerHTML !== ""){
        userNameDiv.innerHTML = "";
        statsDiv.innerHTML = "";
        playerAvatar.innerHTML = "";
    }

    const playerName = document.createElement("h1");
    playerName.innerText = currentProfile.userName;
    userNameDiv.append(playerName);

    const playerCoins = document.createElement("div");
    playerCoins.className = "col";
    playerCoins.innerText = `${currentProfile.userCoins} coins`;
    statsDiv.append(playerCoins);

    const playerStats = document.createElement("div");
    playerStats.className = "col";
    playerStats.innerText = `${currentProfile.userWins}W - ${currentProfile.userLoss}L - ${currentProfile.userDraw}D`
    statsDiv.append(playerStats);

    playerAvatar.src = currentProfile.userAvatarList[currentProfile.userAvatar];
    
}

const displayBoardProfile = (board) => {
    const displayGrid = document.createElement("div");
    displayGrid.className = "board-display";

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

    return displayGrid;
}

const renderMatchHistory = () => {
    const matchHistoryDiv = document.querySelector("#match-history");
    const {userMatchHistory,userMatchOutcome} = currentProfile;
    console.log(userMatchHistory);
    console.log(userMatchOutcome);

    for (let ind=0;ind<userMatchOutcome.length;ind++){
        const matchInfo = document.createElement("div");
        matchInfo.className = "row match-info";

        //show outcome
        const outcomeCol = document.createElement("div");
        outcomeCol.className = "col";
        if (userMatchOutcome[ind] < 0){
            outcomeCol.innerText = "Lose";
            outcomeCol.classList.add("info-lose");
        } else if (userMatchOutcome[ind] < 10){
            outcomeCol.innerText = "Win";
            outcomeCol.classList.add("info-win");
        } else{
            outcomeCol.innerText = "Draw";
            outcomeCol.classList.add("info-draw");
        }
        matchInfo.append(outcomeCol);

        //show gameboard
        const boardCol = document.createElement("div");
        boardCol.className = "col-6 info-board";
        boardCol.append(displayBoardProfile(userMatchHistory[ind]));
        matchInfo.append(boardCol);

        //show enemy picture
        const opponentCol = document.createElement("div");
        opponentCol.className = "col info-opponent";
        const opponentImg = document.createElement("img");
        let opponent = ""
        if(Math.abs(userMatchOutcome[ind]) === 2 || Math.abs(userMatchOutcome[ind]) === 20){
            opponent = "easy_bot";
        } else if(Math.abs(userMatchOutcome[ind]) === 4 || Math.abs(userMatchOutcome[ind]) === 40){
            opponent = "medium_bot";
        } else if(Math.abs(userMatchOutcome[ind]) === 6 || Math.abs(userMatchOutcome[ind]) === 60){
            opponent = "hard_bot";
        }
        
        opponentImg.src = `Assets/Images/Icons/profile_${opponent}.gif`;
        opponentImg.className = "opponent-image";
        opponentCol.append(opponentImg);
        matchInfo.append(opponentCol);

        matchHistoryDiv.append(matchInfo);
    }
}

const configureCustomizationOptions = () => {
    const avatarInput = document.querySelector("#avatar-choice");
    const boardInput = document.querySelector("#board-style");
    avatarInput.max = currentProfile.userAvatarList.length - 1;
    boardInput.max = currentProfile.userBoardList.length - 1;
}

const onClickApplyCustomization = (e) => {
    e.preventDefault();
    const newAvatar = document.querySelector("#avatar-choice").nodeValue;
    const newBoard = document.querySelector("#board-style").nodeValue;
    if (newAvatar !== null && newBoard !== null){
        currentProfile.userAvatar = document.querySelector("#avatar-choice").nodeValue;
        currentProfile.userBoard = document.querySelector("#board-style").nodeValue;
        saveprofile(currentProfile);
    } else{
        console.log("you must pick something for both!");
    }
    displayBasicUserInfo();
}

const onClickChangePageProfile = (e) => {
    window.location.assign(e.target.value);
}

document.querySelector("#submit-customization").addEventListener("click",onClickApplyCustomization);
document.querySelector("#return-main-page").addEventListener("click",onClickChangePageProfile);
configureCustomizationOptions();
displayBasicUserInfo();
renderMatchHistory();