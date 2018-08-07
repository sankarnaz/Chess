var selCoin,turn,pl1,pl2;

function generateBoard()
{
    var f=1;
    var board = document.createElement("DIV");
    board.setAttribute("align","center");
    board.style.marginTop="100px";
    for(var i=1;i<=8;i++)
    {
    	for(var j=1;j<=8;j++)
    	{
    		var cell = document.createElement("SPAN");
    		cell.setAttribute("id","cell_"+i+"_"+j);
    		cell.className = f==1 ? "White" : "Black";
    		f*=-1;
    		board.appendChild(cell);
    	}
    	f*=-1;
    	board.appendChild(document.createElement("BR"));
    }
    document.body.appendChild(board);
    loadCoins("White","Black");
}

function loadCoins(p1,p2)
{
    pl1=p1;
    pl2=p2;
    turn = p1 == "White" ? 1 : -1;
    selCoin = "";
    coins = ["Rook","Knight","Bishop","Queen","King","Bishop","Knight","Rook"];
    if(p1 == "Black")
    {
    	coins[3] = "King";
	coins[4] = "Queen";
    }
    for(var i=1;i<=8;i++)
    {
	var row = document.getElementById("cell_1_"+i);	//King row for player 2
        //row.removeEventListener("click",placeCoin);
        var coin = document.createElement("DIV");
        coin.addEventListener("click", selectCoin);
        coin.className = p2 + coins[i - 1];
        row.appendChild(coin);
        row = document.getElementById("cell_2_" + i);		//Pawn row for player 2
        //row.removeEventListener("click",placeCoin);
        coin = document.createElement("DIV");
        coin.addEventListener("click", selectCoin);
        coin.className = p2 + "Pawn";
        row.appendChild(coin);
        //---------------------------------------------------------------------
        row = document.getElementById("cell_8_" + i);		//King row for player 1
        //row.removeEventListener("click",placeCoin);
        coin = document.createElement("DIV");
        coin.addEventListener("click", selectCoin);
        coin.className = p1 + coins[i - 1];
        row.appendChild(coin);
        row = document.getElementById("cell_7_" + i);		//Pawn row for player 1
        //row.removeEventListener("click",placeCoin);
        coin = document.createElement("DIV");
        coin.addEventListener("click", selectCoin);
        coin.className = p1 + "Pawn";
        row.appendChild(coin);
    }

}

function getPosition(cell)
{
    var cell_id = cell.id;
    var nums = cell_id.substring(cell_id.indexOf("cell_")+5);
    return {x:parseInt(nums.substring(0,nums.indexOf("_"))),y:parseInt(nums.substring(nums.indexOf("_")+1))};
}

function getPlayer(coin)
{
    return coin.className.indexOf(pl1)!=-1 ? "p1" : "p2";
}

function checkTurn(coin)
{
    return ((turn == 1 && getPlayer(coin)=="p1") || (turn == -1 && getPlayer(coin)=="p2"));
}

function selectCoin()
{
    if(checkTurn(this))
    {
        removePossibilities();
        if(selCoin == this)
        {
            selCoin = undefined;
            return;
        }
        if(this.className.indexOf("Pawn")!=-1)
        {
            possiblePawn(this);
        }
        else if(this.className.indexOf("Bishop")!=-1)
        {
            possibleBishop(this);
        }
        else if(this.className.indexOf("Rook")!=-1)
        {
            possibleRook(this);
        }
        else if(this.className.indexOf("Queen")!=-1)
        {
            possibleQueen(this);
        }
        else if(this.className.indexOf("Knight")!=-1)
        {
            possibleKnight(this);
        }
        else if(this.className.indexOf("King")!=-1)
        {
            possibleKing(this);
        }
	selCoin = this;
    }
}

function placeCoin()
{
    if(selCoin != "")
    {
    	var coin = selCoin.cloneNode(true);
	coin.addEventListener("click",selectCoin);
	if(this.childElementCount>0)
	{
		this.removeChild(this.childNodes[0]);
	}
	this.appendChild(coin);
	selCoin.parentNode.removeChild(selCoin);
	this.removeEventListener("click",placeCoin);
	selCoin = "";
	turn*=-1;
    }
}

function possibleBishop(coin)       //Bishop's possible moves
{
    var cell = coin.parentNode;
    var pos = getPosition(cell);
    var temp = {x:pos.x,y:pos.y};
    while((pos.x-- > 1 && pos.y-- > 1) && markPossibleCells(coin,pos));
    pos = {x:temp.x,y:temp.y};
    while((pos.x-- > 1 && pos.y++ < 8) && markPossibleCells(coin,pos));
    pos = {x:temp.x,y:temp.y};
    while((pos.x++ < 8 && pos.y++ < 8) && markPossibleCells(coin,pos));
    pos = {x:temp.x,y:temp.y};
    while((pos.x++ < 8 && pos.y-- > 1) && markPossibleCells(coin,pos));
}

function possibleRook(coin)       //Bishop's possible moves
{
    var cell = coin.parentNode;
    var pos = getPosition(cell);
    var temp = {x:pos.x,y:pos.y};
    while((pos.x-- > 1) && markPossibleCells(coin,pos));
    pos = {x:temp.x,y:temp.y};
    while((pos.x++ < 8) && markPossibleCells(coin,pos));
    pos = {x:temp.x,y:temp.y};
    while((pos.y++ < 8) && markPossibleCells(coin,pos));
    pos = {x:temp.x,y:temp.y};
    while((pos.y-- > 1) && markPossibleCells(coin,pos));
}

