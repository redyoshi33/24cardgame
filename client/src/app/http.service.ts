import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import * as io from 'socket.io-client';
const SERVER_URL = 'http://localhost:8000/';

@Injectable()
export class HttpService {
	private socket;
  constructor(private _http: HttpClient) { }

  initSocket() {
    this.socket = io(SERVER_URL);
  }
  sendData(data){
  	this.socket.emit('startgame', data)
  }
  recieveData(){
  	return new Observable<object>(observer => {
      this.socket.on('update', (data) => {observer.next(data)});
    });
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
  onEvent(event) {
    return new Observable<object>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }
} 
