var selCoin,turn=1,pl1,pl2,possible=[];

function generateBoard()
{
	var f=1;
	var board = document.createElement("DIV");
	board.setAttribute("align","center");
	//board.style.marginTop="100px";
	for(var i=1;i<=8;i++)
	{
		for(var j=1;j<=8;j++)
		{
			var cell = document.createElement("SPAN");
			//cell.addEventListener("click",placeCoin);
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
		coin.addEventListener("click",selectCoin);
		coin.className = p2+coins[i-1];
		row.appendChild(coin);
		row = document.getElementById("cell_2_"+i);		//Pawn row for player 2
		//row.removeEventListener("click",placeCoin);
		coin = document.createElement("DIV");
		coin.addEventListener("click",selectCoin);
		coin.className = p2+"Pawn";
		row.appendChild(coin);
		//---------------------------------------------------------------------
		row = document.getElementById("cell_8_"+i);		//King row for player 1
		//row.removeEventListener("click",placeCoin);
		coin = document.createElement("DIV");
		coin.addEventListener("click",selectCoin);
		coin.className = p1+coins[i-1];
		row.appendChild(coin);
		row = document.getElementById("cell_7_"+i);		//Pawn row for player 1
		//row.removeEventListener("click",placeCoin);
		coin = document.createElement("DIV");
		coin.addEventListener("click",selectCoin);
		coin.className = p1+"Pawn";
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
		possiblePawn(this);
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
		selCoin.parentNode.addEventListener("click",placeCoin);
		selCoin.parentNode.removeChild(selCoin);
		this.removeEventListener("click",placeCoin);
		selCoin = "";
		turn*=-1;
	}
}

function possiblePawn(coin)
{
	var cell = coin.parentNode;
	var pos = getPosition(cell);
	var posCell = document.getElementById("cell_"+(coin.className.indexOf("White")!=-1?pos.x-1:pos.x+1)+"_"+pos.y);
	if(posCell.childElementCount>0)
		return;
	posCell.className+=" Possible";
	possible.push(posCell);
	posCell.addEventListener("click",placeCoin);
	posCell.addEventListener("click",removePossibilities);
}

function removePossibilities()
{
	while(possible.length>0)
	{
		var cell = possible.pop();
		cell.className = cell.className.replace(" Possible","");
		cell.removeEventListener("click",removePossibilities);
	}
}