import { Injectable } from '@angular/core';
import { InjectableRxStompConfig, RxStompService } from '@stomp/ng2-stompjs';
import { Subject, Observable } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { rxStompConfig } from '../config/rx-stomp.config';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private notificationsSubject: Subject<string> = new Subject<string>();

  constructor(private rxStompService: RxStompService) {
    this.rxStompService.configure(rxStompConfig);
    // Activate the RxStompService
    this.rxStompService.activate();

    // Subscribe to the /topic/notifications destination
    this.rxStompService.watch('/topic/notifications').subscribe({
      next: (message: Message) => {
        this.notificationsSubject.next(message.body);
      },
      error: (err) => {
        console.error('WebSocket error:', err);
        // Handle errors, possibly attempt reconnection or notify the user
      }
    });

    // Handle disconnections
    this.rxStompService.stompClient.onDisconnect = (frame) => {
      console.warn('Disconnected:', frame);
      // Handle disconnection, possibly attempt reconnection
    };
  }

  get notifications(): Observable<string> {
    return this.notificationsSubject.asObservable();
  }
}
