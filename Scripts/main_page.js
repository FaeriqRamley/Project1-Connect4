"use strict";

const onClickChangePage = (e) => {
    
    if (e.target.tagName == "BUTTON"){
        const target = e.target.value
        console.log("clicked");
        window.location.assign(target);
    }
    
}

document.querySelector("#nav").addEventListener("click",onClickChangePage);