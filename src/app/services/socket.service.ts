import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SocketService extends Socket {
  constructor() {
    super({ url: environment.socketserverUrl , options: {} });
  }
}
