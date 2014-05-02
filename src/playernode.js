try {
    exports.newPlayer = function () {
        player = {
            letter: "Z",
            rows: [],
            data: "",
            updatePower: function () {
                initialize()
            },
            updateMap: function (data) {
                updateChart(data, this.letter)
            },
            move: function () {
                return superMoveBot()
            }
        };
        return player;
    };
} catch (ReferenceError) {
        console.log(ReferenceError);
}

var bombDown, countDown, lastMov, x, y, moveHistory;
var pMode, pUser;

function initialize(){
    pMode = true;
    pUser = true;
    bombDown = 0;
    countDown = 0;
    moveHistory = [];
}

function superMoveBot(){
    var mov = evaluate(moveBot());
    lastMov = mov;
    pUser ? console.log("Soy__: " + this.letter + " ___voy: " + mov) : pUser;
    moveHistory = moveHistory.concat(lastMov);
    return mov;
}

function moveBot(){
    statistics = {
        compassRisk: [],
        compassXBlocks: [],
        compassLBlocks: [],
        emptyCells: [],
        closeBombs: [],
        closeTargets: [],
        targetsPosition: {},
        nextMove: ""
    };
    fillStatistics();

    var areBombs = booleanResult(closeBombs);
    var areExits = calc_exits(emptyCells);
    var totalLBlocks = calc_totals(compassLBlocks);
    var totalTargets = calc_totals(closeTargets);

    printConsole(areBombs, areExits, totalLBlocks, totalTargets);

    if(areBombs){
        countDown = 0;
        if(bombDown <= 0){
            bombDown = 2;
        }
        return  henMode();
    }

    if(countDown > 0){
        return hunterMode();
    }

    if(countDown <= 0){
        if(areVPBlocks()){
            return greedMode();
        }

        if(areExits && (totalLBlocks>0 || totalTargets>0)){
            if(totalTargets>0){
                return killerMode();
            } else {
                return bomberMode();
            }
        }
    }
    return hunterMode();
}

function henMode(){
    pMode ? console.log("henMode") : pMode;
    if(bombDown > 0){
        bombDown--;
    }

    var index = selectMaxIndex(compassRisk, false);
    return findNewPath(index);
}

function findNewPath(index){
    var result = "P";
    switch (index){
        case 0:
            result = ((compassRisk[index]<90 && emptyCells[index]) ?  "O" : findNewPath(1));
            break;
        case 1:
            result = ((compassRisk[index]<90 && emptyCells[index]) ?  "N" : findNewPath(2));
            break;
        case 2:
            result = ((compassRisk[index]<90 && emptyCells[index]) ?  "E" : findNewPath(3));
            break;
        case 3:
            result = ((compassRisk[index]<90 && emptyCells[index]) ?  "S" : "P");
            break;
        default:
            result = "P";
            break;
    }
    return result;
}

function greedMode(){
    pMode ? console.log("greedMode") : pMode;
    if(this.nextMove != "?"){
        return this.nextMove;
    }
    return henMode();
}

function bomberMode(){
    pMode ? console.log("bomberMode") : pMode;
    var index = selectMaxIndex(compassLBlocks, true);
    switch (index){
        case 0:
            return (areCloseBlocks(index, /L/) ? "BO" : "O");
        case 1:
            return (areCloseBlocks(index, /L/) ? "BN" : "N");
        case 2:
            return (areCloseBlocks(index, /L/) ? "BE" : "E");
        case 3:
            return (areCloseBlocks(index, /L/) ? "BS" : "S");
        default:
            return "P";
    }
}

function killerMode(){
    pMode ? console.log("killerMode") : pMode;
    var index = selectMaxIndex(closeTargets, true);
    switch (index){
        case 0:
            return (areCloseBlocks(index, /A|B|C|D/) ? "BO" : "O");
        case 1:
            return (areCloseBlocks(index, /A|B|C|D/) ? "BN" : "N");
        case 2:
            return (areCloseBlocks(index, /A|B|C|D/) ? "BE" : "E");
        case 3:
            return (areCloseBlocks(index, /A|B|C|D/) ? "BS" : "S");
        default:
            return "P";
    }
}

