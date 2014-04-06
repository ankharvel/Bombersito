exports.newPlayer = function(){
    player = {
        x:-1,
        y:-1,
        letter:"Z",
        rows:[],
        updateMap:function(data){updateChart(data, this.letter)},
        move:function(){return moveBot()}
  };
  return player;
};

//exports.operations = function(){
//    operations = {
//        numer: -1,
//        getCellValue: function(name){
//            numer = getValue(name);
//        }
//    };
//    return operations;
//};

function moveBot(){
    statistics = {
        compassRisk: [],
        compassXBlocks: [],
        compassLBlocks: [],
        emptyCells: [],
        closeBombs: [],
        closeTargets: [],
        nextMov: "",
        lastMov: ""
    };
    fillStatistics();

    var areBombs = booleanResult(closeBombs);
    var areExits = calc_exits(emptyCells);
    var totalLBlocks = calc_totals(compassLBlocks);
    var totalTargets = calc_totals(closeTargets);
    var mov;

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

    if(areBombs){
        console.log("henMode");
        return  henMode();
    }

    if(areVPBlocks()){
        console.log("greedMode");
        return greedMode();
    }

    if(areExits && (totalLBlocks>0 || totalTargets>0)){
        if(totalTargets>0){
            console.log("killerMode");
            return killerMode();
        } else {
            console.log("bomberMode");
            return bomberMode();
        }
    }

    return hunterMode();

//    if(evaluate(mov, this.lastMov) || areBombs){
//        this.lastMov = mov;
//        return mov;
//    } else {
//        this.lastMov = mov;
//        return mov;
//    }

/*    var mov=Math.floor(Math.random()*3)+1;
    switch(mov){
        case 0: return "N"; break;
        case 1: return "E"; break;
        case 2: return "S"; break;
        case 3: return "O"; break;
    }*/
}

function henMode(){
    var index = selectMaxIndex(compassRisk, false);
    switch (index){
        case 0:
            return (compassRisk[index] < 100 ?  "O" : "P");
            break;
        case 1:
            return (compassRisk[index] < 100 ?  "N" : "P");
            break;
        case 2:
            return (compassRisk[index] < 100 ?  "E" : "P");
            break;
        case 3:
            return (compassRisk[index] < 100 ?  "S" : "P");
            break;
        default:
            return "P";
    }
}

function greedMode(){
    if(this.nextMov != "?"){
        return this.nextMov;
    }
    return henMode();
}

function bomberMode(){
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
    var mov=Math.floor(Math.random()*3)+1;
    switch(mov){
        case 0: return "N"; break;
        case 1: return "E"; break;
        case 2: return "S"; break;
        case 3: return "O"; break;
    }
    return "P";
}

function evaluate(mov, lastMov){
    switch (mov){
        case /P|BO|BN|BE|BS/:
            return true;
            break;
        case "O":
            return lastMov != "E";
            break;
        case "N":
            return lastMov != "S";
            break;
        case "E":
            return lastMov != "O";
            break;
        case "S":
            return lastMov != "N";
            break;
        default:
            return true;

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
    var newArray = ([]).concat(array);
    return newArray.sort()[array.length-1];
}

function calc_min(array, i){
    var newArray = ([]).concat(array);
    return newArray.sort()[0];
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
    this.rows = data.split("\n");
    var pos = data.indexOf(letter)/2;
    this.y = Math.floor(pos/this.rows.length);
    this.x = pos%(this.rows).length;
}

function fillStatistics(){
    var wCells = new Array(this.x-1, this.x-2, -1, this.y-1, this.y, this.y+1);
    var nCells = new Array(this.x-1, this.x, this.x+1, this.y-1, this.y-2, -1);
    var eCells = new Array(this.x+1, this.x+2, -1, this.y-1, this.y, this.y+1);
    var sCells = new Array(this.x-1, this.x, this.x+1, this.y+1, this.y+2, -1);
    var emptyRegex = /_|#|a|b|c|d|V|P/;

    compassRisk = new Array(
        getRisk(wCells), getRisk(nCells), getRisk(eCells), getRisk(sCells)
    );
    compassXBlocks = new Array(
        getXBlocks(wCells), getXBlocks(nCells), getXBlocks(eCells), getXBlocks(sCells)
    );
    compassLBlocks = new Array(
        getLBlocks(wCells), getLBlocks(nCells), getLBlocks(eCells), getLBlocks(sCells)
    );
    emptyCells = new Array(
        emptyRegex.test(getNear(this.x-1, this.y)),
        emptyRegex.test(getNear(this.x, this.y-1)),
        emptyRegex.test(getNear(this.x+1, this.y)),
        emptyRegex.test(getNear(this.x, this.y+1))
    );

    closeBombs = new Array(
        areBombs(wCells), areBombs(nCells), areBombs(eCells), areBombs(sCells)
    );

    closeTargets = new Array(
        getTargets(wCells), getTargets(nCells), getTargets(eCells), getTargets(sCells)
    );
}

function getTotalByParameter(array, parameter){
    var xArray = new Array(array[0], array[1], array[2]);
    var yArray = new Array(array[3], array[4], array[5]);
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
        console.log("Bad argument getNear(" + x + "," + y + ")");
        return "Error";
    }
}

function getValue(cellValue){
    switch (cellValue){
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
            return 0;
            break;
        case "P":
            return 0;
            break;
        case "A":
        case "B":
        case "C":
        case "D":
            return 2;
            break;
        case "3":
        case "2":
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