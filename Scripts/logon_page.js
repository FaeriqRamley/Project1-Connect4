'use strict';

const onClickEnterUser = (e) => {
    if(e.target.tagName !== "BUTTON"){
        return null;
    }
    const userName = document.querySelector("#username-input").value;
    
    if(userName.length === 0){
        return null;
    }

    // window.location.assign("main_page.html");

    if(e.target.innerText === "Log In"){
        if(gameStorage.getItem(userName)===null){
            console.log("User does not exist. Please create a new profile first")
        } else{
            const retrievedProfile = JSON.parse(gameStorage.getItem(userName));
            copyProfile(currentProfile,retrievedProfile);
            window.location.assign("main_page.html");
        };

    }

    if(e.target.innerText === "New Profile"){
        if(gameStorage.getItem(userName)===null){
            copyProfile(currentProfile,profileStructure);
            currentProfile.userName = userName;
            gameStorage.setItem(userName,JSON.stringify(currentProfile))
            window.location.assign("main_page.html");
        } else{
            console.log("User already exists. Click log in to play!")
        }

    }
        
}

let gameStorage = window.localStorage;
let currentProfile = {};
copyProfile(currentProfile,profileStructure);

document.querySelector("#submit-buttons").addEventListener("click",onClickEnterUser);