function possibleQueen(coin)
{
    possibleBishop(coin);
    possibleRook(coin);
}

function possibleKnight(coin)
{
    var cell = coin.parentNode;
    var pos = getPosition(cell);
    checkBoundaryAndMark(coin,{x:pos.x-2,y:pos.y-1});
    checkBoundaryAndMark(coin,{x:pos.x-2,y:pos.y+1});
    checkBoundaryAndMark(coin,{x:pos.x+2,y:pos.y-1});
    checkBoundaryAndMark(coin,{x:pos.x+2,y:pos.y+1});
    checkBoundaryAndMark(coin,{x:pos.x-1,y:pos.y-2});
    checkBoundaryAndMark(coin,{x:pos.x-1,y:pos.y+2});
    checkBoundaryAndMark(coin,{x:pos.x+1,y:pos.y-2});
    checkBoundaryAndMark(coin,{x:pos.x+1,y:pos.y+2});
}

function possibleKing(coin)
{
    var cell = coin.parentNode;
    var pos = getPosition(cell);
    checkBoundaryAndMark(coin,{x:pos.x-1,y:pos.y});
    checkBoundaryAndMark(coin,{x:pos.x+1,y:pos.y});
    checkBoundaryAndMark(coin,{x:pos.x,y:pos.y-1});
    checkBoundaryAndMark(coin,{x:pos.x,y:pos.y+1});
    checkBoundaryAndMark(coin,{x:pos.x-1,y:pos.y-1});
    checkBoundaryAndMark(coin,{x:pos.x-1,y:pos.y+1});
    checkBoundaryAndMark(coin,{x:pos.x+1,y:pos.y+1});
    checkBoundaryAndMark(coin,{x:pos.x+1,y:pos.y-1});
}

function checkBoundaryAndMark(coin,pos)
{
    if(pos.x > 0 && pos.x < 9 && pos.y > 0 && pos.y < 9)
    {
        markPossibleCells(coin,pos);
    }
}
function markPossibleCells(coin,pos)
{
    var posCell = document.getElementById("cell_"+pos.x+"_"+pos.y);
    if(posCell.childElementCount>0)
    {
        possibleAttack(coin,pos);
        return false;
    }
    setPossibleMove(posCell);
    return true;
}


function possiblePawn(coin)         //Pawn's possible moves
{
	var cell = coin.parentNode;
	var pos = getPosition(cell);
	var blocked = setPawnMove(coin,pos);
        if(!blocked && ((pos.x == 7 && getPlayer(coin)=="p1") || (pos.x == 2 && getPlayer(coin)=="p2")))
        {
            setPawnMove(coin,{x:getPlayer(coin)=="p1"?pos.x-1:pos.x+1,y:pos.y});
        }
        var player = getPlayer(coin);
        possibleAttack(coin,player=="p1"?{x:pos.x-1,y:pos.y-1}:{x:pos.x+1,y:pos.y+1});     //check left attack
        possibleAttack(coin,player=="p1"?{x:pos.x-1,y:pos.y+1}:{x:pos.x+1,y:pos.y-1});     //check right attack
        if((player=="p1" && pos.x == 2) || (player=="p2" && pos.x == 7))
        {
            var possible = document.getElementsByClassName("Possible");
            for(var i=0; i<possible.length; i++)
            {
                possible[i].addEventListener("click",addNewQueen);
            }
        }
}

function addNewQueen()
{
    var coin = document.createElement("DIV");
    coin.addEventListener("click", selectCoin);
    var coinColor = getPlayer(this.childNodes[0]) == "p1" ? pl1 : pl2;
    coin.className = coinColor + "Queen";
    this.replaceChild(coin,this.childNodes[0]);
    this.removeEventListener("click",addNewQueen);
}

function possibleAttack(coin,pos)
{
    var attackCell = document.getElementById("cell_"+pos.x+"_"+pos.y);
    if(attackCell && attackCell.childElementCount!=0 && getPlayer(attackCell.childNodes[0])!=getPlayer(coin))
    {
        setPossibleMove(attackCell);
    }
}

function setPawnMove(coin,pos)
{
    var posCell = document.getElementById("cell_"+(getPlayer(coin)=="p1"?pos.x-1:pos.x+1)+"_"+pos.y);
    if(posCell.childElementCount>0)
	return true;
    setPossibleMove(posCell);
    return false;
}

function setPossibleMove(posCell)
{
    posCell.className+=" Possible";
    posCell.addEventListener("click",placeCoin);
    posCell.addEventListener("click",removePossibilities);
}

function removePossibilities()
{
    var possible = document.getElementsByClassName("Possible");
    while(possible.length>0)
    {
        var cell = possible[0];
        cell.className = cell.className.replace(" Possible","");
        cell.removeEventListener("click",removePossibilities);
        cell.removeEventListener("click",placeCoin);
        cell.removeEventListener("click",addNewQueen);          //only removes if pawn is about to capture queen
    }
}