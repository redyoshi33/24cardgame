import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import * as io from 'socket.io-client';
const SERVER_URL = '54.183.223.25';

@Injectable()
export class HttpService {
	private socket;
  constructor(private _http: HttpClient) { }

  initSocket() {
    this.socket = io(SERVER_URL);
  }
  loginCheck(data){
    this.socket.emit('checkUsername', data)
  }
  loginStart(){
    return new Observable<object>(observer => {
      this.socket.on('loginPassFail', (data) => {observer.next(data)});
    });
  }
  sendData(data){
  	this.socket.emit('updategame', data)
  }
  recieveData(){
  	return new Observable<object>(observer => {
      this.socket.on('update', (data) => {observer.next(data)});
    });
  }
  skip(){
    this.socket.emit('skipCount')
  }
  newRound(){
  	return new Observable<object>(observer => {
      this.socket.on('shuffled', (data) => {observer.next(data)});
    });
  }
  shuffleDeck(){
  	this.socket.emit('shuffle')
  }
  recieveTimer(){
  	return new Observable<object>(observer => {
      this.socket.on('timer', (data) => {observer.next(data)});
    });
  }
  winner(data){
    this.socket.emit('winGame', data)
  }
  stopGame(){
    return new Observable<object>(observer => {
      this.socket.on('endGame', (data) => {observer.next(data)});
    });
  }
  startNewGame(data){
    this.socket.emit('newGame', data)
  }
} 