function hunterMode(){
    pMode ? console.log("hunterMode") : pMode;
    if(countDown<=0){
        countDown = 3;
    }
    if(calc_totals(closeTargets)>0){
        if(calc_exits(emptyCells)){
            countDown = 0;
            return killerMode();
        }
    } else {
        countDown--;
    }

    targets = ["A", "B", "C", "D"];
    for(var j=0; j<4; j++) {
        if (targets[j] != this.letter) {
            var targetPos = findTarget(targets[j], this.data);
            if(targetPos[0] > 0){
                break;
            }
        }
    }

    return obtainCompassMove(targetPos, false);
}

function obtainCompassMove(targetPos, throwBomb){
    var compassOrder = [];
    if(x <= targetPos[0] && y <= targetPos[1]){
        compassOrder = [2,3,0,1];
    } else if(x <= targetPos[0] && y > targetPos[1]){
        compassOrder = [1,2,3,0];
    } else if(x > targetPos[0] && y <= targetPos[1]){
        compassOrder = [3,0,1,2];
    } else if(x > targetPos[0] && y > targetPos[1]){
        compassOrder = [0,1,2,3];
    }

    for(var i=0; i<4; i++){
        if(emptyCells[compassOrder[i]]){
            switch (compassOrder[i]){
                case 0:
                    return throwBomb ? "BO" : "O";
                case 1:
                    return throwBomb ? "BN" : "N";
                case 2:
                    return throwBomb ? "BE" : "E";
                case 3:
                    return throwBomb ? "BS" : "S";
            }
        }
    }
    return "P";
}

function evaluate(mov){
    var areBombs = booleanResult(closeBombs);
    var areExits = calc_exits(emptyCells);
    if(!areBombs && areExits && bombDown <= 0){
        switch (mov){
            case "P":
                return mov;
            case "BO":
                return mov;
            case "BN":
                return mov;
            case "BE":
                return mov;
            case "BS":
                return mov;
            case "O":
                return lastMov != "E" && anyFarRisk(x-1, y) ? mov : findNewPath(1);
            case "N":
                return lastMov != "S" && anyFarRisk(x, y-1) ? mov : findNewPath(2);
            case "E":
                return lastMov != "O" && anyFarRisk(x+1, y) ? mov : findNewPath(3);
            case "S":
                return lastMov != "N" && anyFarRisk(x, y+1) ? mov : findNewPath(0);
            default:
                return "P";
        }
    } else {
        switch (mov){
            case "O":
                return anyFarRisk(x-1, y) ? mov : findNewPath(1);
            case "N":
                return anyFarRisk(x, y-1) ? mov : findNewPath(2);
            case "E":
                return anyFarRisk(x+1, y) ? mov : findNewPath(3);
            case "S":
                return anyFarRisk(x, y+1) ? mov : findNewPath(0);
            default:
                return mov;
        }
    }
}

function areVPBlocks(){
    for(var i=-1; i<4; i++){
        if(areCloseBlocks(i, /P|V/)){
            return true;
        }
    }
    return false;
}

function areCloseBlocks(index, type){
    var newX;
    var newY;
    switch (index){
        case -1:
            newX = x;
            newY = y;
            break;
        case 0:
            newX = x - 1;
            newY = y;
            break;
        case 1:
            newX = x;
            newY = y - 1;
            break;
        case 2:
            newX = x + 1;
            newY = y;
            break;
        case 3:
            newX = x;
            newY = y + 1;
            break;
    }

    if(type.test(getNear(newX-1, newY))){
        this.nextMove = (index == -1 ? "O" : "?");
        return true;
    } else if(type.test(getNear(newX, newY-1))){
        this.nextMove = (index == -1 ? "N" : "?");
        return true;
    } else if(type.test(getNear(newX+1, newY))){
        this.nextMove = (index == -1 ? "E" : "?");
        return true;
    } else if(type.test(getNear(newX, newY+1))){
        this.nextMove = (index == -1 ? "S" : "?");
        return true;
    } else {
        return false;
    }
}

