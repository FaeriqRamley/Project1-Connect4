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

document.querySelector(".wrapper").addEventListener("click",onClickChangePage);