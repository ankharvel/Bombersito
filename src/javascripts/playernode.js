exports.newPlayer = function(){
    player = {
        x:-1,
        y:-1,
        letter:"Z",
        rows:[],
        lastMov:"",
        countDown: -1,
        bombDown: -1,
        updatePower:function(){initialize()},
        updateMap:function(data){updateChart(data, this.letter)},
        move:function(){return superMoveBot()}
  };
  return player;
};

function initialize(){
    toPrint = {
        pMode: "",
        pUser: "",
        pDate: ""
    };
    pMode = true;
    pUser = true;
    pDate = false;
    this.bombDown = 0;
    this.countDown = 0;
}

function superMoveBot(){
    var d = new Date();
    pDate ? console.log("Init date: " + d.getSeconds() + d.getMilliseconds()/1000) : pDate;
    var mov = evaluate(moveBot());
    this.lastMov = mov;
    pUser ? console.log("Soy__: " + this.letter + " ___voy: " + mov) : pUser;
    d = new Date();
    pDate ? console.log("Finish date: " + d.getSeconds() + d.getMilliseconds()/1000) : pDate;
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
        nextMov: ""
    };
    fillStatistics();

    var areBombs = booleanResult(closeBombs);
    var areExits = calc_exits(emptyCells);
    var totalLBlocks = calc_totals(compassLBlocks);
    var totalTargets = calc_totals(closeTargets);

    printConsole(areBombs, areExits, totalLBlocks, totalTargets);

    if(areBombs){
        this.countDown = 0;
        if(this.bombDown <= 0){
            this.bombDown = 2;
        }
        return  henMode();
    }

    if(this.countDown > 0){
        return hunterMode();
    }

    if(this.countDown <= 0){
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
    if(this.bombDown > 0){
        this.bombDown--;
    }

    var index = selectMaxIndex(compassRisk, false);
    return findNewPath(index);
}

function findNewPath(index){
    var result = "P";
    switch (index){
        case 0:
            result = ((compassRisk[index]<100 && emptyCells[index]) ?  "O" : findNewPath(1));
            break;
        case 1:
            result = ((compassRisk[index]<100 && emptyCells[index]) ?  "N" : findNewPath(2));
            break;
        case 2:
            result = ((compassRisk[index]<100 && emptyCells[index]) ?  "E" : findNewPath(3));
            break;
        case 3:
            result = ((compassRisk[index]<100 && emptyCells[index]) ?  "S" : "P");
            break;
        default:
            result = "P";
            break;
    }
    return result;
}

function greedMode(){
    pMode ? console.log("greedMode") : pMode;
    if(this.nextMov != "?"){
        return this.nextMov;
    }
    return henMode();
}

function bomberMode(){
    pMode ? console.log("bomberMode") : pMode;
    var index = selectMaxIndex(compassLBlocks, true);
    switch (index){
        case 0:
            return (areCloseBlocks(index, /L/) ? "BO" : "O");
            break;
        case 1:
            return (areCloseBlocks(index, /L/) ? "BN" : "N");
            break;
        case 2:
            return (areCloseBlocks(index, /L/) ? "BE" : "E");
            break;
        case 3:
            return (areCloseBlocks(index, /L/) ? "BS" : "S");
            break;
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
            break;
        case 1:
            return (areCloseBlocks(index, /A|B|C|D/) ? "BN" : "N");
            break;
        case 2:
            return (areCloseBlocks(index, /A|B|C|D/) ? "BE" : "E");
            break;
        case 3:
            return (areCloseBlocks(index, /A|B|C|D/) ? "BS" : "S");
            break;
        default:
            return "P";
    }
}

