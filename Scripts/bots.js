const easyBot = (gameBoard,botPlayerNum) => {
    const moveOutcomes = [];
    const moveValues = [];

    //Try all moves
    for (let testMove = 0; testMove < 8; testMove++){
        moveOutcomes.push(gameBoard.checkAdd(testMove,botPlayerNum));
    }

    //Assign value to moves
    for (const outcome of moveOutcomes){
        let outcomeValue = 0;
        if (outcome.valid){
            if (outcome.result === true){
                if (outcome.player === botPlayerNum){
                    outcomeValue = 1;
                } else {
                    outcomeValue = -1;
                }
            }
        } else {
            outcomeValue = NaN;
        }
        moveValues.push(outcomeValue);
    }

    //Determine highest value
    const highestValue = Math.max(...moveValues);
    //Choose random among same value moves
    const highestValueList = [];
    for (let i=0; i<moveValues.length; i++){
        if (moveValues[i] === highestValue){
            highestValueList.push(i)
        }
    }

    const randomChoice = Math.floor(Math.random()*highestValueList.length);
    const chosenMove = highestValueList[randomChoice];
    // console.log(`Highest value list: ${highestValueList}`);
    // console.log(`Random number: ${randomChoice}`);
    // console.log(`Chosen Move: ${chosenMove}`);
    // console.log(gameBoard.board);
    makeMove(chosenMove,botPlayerNum);

}



const medBot = (board,playerNum,depth) => {
    
    
    //Try all moves
    for (let col=0;col<8;col++){
        console.log("")
    }
    //Base case return: best move from movelist
    
    //For each move, recurse medBot(amendedBoard,player+1%2,depth-1) into a list
    //Return: best move from movelist

}