"use strict";

const currentProfile = getActiveAccount();

const onClickChangePageMain = (e) => {
    if(e.target.className !== "nav-option" && e.target.parentNode.className !== "nav-option"){
        return null;
    };

    let target = ""
    if(e.target.tagName === "SPAN"){
        target = e.target.parentNode.dataset.value;    
    } else {
        target = e.target.dataset.value;
    }
    window.location.assign(target);

}

const updateWidgetInfo = () => {
    const userNameDiv = document.querySelector("#widget-name");
    const coinsDiv = document.querySelector("#widget-coins");
    const statsDiv = document.querySelector("#widget-stats");

    const playerName = document.createElement("div");
    playerName.innerText = currentProfile.userName;
    userNameDiv.append(playerName);

    const playerCoins = document.createElement("div");
    playerCoins.innerText = `${currentProfile.userCoins} coins`;
    coinsDiv.append(playerCoins);

    const playerStats = document.createElement("div");
    playerStats.innerText = `${currentProfile.userWins}W - ${currentProfile.userLoss}L - ${currentProfile.userDraw}D`
    statsDiv.append(playerStats);
}

updateWidgetInfo();
document.querySelector(".wrapper").addEventListener("click",onClickChangePageMain);