function selectMaxIndex(array, selectMax){
    var i = 0;
    var availableArray = [];
    for(i=0; i<array.length; i++){
        if(emptyCells[i]){
            availableArray = availableArray.concat(array[i]);
        }
    }

    var targetValue =  selectMax ? calc_max(availableArray) : calc_min(availableArray);
    for(index=0; index<array.length; index++){
        if(emptyCells[index]){
            if(targetValue == array[index]){
                return index;
            }
        }
    }

    return -1;
}

function calc_max(array){
    var newArray = ([]).concat(array).sort(function(a,b){return b-a});
    return newArray[0];
}

function calc_min(array, i){
    var newArray = ([]).concat(array).sort(function(a,b){return a-b});
    return newArray[0];
}

function calc_totals(array) {
    return eval("(" + array.join(" + ") + ");");
}

function booleanResult(array) {
    return eval("(" + array.join(" || ") + ");");
}

function calc_exits(array) {
    return eval("((" + array.join(" ? 1 : 0) + (") + " ? 1 : 0));") >= 2;
}

function updateChart(data, letter){
    this.data = data;
    this.letter = letter;
    this.rows = data.split("\n");
    var pos = data.indexOf(letter)/2;
    y = Math.floor(pos/this.rows.length);
    x = pos%(this.rows).length;
}

function findTarget(target, data){
    targetPos = [];
    var pos = data.indexOf(target)/2;
    var posX = pos%(this.rows).length;
    var posY = Math.floor(pos/this.rows.length);
    targetPos = targetPos.concat([posX, posY]);
    return targetPos;
}

function fillStatistics(){
    var wCells = [x-1, x-2, -1, y-1, y, y+1];
    var nCells = [x-1, x, x+1, y-1, y-2, -1];
    var eCells = [x+1, x+2, -1, y-1, y, y+1];
    var sCells = [x-1, x, x+1, y+1, y+2, -1];
    var emptyRegex = /_|#|a|b|c|d|V|P/;

    if(bombDown == 1){
        compassRisk = [
            lastMov == "E" ? getRisk(wCells) + 100: getRisk(wCells),
            lastMov == "S" ? getRisk(nCells) + 100: getRisk(nCells),
            lastMov == "O" ? getRisk(eCells) + 100: getRisk(eCells),
            lastMov == "N" ? getRisk(sCells) + 100: getRisk(sCells)
        ];
    } else {
        compassRisk = [
            getRisk(wCells), getRisk(nCells), getRisk(eCells), getRisk(sCells)
        ];
    }

    compassXBlocks = [
        getXBlocks(wCells), getXBlocks(nCells), getXBlocks(eCells), getXBlocks(sCells)
    ];
    compassLBlocks = [
        getLBlocks(wCells), getLBlocks(nCells), getLBlocks(eCells), getLBlocks(sCells)
    ];
    emptyCells = [
        emptyRegex.test(getNear(x-1, y)),
        emptyRegex.test(getNear(x, y-1)),
        emptyRegex.test(getNear(x+1, y)),
        emptyRegex.test(getNear(x, y+1))
    ];

    closeBombs = [
        areBombs(wCells), areBombs(nCells), areBombs(eCells), areBombs(sCells)
    ];

    closeTargets = [
        getTargets(wCells), getTargets(nCells), getTargets(eCells), getTargets(sCells)
    ];

    targetsPosition = {};
    targetsPosition['A'] = [findTarget("A", this.data)];
    targetsPosition['B'] = [findTarget("B", this.data)];
    targetsPosition['C'] = [findTarget("C", this.data)];
    targetsPosition['D'] = [findTarget("D", this.data)];

}

