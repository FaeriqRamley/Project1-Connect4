'use strict';

const profileStructure = {
    // Profile
    userName: "",
    userCoins: 2000000,
    userAvatar: 0,
    userBoard: 0,
    userAvatarList: ["Assets/Images/Avatars/Basic_Avatar.png"],
    userBoardList: ["blue","red"],
    // Stats
    userWins:0,
    userLoss:0,
    userDraw:0,
    userMatchOutcome:[],
    userMatchHistory:[]
}

const copyProfile = (newProfile,oldProfile) => {
    for (const [key,value] of Object.entries(profileStructure)){
        currentProfile[key] = value;
    
        if (key === "userAvatarList" || key === "userBoardList" || key === "userMatchOutcome"){
            currentProfile[key] = [...value];
        } else if (key === "userMatchHistory"){
            const inputHistory = []
            for (const gameBoard of value){
                const inputBoard = []
                for(const row of gameBoard){
                    inputBoard.push([...row]);
                }
                inputHistory.push([...inputBoard]);
            }
            currentProfile[key] = [...inputHistory];
        }
    }
}

const saveProfile = (savedProfile) => {
    gameStorage.setItem(savedProfile.userName,JSON.stringify(savedProfile))
}

const getActiveAccount = () => {
    const activeUser = gameStorage.getItem("Active User");
    return JSON.parse(gameStorage.getItem(activeUser));
}

const gameStorage = window.localStorage;