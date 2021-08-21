import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  tap,
  map,
  switchMap
} from 'rxjs/operators';

import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewsApiService {

  private url = 'https://newsapi.org/v2/top-headlines';
  private pageSize = 10;
  private apiKey = '9fb2279398d447b4b4e0e5b0f9282daa';
  private country = 'fr';

  pagesInput: Subject<number>;
  pagesOutput: Observable<any>;
  numberofPages: Observable<number>;

  constructor() {
    this.pagesInput = new Subject();
    this.pagesOutput = this.pagesInput.pipe(
      map((page) => {
        return new HttpParams()
          .set('apiKey', this.apiKey)
          .set('country', this.country)
          .set('pageSize', String(this.pageSize))
          .set('page', String(page))
      })
    )
  }
}