function hunterMode(){
    pMode ? console.log("hunterMode") : pMode;
    if(this.countDown<=0){
        this.countDown = 3;
    } else if(calc_totals(closeTargets)>0){
        if(calc_exits(emptyCells)){
            this.countDown = 0;
            return killerMode();
        }
    } else {
        this.countDown--;
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
    if(this.x <= targetPos[0] && this.y <= targetPos[1]){
        compassOrder = [2,3,0,1];
    } else if(this.x <= targetPos[0] && this.y > targetPos[1]){
        compassOrder = [1,2,3,0];
    } else if(this.x > targetPos[0] && this.y <= targetPos[1]){
        compassOrder = [3,0,1,2];
    } else if(this.x > targetPos[0] && this.y > targetPos[1]){
        compassOrder = [0,1,2,3];
    }

    for(var i=0; i<4; i++){
        if(emptyCells[compassOrder[i]]){
            switch (compassOrder[i]){
                case 0:
                    return throwBomb ? "BO" : "O";
                    break;
                case 1:
                    return throwBomb ? "BN" : "N";
                    break;
                case 2:
                    return throwBomb ? "BE" : "E";
                    break;
                case 3:
                    return throwBomb ? "BS" : "S";
                    break;
            }
        }
    }
    return "P";
}

function evaluate(mov){
    var areBombs = booleanResult(closeBombs);
    var areExits = calc_exits(emptyCells);
    if(!areBombs && areExits && this.bombDown <= 0){
        switch (mov){
            case "P":
                return mov;
                break;
            case "BO":
                return mov;
                break;
            case "BN":
                return mov;
                break;
            case "BE":
                return mov;
                break;
            case "BS":
                return mov;
                break;
            case "O":
                return this.lastMov != "E" && anyFarRisk(this.x-1, this.y) ? mov : findNewPath(1);
                break;
            case "N":
                return this.lastMov != "S" && anyFarRisk(this.x, this.y-1) ? mov : findNewPath(2);
                break;
            case "E":
                return this.lastMov != "O" && anyFarRisk(this.x+1, this.y) ? mov : findNewPath(3);
                break;
            case "S":
                return this.lastMov != "N" && anyFarRisk(this.x, this.y+1) ? mov : findNewPath(0);
                break;
            default:
                return mov;
        }
    } else {
        switch (mov){
            case "O":
                return anyFarRisk(this.x-1, this.y) ? mov : findNewPath(1);
                break;
            case "N":
                return anyFarRisk(this.x, this.y-1) ? mov : findNewPath(2);
                break;
            case "E":
                return anyFarRisk(this.x+1, this.y) ? mov : findNewPath(3);
                break;
            case "S":
                return anyFarRisk(this.x, this.y+1) ? mov : findNewPath(0);
                break;
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
            newX = this.x;
            newY = this.y;
            break;
        case 0:
            newX = this.x - 1;
            newY = this.y;
            break;
        case 1:
            newX = this.x;
            newY = this.y - 1;
            break;
        case 2:
            newX = this.x + 1;
            newY = this.y;
            break;
        case 3:
            newX = this.x;
            newY = this.y + 1;
            break;
    }

    if(type.test(getNear(newX-1, newY))){
        this.nextMov = (index == -1 ? "O" : "?");
        return true;
    } else if(type.test(getNear(newX, newY-1))){
        this.nextMov = (index == -1 ? "N" : "?");
        return true;
    } else if(type.test(getNear(newX+1, newY))){
        this.nextMov = (index == -1 ? "E" : "?");
        return true;
    } else if(type.test(getNear(newX, newY+1))){
        this.nextMov = (index == -1 ? "S" : "?");
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
    this.y = Math.floor(pos/this.rows.length);
    this.x = pos%(this.rows).length;
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
    var wCells = [this.x-1, this.x-2, -1, this.y-1, this.y, this.y+1];
    var nCells = [this.x-1, this.x, this.x+1, this.y-1, this.y-2, -1];
    var eCells = [this.x+1, this.x+2, -1, this.y-1, this.y, this.y+1];
    var sCells = [this.x-1, this.x, this.x+1, this.y+1, this.y+2, -1];
    var emptyRegex = /_|#|a|b|c|d|V|P/;

    if(this.bombDown == 1){
        compassRisk = [
            this.lastMov == "E" ? getRisk(wCells) + 100: getRisk(wCells),
            this.lastMov == "S" ? getRisk(nCells) + 100: getRisk(nCells),
            this.lastMov == "O" ? getRisk(eCells) + 100: getRisk(eCells),
            this.lastMov == "N" ? getRisk(sCells) + 100: getRisk(sCells)
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
        emptyRegex.test(getNear(this.x-1, this.y)),
        emptyRegex.test(getNear(this.x, this.y-1)),
        emptyRegex.test(getNear(this.x+1, this.y)),
        emptyRegex.test(getNear(this.x, this.y+1))
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
    var bombArray2 = [
        getNear(posX-2, posY),
        getNear(posX, posY-2),
        getNear(posX+2, posY),
        getNear(posX, posY+2)
    ];
    console.log(bombArray2);
    var bombArray = [
        bombRegex.test(getNear(posX-2, posY)),
        bombRegex.test(getNear(posX, posY-2)),
        bombRegex.test(getNear(posX+2, posY)),
        bombRegex.test(getNear(posX, posY+2))
    ];
    console.log(bombArray);
    console.log(!booleanResult(bombArray));
    return !booleanResult(bombArray);
}

function getValue(cellValue) {
    switch (cellValue) {
        case "X":
            return 6;
            break;
        case "#":
            return 1;
            break;
        case "L":
            return 2;
            break;
        case "_":
            return 1;
            break;
        case "V":
            return -10;
            break;
        case "P":
            return -10;
            break;
        case "A":
        case "B":
        case "C":
        case "D":
            return 2;
            break;
        case "3":
        case "2":
            return 50;
        case "1":
            return 100;
            break;
        case "a":
        case "b":
        case "c":
        case "d":
            return 1;
            break;
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
//    console.log("Position = " + this.x + ", " + this.y);
//    console.log("Last movement: " + this.lastMov);
//    console.log(targetsPosition);
//    console.log("Count down: " + this.countDown);
    console.log(this.data);
}

