'use strict';

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



const medBot = (prevBoard,botPlayerNum,currPlayer,highestDepth,depth) => {
    const boardOutcomes = [];
    const moveValues = [];
    //Try all moves
        //If move is valid, duplicate a new board
        //Make move on duplicated board
        //Add to move to boardOutcomes
        //Else if move is invalid, push a NaN

    for (let move = 0; move<8; move++){
        
        const newBoard = new Board(prevBoard.copyBoard());
        const moveIsValid = newBoard.add(move,currPlayer);

        if (moveIsValid){
            boardOutcomes.push(newBoard);
        } else {
            //placeholder, change if any problems
            boardOutcomes.push(0);
        }
    }
    console.log(boardOutcomes);

    //Check result of all moves
    for ( const board of boardOutcomes ){
        if (board === 0){
            moveValues.push(0);
        } else {
            const outcome = board.checkWin();
            if (outcome.result === false ){
                //Game doesn't end:
                // **Recursion start** //
                if (depth === 1){
                    moveValues.push(0);
                } else {
                    moveValues.push(medBot(board,botPlayerNum,currPlayer%2+1,highestDepth,depth-1))
                }
                // **Recursion end** //                
            } else {
                //Game ends:
                if (outcome.player === botPlayerNum){
                    //bot wins
                    moveValues.push(depth);
                } else if(outcome.player === 0){
                    //draw
                    moveValues.push(depth-1);
                } else {
                    //player wins
                    moveValues.push(-depth);
                }
            }
        }
    }

    //Determine max/min value preferred by currPlayer
    //if function returns NaN, then there is an error
    let preferredValue = NaN;
    if (currPlayer === botPlayerNum){
        preferredValue = Math.max(...moveValues);
    } else {
        preferredValue = Math.min(...moveValues)
    }

    //If depth is at highest level
    if (depth === highestDepth){

        const highestValueMoveList = [];
        for (let ind=0;ind<moveValues.length;ind++){
            if(moveValues[i] === preferredValue){
                highestValueMoveList.push(ind);
            }
        }

        //Test if move is valid
        let randomChoice = 0;
        let chosenMove = 0;
        let moveIsValid = false;
        while(moveIsValid===false){
            const testBoard = new Board(prevBoard.copyBoard());
            randomChoice = Math.floor(Math.random()*highestValueMoveList.length);
            chosenMove = highestValueMoveList[randomChoice];
            moveIsValid = testBoard.add(chosenMove,botPlayerNum);
        }
        
        makeMove(chosenMove,botPlayerNum);
        return chosenMove;


    } else if (depth !== highestDepth){
        return preferredValue;
    }

}