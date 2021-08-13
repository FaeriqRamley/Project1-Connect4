"use strict";

const onClickChangePage = (e) => {
    console.log(e.target.tagName);
    if (e.target.tagName == "BUTTON"){
        const target = e.target.value
        console.log("clicked");
        window.location.assign(target);
    }
    
}

document.querySelector("#nav").addEventListener("click",onClickChangePage);