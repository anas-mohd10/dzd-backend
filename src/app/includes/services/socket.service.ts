import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: Socket;

  constructor() {
    // this.socket = io('http://localhost:3000/');
  }

  // onOrderPlaced(): Observable<any> {
  //   return new Observable((observer: any) => {
  //     this.socket.on('order-placed', (data: any) => {
  //       console.log("Hello");
        
  //       observer.next(data);
  //       console.log(data);
  //     });
  //   });
  // }
}