function getTotalByParameter(array, parameter){
    var xArray = [array[0], array[1], array[2]];
    var yArray = [array[3], array[4], array[5]];
    var bombRegex = /1|2|3/;
    var targetRegex = /A|B|C|D/;
    var result = 0;

    for(var i=0; i<xArray.length; i++){
        for(var j=0; j<yArray.length; j++){
            if(xArray[i] >= 0 && xArray[i] <= 10 && yArray[j] >= 0 && yArray[j] <= 10){
                var cellData = getNear(xArray[i], yArray[j]);
                switch (parameter){
                    case "Risk":
                        result += getValue(cellData);
                        break;
                    case "Bombs":
                        if(bombRegex.test(cellData)){
                            result += 1;
                        }
                        break;
                    case "Targets":
                        if(targetRegex.test(cellData)){
                            result += 1;
                        }
                        break;
                    default :
                        if( cellData == parameter){
                            result += 1;
                        }
                }
            }
        }
    }
    return result;
}

function getRisk(array){
    return getTotalByParameter(array, "Risk");
}

function getXBlocks(array){
    return getTotalByParameter(array, "X");
}

function getLBlocks(array){
    return getTotalByParameter(array, "L");
}

function areBombs(array){
    return getTotalByParameter(array, "Bombs") > 0;
}

function getTargets(array){
    return getTotalByParameter(array, "Targets");
}

function getNear(x,y) {
    try{
        var rRow = this.rows[y].split(",");
        return rRow[x];
    }catch(err){
        return "Error";
    }
}

function anyFarRisk(posX, posY){
    var bombRegex = /1/;
    var bombArray = [
        bombRegex.test(getNear(posX-2, posY)) || bombRegex.test(getNear(posX-3, posY)),
        bombRegex.test(getNear(posX, posY-2)) || bombRegex.test(getNear(posX, posY-3)),
        bombRegex.test(getNear(posX+2, posY)) || bombRegex.test(getNear(posX+3, posY)),
        bombRegex.test(getNear(posX, posY+2)) || bombRegex.test(getNear(posX, posY+3))
    ];
    console.log(bombArray);
    console.log(!booleanResult(bombArray));
    return !booleanResult(bombArray);
}

function getValue(cellValue) {
    switch (cellValue) {
        case "X":
            return 6;
        case "#":
            return 1;
        case "L":
            return 2;
        case "_":
            return 1;
        case "V":
            return -10;
        case "P":
            return -10;
        case "A":
        case "B":
        case "C":
        case "D":
            return 2;
        case "3":
        case "2":
            return 50;
        case "1":
            return 100;
        case "a":
        case "b":
        case "c":
        case "d":
            return 1;
        default :
            return 10;
    }
}

function printConsole(areBombs, areExits, totalLBlocks, totalTargets){
//    console.log("Risk = " + compassRisk);
//    console.log("XBlocks = " + compassXBlocks);
//    console.log("LBlocks = " + compassLBlocks);
//    console.log("EmptyCells = " + emptyCells);
//    console.log("CloseBombs = " + closeBombs);
//    console.log("CloseTargets = " + closeTargets);
//    console.log("Total L Blocks = " + totalLBlocks);
//    console.log("Are bombs = " + areBombs);
//    console.log("Are targets = " + totalTargets>0);
//    console.log("Are Exits = " + areExits);
//    console.log("Are VP Blocks = " + areVPBlocks());
//    console.log("Index = " + selectMaxIndex(compassRisk, true));
    console.log("Position = " + x + ", " + y);
//    console.log("Last movement: " + lastMov);
//    console.log(targetsPosition);
    console.log("Count down: " + countDown);
    console.log(this.data);
}

