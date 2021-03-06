import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { scan } from 'rxjs/operators';

export interface Command {
  id: number;
  type: 'success' | 'error' | 'clear';
  // ? optional
  text?: string;
}


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  messagesInput: Subject<Command>;
  messagesOutput: Observable<Command[]>;

  constructor() {
    this.messagesInput = new Subject<Command>();
    this.messagesOutput = this.messagesInput.pipe(
      scan((acc: Command[], value: Command) => {
        if (value.type === 'clear') {
          return acc.filter(message => message.id !== value.id);
        } else {
          return [...acc, value];
        }
      }, [])
    );
  }


  addSuccess(message: string) {
    const id = this.randomId();
    this.messagesInput.next({
      id,
      text: message,
      type: 'success'
    });

    setTimeout(() => {
      this.clearMessage(id);
    }, 50000);
  }

  addError(message: string) {
    this.messagesInput.next({
      id: this.randomId(),
      text: message,
      type: 'error'
  });
  }

  clearMessage(id: number) {
      this.messagesInput.next({
        id,
        type: 'clear'
    });
  }

  //only in this component
  private randomId() {
    return Math.round(Math.random() * 10000);
  }
}
