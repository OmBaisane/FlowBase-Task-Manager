import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService implements OnDestroy {
  private socket: Socket | null = null;
  private readonly SERVER_URL = 'http://localhost:5000';

  taskCreated$ = new Subject<any>();
  taskUpdated$ = new Subject<any>();
  taskDeleted$ = new Subject<{ _id: string }>();

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(this.SERVER_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('taskCreated', (task: any) => {
      this.taskCreated$.next(task);
    });

    this.socket.on('taskUpdated', (task: any) => {
      this.taskUpdated$.next(task);
    });

    this.socket.on('taskDeleted', (data: { _id: string }) => {
      this.taskDeleted$.next(data);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  ngOnDestroy() {
    this.disconnect();
  }
}
