'use strict';

const medBot = (prevBoard,botPlayerNum,currPlayer,highestDepth,depth) => {
    const boardOutcomes = [];
    const moveValues = [];
    //Try all moves ${depth} steps deep
    //Assign values to each outcome
    //Return max outcome for bot's turn and min outcome for player's turn

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
    // console.log(boardOutcomes);

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
            if(moveValues[ind] === preferredValue){
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