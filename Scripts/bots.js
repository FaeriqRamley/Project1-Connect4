const easyBot = (gameBoard,botPlayerNum) => {
    const moveOutcomes = [];
    const moveValues = [];

    //Try all moves
    for (let testMove = 0; testMove < 8; testMove++){
        // console.log(`testing move ${testMove}`)
        moveOutcomes.push(gameBoard.checkAdd(testMove,botPlayerNum));
    }
    // console.log("Outcomes gathered:");
    // console.log(moveOutcomes);
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
    // console.log("Move values:");
    // console.log(moveValues);
    //Determine highest value
    const highestValue = Math.max(...moveValues);
    // console.log(`HighestValue:${highestValue}`);
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
    console.log(`Chosen Move: ${chosenMove}`);
    console.log(gameBoard.board);
    makeMove(chosenMove,botPlayerNum);

}