import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap, pluck, mergeMap, filter, toArray, share, tap, catchError } from 'rxjs/operators';
import { NotificationsService } from '../notifications/notifications.service';

//catchError is a transofrmational operator grabs pre-existent value and transforms it
//throwError returns a pre-configed observable


interface OpenWeatherResponse {
  list: {
    dt_txt: string;
    main: {
      temp: number;
    }
  }[]
}

@Injectable({
  providedIn: 'root'
})
export class ForecastService {
  private url = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationsService
  ) {}

  getForecast() {
    return this.getCurrentLocation().pipe(
      map(coords => {
        return new HttpParams()
          .set('lat', String(coords.latitude))
          .set('lon', String(coords.longitude))
          .set('units', 'metric')
          .set('appid', 'f557b20727184231a597c710c8be3106');
      }),
      switchMap(params => this.http.get<OpenWeatherResponse>(this.url, { params })
      ),
      pluck('list'),
      mergeMap(value => of(...value)),
      // of is bascially looping through a list individually
      filter((value, index) => index % 8 === 0),
      map(value => {
        return {
          dateString: value.dt_txt,
          temp: value.main.temp
        }
      }),
      toArray(),
      share()
    );
  }

  getCurrentLocation() {
    return new Observable<any>(observer => {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          observer.next(position.coords);
          observer.complete();
        },
        err => observer.error(err)
      );
    }).pipe(
      // not optimal solution
      // tap(() => {
      //   this.notificationService.addSuccess('Found your location!');
      // }, () => {
      //   this.notificationService.addError('Error')
      // } )
      tap(() => {
        this.notificationService.addSuccess('Found your location!');
      }
      ),
      catchError((err) => {
          // step 1 - handle the error
        this.notificationService.addError('Location not found');
        // step 2 - return a new observable
        // why return a new observable
        // we can emit a new default location
        return throwError(err);
      })
    );
  }
}
