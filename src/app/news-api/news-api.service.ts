import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  tap,
  map,
  switchMap,
  pluck
} from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';


export interface Article {
  title: string;
  url: string;
  source: {
    name: string;
  }
}

interface NewsApiResponse {
  totalResults: number;
  articles: Article[];
}

@Injectable({
  providedIn: 'root'
})
export class NewsApiService {

  private url = 'https://newsapi.org/v2/top-headlines';
  private pageSize = 10;
  private apiKey = '9fb2279398d447b4b4e0e5b0f9282daa';
  private country = 'us';

  private pagesInput: Subject<number>;
          pagesOutput: Observable<Article[]>;
          numberOfPages: Subject<number>;

  constructor(
    private http: HttpClient
  ) {

    this.numberOfPages = new Subject();
    this.pagesInput = new Subject();
    this.pagesOutput = this.pagesInput.pipe(
      map((page) => {
        return new HttpParams()
          .set('apiKey', this.apiKey)
          .set('country', this.country)
          .set('pageSize', String(this.pageSize))
          .set('page', String(page));
      }),
      switchMap(params => {
        // <NewsApiResponse > tells TS specifically about the structure
        // of the data in the response that we get back
        // tnad ts further knowns that is going on with this switch map operator in general
        // the final mouse over will tell me about th etype of data that is flowing hrough this thing

        return this.http.get<NewsApiResponse>(this.url, { params });
      }),
      tap(response => {
        const totalPages = Math.ceil(response.totalResults / this.pageSize);
        this.numberOfPages.next(totalPages);
      }),
      pluck('articles')
    );
  }
  getPage(page: number): void {
    this.pagesInput.next(page);
  }

}
