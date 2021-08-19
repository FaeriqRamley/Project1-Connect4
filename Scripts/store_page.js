'use strict';
const currentProfile = getActiveAccount();

const gameShop = {
    userAvatarList: [
        'Assets/Images/Avatars/Player_Avatar_1',
        'Assets/Images/Avatars/Player_Avatar_2',
        'Assets/Images/Avatars/Player_Avatar_3',
    ],
    userBoardList: ['red','blue','green','yellow']
}

const updateCoins = () => {
    const coinsDisplay = document.querySelector("#coin-display");
    const coinsDiv = document.createElement("div");
    coinsDiv.innerHTML = `<h2>Coins</h2><h3>${currentProfile.userCoins}</h3>`;
    coinsDisplay.append(coinsDiv);
}

const updatePricing = () => {
    const avatarBuyButton = document.querySelector("#purchase-avatar");
    const boardBuyButton = document.querySelector("#purchase-board");
    const avatarPriceDisplay = document.createElement("h4");
    const boardPriceDisplay = document.createElement("h4");
    avatarPriceDisplay.innerText = `-${avatarPrice} coins`;
    boardPriceDisplay.innerText = `-${boardPrice} coins`;
    avatarBuyButton.append(avatarPriceDisplay);
    boardBuyButton.append(boardPriceDisplay);
    avatarBuyButton.value = avatarPrice;
    boardBuyButton.value = boardPrice;
}

const onClickPurchase = (e) => {

    if (e.target.tagName !== "BUTTON"){
        return null;
    }
    const price = e.target.value
    const itemTitle = document.querySelector("#item-title");
    if (currentProfile.userCoins < price){
        
        itemTitle.innerHTML = "<h1>NOT ENOUGH COINS</h1>";
    } else{
        currentProfile.userCoins -= price;
        let itemTarget = ""
        if (e.target.id === "purchase-avatar"){
            itemTarget = "userAvatarList";
        } else {
            itemTarget = "userBoardList";
        }

        const totalQty = gameShop[itemTarget];

        const rollItem = Math.floor(Math.random()*totalQty);

        const chosenItem = gameShop[itemTarget][rollItem];

        if (currentProfile[itemTarget].indexOf(chosenItem) === -1){
            //new item
            itemTitle.innerHTML = "<h1>WOW! A NEW ITEM!</h1>";
            currentProfile[itemTarget].push(chosenItem);
        } else{
            //duplicate item
            itemTitle.innerHTML = "<h1>Aww... Another duplicate...</h1>";
            currentProfile.userCoins += Math.round(price/2);
        }
        updateCoins();
        saveProfile(currentProfile);
    }

}

const onClickChangePageStore = (e) => {
    window.location.assign(e.target.value);
}

const avatarPrice = 160;
const boardPrice = 160;

console.log(currentProfile);
updateCoins();
updatePricing();
document.querySelector("#to-main-page").addEventListener("click",onClickChangePageStore);
document.querySelector("#menu-display").addEventListener("click",onClickPurchase);
