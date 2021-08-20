import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface Command {
  id: number;
  type: 'success' | 'error' | 'clear';
  // ? optional
  text?: string;
}


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  messages: Subject<any>;

  constructor() {
    this.messages = new Subject<Command>();
  }

  addSuccess(message: string) {
    this.messages.next({
      id: this.randomId(),
      text: message,
      type: 'success'
    });
  }

  addError(message: string) {
    this.messages.next({
      id: this.randomId(),
      text: message,
      type: 'error'
  });
  }

  clearMessage(id: number) {
    {
      this.messages.next({
        id,
        type: 'clear'
    });
  }

  //only in this component
  private randomId() {
    return Math.round(Math.random() * 10000);
  }
}
