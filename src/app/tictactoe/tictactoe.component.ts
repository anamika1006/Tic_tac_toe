import { Component, OnInit } from '@angular/core';
import { strict } from 'node:assert';


@Component({
  selector: 'app-tictactoe',
  templateUrl: './tictactoe.component.html',
  styleUrl: './tictactoe.component.css'
})
export class TictactoeComponent implements OnInit{

  //to get the previous state of the game when we refresh the page oninit is a lifecycle hook which gets loaded whenever the program is first run. the previous states are saved in the local storage and we get the data from it. For doing it we do {implements OnInit} in the .ts file function. and then do quick fix to get the function to write the code.
  ngOnInit(): void {

    // we are take getting the cells data
    let allCells=localStorage.getItem("allCellsKey");
    this.cells=allCells?JSON.parse(allCells):Array(10).fill(null);

    //we are getting the all moves array data.
    let allMovesStr=localStorage.getItem("allMoveKey");
    this.allMoves=allMovesStr?JSON.parse(allMovesStr):[];

  }

  // creating the object of the class created.
  playerA:Player=new Player('PlayerA','X', true,false);
  playerB:Player=new Player('PlayerB','O',false,false);

//array to store player moves
  cells:string[]=Array(10).fill(null);

  //game status
  gameStatus:string="gameActive";

  //move array
  allMoves:string[]=[];

  //to highlight the grids. of the wining square
  winGridComb:number[]=[];

 updatePlayerName(playerLabel:string){
    if(playerLabel==='A')
      {
        this.playerA.isEditing=!this.playerA.isEditing;
      }
    if(playerLabel==='B')
      {
        this.playerB.isEditing=!this.playerB.isEditing;
      }


  }

  makeMove(index:number)
  {
    //if slot not free return
    if(this.cells[index]!=null || this.gameStatus!=='gameActive')
      {return;}
    //find the correct player
    const player= this.playerA.isTurn?this.playerA:this.playerB;
    //reflect in Html
    this.cells[index]=player.symbol;

    

    this.allMoves.push(player.name+ " plays "+ player.symbol+" at "+index);

    //local storage
    localStorage.setItem("allCellsKey",JSON.stringify(this.cells));
    localStorage.setItem("allMoveKey",JSON.stringify(this.allMoves));

    // check for the win 
    this.checkGameState()
   
   if(this.gameStatus==='gameActive')
    {
    this.playerA.isTurn=!this.playerA.isTurn;
    this.playerB.isTurn=!this.playerB.isTurn;
    }
  }

  checkGameState()
  {
     //find the correct player
     const player= this.playerA.isTurn?this.playerA:this.playerB;

    const winCombinations=[
      [1,2,3],[4,5,6],[7,8,9],//row
      [1,4,7],[2,5,8],[3,6,9],//column
      [1,5,9],[3,5,7]//diagonal
    ];

    //checking for win
    for(let comb of winCombinations)
      {
        let[a,b,c]=comb;//array destructureing comb[0]=a; comb[1]=b
        if(this.cells[a]===player.symbol && this.cells[b]===player.symbol && this.cells[c]===player.symbol)
          {
             this.gameStatus= player.name+ " WIN!!";
             this.winGridComb = comb;
            return;
          }
      }

    //for draw
    let isDraw=true;
    for(let i=1;i<10;i++)
      {
        if(this.cells[i]==null)
          {
            isDraw=false;
          }
      }
      if(isDraw)
        {
          this.gameStatus= "Game Draw";
        }
    
  }

  resetGame()
  {
    //cells clear
    this.cells=Array(10).fill(null);

    //allMOves clear
    this.allMoves=[];

    //gameStatus
    this.gameStatus="gameActive";
    
    // making the turn of playerA true; and playerB false
    this.playerA.isTurn=true;
    this.playerB.isTurn=false;

    //
    this.winGridComb=[];

    //as on refresh it will go to the previous state so we need to clear it.
    localStorage.clear();
   

  }
}

//start of the code by creating the class so that we dont need to create 8 variables.
class Player{

  name:string;
  symbol:string;
  isTurn:boolean;
  isEditing:boolean;

  constructor(name:string, symbol:string, isTurn:boolean, isEditing:boolean)
  {
    this.name=name;
    this.symbol=symbol;
    this.isTurn=isTurn;
    this.isEditing=isEditing;
  }
}
