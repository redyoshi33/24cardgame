import { Component, OnInit } from '@angular/core';
import { HttpService } from './http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	ioConnection1: any;
  ioConnection2: any;
  ioConnection3: any;
  io;
  data = {username: '', score: 0, answer: ''}
  players: any;
  username = "";
  loggedin = false;
  deckupdate = true;
	deck = [];
	card1: any;
	card2: any;
	card3: any;
	card4: any;
	answer = ""
	compiledanswer = ""
	clickcard = true
	clicksymb = false
	clickparen = 0
	temp: any;
	used = 0
	skip = false
	score = 0;
  count = 60;

  constructor(private _httpService: HttpService){
  	this.initToConnection()
  }
  private initToConnection(){
  	this._httpService.initSocket();
      this.ioConnection1 = this._httpService.recieveData().subscribe((data) => {
      if(this.loggedin){
        if(this.deckupdate){
          this.deck = data['deck']['deck']
        }
        this.card1 = this.deck[0]
        this.card2 = this.deck[1]
        this.card3 = this.deck[2]
        this.card4 = this.deck[3]
        this.players = data['players']
        this.deckupdate = false
       }
      });
      this.ioConnection2 = this._httpService.newRound().subscribe((data) => {
        if(this.loggedin){
          this.deck = data['deck']['deck']
          this.card1 = this.deck[0]
          this.card2 = this.deck[1]
          this.card3 = this.deck[2]
          this.card4 = this.deck[3]
          this.deckupdate = true
          this.clearAnswer()
         }
      })
      this.ioConnection3 = this._httpService.recieveTimer().subscribe((data) =>{
        if(this.loggedin){
          this.count = data['countdown']
        }
      })
    this._httpService.onEvent('connect').subscribe(() => {
      console.log('You are connected!');
    });

    this._httpService.onEvent('other:connection').subscribe(() => {
      console.log('Somebody else connected!');
    });

    this._httpService.onEvent('disconnect').subscribe(() => {
      console.log('Somebody disconnected!');
    });
  }
  ngOnInit(){

  }
  unameSubmit(){
  	this.loggedin = true
    this.skip = true
    this.updateData()
  }
  updateData(){
    this.data = {username: this.username, score: this.score, answer: this.answer}
    this._httpService.sendData({data: this.data})
  }
  clickValue(card){
  	if(this.clickcard && !card.clicked){
  		this.answer += card.value
  		this.clickcard = false
  		this.clicksymb = true
  		card.clicked = true
  		this.swapIDs(card)
  		this.used++
  	}
    this.updateData()
  }
  clickSymbol(val){
  	if(this.clicksymb){
  		this.answer += val
  		this.clicksymb = false
  		this.clickcard = true
  	}
    this.updateData()
  }
  openParen(){
  	if(this.clickcard){
  		this.answer += "("
  		this.clickparen++
  	}
    this.updateData()
  }
  closeParen(){
  	if(this.clicksymb){
  		if(this.clickparen > 0){
  			this.answer += ")"
  			this.clickparen--
  		}
  	}
    this.updateData() 
  }
  clickCompile(){
  	this.compiledanswer = eval(this.answer)
  	if(this.used == 4){
  		if(Number(this.compiledanswer) < 24.0007 && Number(this.compiledanswer) > 23.9993){
        this.score++
        this.answer = ''
        this.updateData()
        this._httpService.shuffleDeck()
  		}
  		else{
  			this.compiledanswer = "Try Again! " + this.compiledanswer
  		} 
  	}
  }

  clickSkip(){
    if(this.skip){
      this._httpService.shuffleDeck()
      this.clearAnswer()
    }
  }
  clearAnswer(){
  	if(this.skip){
	  	this.checkID(this.card1)
	    this.checkID(this.card2)
	    this.checkID(this.card3)
	    this.checkID(this.card4)
	  	this.answer = ""
	  	this.clickcard = true
  		this.clicksymb = false
  		this.compiledanswer = ""
  		this.clickparen = 0
  		this.used = 0
	  }
    this.updateData()
  }
  checkID(card){
  	if(card.id === "Red_Back"){
  		this.swapIDs(card)
  	}
  	card.clicked = false
  }
  swapIDs(card){
  	this.temp = card.id
  	card.id = card.sub
  	card.sub = this.temp
  }
}
