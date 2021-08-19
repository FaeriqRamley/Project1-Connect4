'use strict';

class Board {
    constructor(
        board = [
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0]
        ]
    ){
        this.board = board;
    }

    copyBoard () {
        let duplicate = [];

        for (let row of this.board){
            const duplicateRow = [];
            for(let col of row){
                duplicateRow.push(col);
            }
            duplicate.push(duplicateRow);
        }
        
        return duplicate;
    }

    add (col,currPlayer){
        if (this.board[0][col] !== 0){
            // console.log("Column is full. Pick another")
            return false

        } else {
            for (let i=1;i<this.board.length;i++){
                if(this.board[i][col] !== 0){
                    this.board[i-1][col] = currPlayer;
                    return true;
                }
            }
            this.board[this.board.length-1][col] = currPlayer;
            return true;
        }
    }

    checkWin(){
        const boardCols = this.board[0].length;
        const boardRows = this.board.length;
        
        //Draw Check
        let boardFull = true;
        for (const col of this.board[0]){
            if(col === 0){
                boardFull = false;
            }
        }

        if(boardFull === true){
            return {
                result: true,
                player: 0
            }
        }


        //Row Victory Check
        for (const row of this.board){
            for (let i=0; i < boardCols-3; i++){
                if (row[i] !== 0){
                    if (row[i] === row[i+1] && row[i+1] === row[i+2] && row[i+2] === row[i+3]){
                        return {
                            result: true,
                            player: row[i]
                        };
                    }
                }
            }
        }
        
        //Col Victory Check
        for (let col = 0; col<boardCols; col++){

            for (let row = 0; row<boardRows-3; row++){
                if (this.board[row][col] !== 0){
                    if (
                        this.board[row][col] === this.board[row+1][col] &&
                        this.board[row+1][col] === this.board[row+2][col] &&
                        this.board[row+2][col] === this.board[row+3][col]
                    ){
                        return {
                            result: true,
                            player: this.board[row][col]
                        };
                    }
                }
            }
        }

        //TopLeft to BotRight Diag Victory Check
        for (let row = 0; row < boardRows-3; row++){
            for (let col = 0; col < boardCols-3; col++){
                if(
                    this.board[row][col] !== 0 &&
                    this.board[row][col] === this.board[row+1][col+1] &&
                    this.board[row+1][col+1] === this.board[row+2][col+2] &&
                    this.board[row+2][col+2] === this.board[row+3][col+3]
                ){
                    // console.log(this.board[row][col],this.board[row+1][col+1],this.board[row+2][col+2],this.board[row+3][col+3])
                    return {
                        result: true,
                        player: this.board[row][col]
                    };
                }
            }
        }

        //TopRight to BotLeft Victory Check
        for (let row = 0; row < boardRows-3; row++){
            for (let col = 3; col < boardCols; col++){
                if(
                    this.board[row][col] !== 0 &&
                    this.board[row][col] === this.board[row+1][col-1] &&
                    this.board[row+1][col-1] === this.board[row+2][col-2] &&
                    this.board[row+2][col-2] === this.board[row+3][col-3]
                ){
                    // console.log(this.board[row][col],this.board[row+1][col-1],this.board[row+2][col-2],this.board[row+3][col-3])
                    return {
                        result: true,
                        player: this.board[row][col]
                    };
                }
            }
        }
        return {result: false,player:0}
    }
}

const minmaxBot = (prevBoard,botPlayerNum,currPlayer,highestDepth,depth) => {
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

    //Check result of all moves
    for ( const board of boardOutcomes ){
        if (board === 0){
            moveValues.push(highestDepth+100);
        } else {
            const outcome = board.checkWin();
            if (outcome.result === false ){
                //Game doesn't end:
                // **Recursion start** //
                if (depth === 1){
                    moveValues.push(0);
                } else {
                    moveValues.push(minmaxBot(board,botPlayerNum,currPlayer%2+1,highestDepth,depth-1))
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
        //Convert invalid moves to a large negative so it will nvr be chosen
        for (let ind=0;ind<moveValues.length;ind++){
            if (moveValues[ind] === highestDepth+100){
                moveValues[ind] = -(highestDepth+100);
            }
        }
        preferredValue = Math.max(...moveValues);

    } else {
        preferredValue = Math.min(...moveValues)
    }
    
    if(depth===highestDepth){
        console.log(`At depth ${depth}`)
        console.log(moveValues);
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
        const testBoard = new Board(prevBoard.copyBoard());
        randomChoice = Math.floor(Math.random()*highestValueMoveList.length);
        chosenMove = highestValueMoveList[randomChoice];
        
        makeMove(chosenMove,botPlayerNum);
        return chosenMove;


    } else if (depth !== highestDepth){
        return preferredValue;
    }

}

const botNoiseFiles = {
    easy_bot: {
        intro: 0,
        playing: 4,
        win: 0,
        lose: 2
    },
    medium_bot: {
        intro: 3,
        playing: 7,
        win: 3,
        lose: 1
    },
    hard_bot: {
        intro: 0,
        playing: 6,
        win: 1,
        lose: 1
    }
}

const playBotSounds = (botName,status,playChance=1.0) => {
    const rollChance = Math.random();
    if (rollChance<playChance){
        console.log("Play sound")
        const botFiles = botNoiseFiles[botName];
        const fileAmount = botFiles[status];
        if (fileAmount === 0){
            return null;
        }
        const chosenFile = Math.floor(Math.random()*fileAmount);

        const audioURL = `../Assets/Sounds/Bot_Noises/${botName}_${status}_${chosenFile}.mp3`;
        const audio = new Audio(audioURL);
        audio.addEventListener("canplay", () => audio.play());

    } else{
        console.log("Don't play sound")
    }
}