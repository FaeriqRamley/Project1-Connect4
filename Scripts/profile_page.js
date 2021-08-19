'use strict';

const currentProfile = getActiveAccount();

const displayBasicUserInfo = () => {
    const userNameDiv = document.querySelector("#user-name");
    const statsDiv = document.querySelector("#user-stats");
    const playerAvatar = document.querySelector("#player-avatar")

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


const renderMatchHistory = () => {
    document.querySelector("#match-history");
}

displayBasicUserInfo();