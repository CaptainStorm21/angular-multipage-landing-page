import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NewsApiService {

  private url = 'https://newsapi.org/v2/top-headlines';
  private pageSize = 10;
  private apiKey = '9fb2279398d447b4b4e0e5b0f9282daa';
  private country = 'fr';

  constructor() { }
}
