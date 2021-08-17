"use strict";

const onClickChangePage = (e) => {
    console.log(e.target.tagName);
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
    playerName.innerText = currentPlayer.userName;
    userNameDiv.append(playerName);
    console.log("updating widget");


}

updateWidgetInfo();
document.querySelector(".wrapper").addEventListener("click",onClickChangePage);