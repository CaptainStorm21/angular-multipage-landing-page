import { Component, OnInit } from '@angular/core';
import { NewsApiService } from '../news-api.service';
// import interface
import { Article } from '../news-api.service';
import { TrimOutletNamePipe } from '../trim-outlet-name.pipe';

@Component({
  selector: 'app-na-article-list',
  templateUrl: './na-article-list.component.html',
  styleUrls: ['./na-article-list.component.css']
})
export class NaArticleListComponent implements OnInit {


  articles: Article[];
  constructor(
    // dependency injection
    private newsApiService: NewsApiService
  ) {
    // subscribe to the observable
    // save a reference ot the date that is coming from it
    // then access that data directly inside of our template instead of using async pipe
    this.newsApiService.pagesOutput.subscribe((articles) => {
      this.articles = articles;
      console.log(this.articles);
    });

    this.newsApiService.getPage(1);



    }
  ngOnInit(): void {
  }

}
