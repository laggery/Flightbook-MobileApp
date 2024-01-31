import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { MapConfiguration } from '../domain/map-configuration';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private mapConfiguration$: BehaviorSubject<MapConfiguration>;

  constructor(private http: HttpClient) {
    this.mapConfiguration$ = new BehaviorSubject(null);
  }

  getMapConfiguration(): Observable<MapConfiguration> {
    if (!this.mapConfiguration$.getValue()) {
      return this.http.get<MapConfiguration>(`${environment.baseUrl}/configuration/map`).pipe(
        map((response: MapConfiguration) => {
          this.mapConfiguration$.next(response);
          return response;
        })
      );
    } else {
      return this.mapConfiguration$.asObservable();
    }
    
  }
}
