exports.newPlayer = function(){
  var player = {
    x:-1,
    y:-1,
    letter:"Z",
    map:[],
      nearCells:[],
    updateMap:function(data){
      this.map=[];
      var rows = data.split("\n");
        for(var i=0; i<rows.length; i++){
//      this.map.push(rows[i].split(","));
        }
      var pos = data.indexOf(this.letter)/2;
        console.log("pos = " + pos);
      this.y = Math.floor(pos/rows.length);
      this.x = pos%rows.length;
        console.log("x = "+this.x);
        console.log("y = "+this.y);

        this.nearCells =new Array(getNear(this.x-1,this.y,rows),getNear(this.x,this.y-1,rows),getNear(this.x+1,this.y,rows), getNear(this.x,this.y+1,rows));
//        console.log("Near cells = " + this.nearCells);
    },
    move:function(){
      var mov=Math.floor(Math.random()*7)+1;
      switch(mov){
          case 0:
              return "N";
              break;
          case 1:
              return "E";
              break;
          case 2:
              return "S";
              break;
          case 3:
              return "O";
              break;
          case 4:
//              return "BN";
              return "N";
              break;
          case 5:
//              return "BE";
              return "E";
              break;
          case 6:
//              return "BS";
              return "S";
              break;
          case 7:
//              return "BO";
              return "O";
              break;
          }
    }
  };
  return player;


}

function getRisk(x1, x2, x3, y1, y2, y3, rows){
    var xArray = new Array(x1, x2, x3);
    var yArray = new Array(y1, y2, y3);
    var result = 0;

    for(var i=0; i<xArray.length; i++){
        for(var j=0; j<yArray.length; j++){
            if(xArray[i]!= -1 && yArray[j] != -1){
                result += getValue(getNear(xArray[i], yArray[j], rows));
            }
        }
    }
    return result;
}


function getNear(x,y,rows)
{
    var rRow = rows[y].split(",");
    return rRow[x];
}

function getValue(cellValue){
    switch (cellValue){
        case "X":
            return 5;
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
            return 8;
            break;
        case "3":
        case "2":
        case "1":
            return 10;
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




