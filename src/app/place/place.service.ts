import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Place } from './place';
import { Store } from '../store.class';

@Injectable({
  providedIn: 'root'
})
export class PlaceService extends Store<Place[]> {

  constructor(private http: HttpClient) {
    super([]);
  }

  getPlaces({ limit = null, offset = null }: { limit?: number, offset?: number } = {}): Observable<Place[]> {
    let params = new HttpParams();
    if (limit) {
      params = params.append('limit', limit.toString());
    }
    if (offset) {
      params = params.append('offset', offset.toString());
    }

    return this.http.get<Place[]>(`${environment.baseUrl}/places`, { params }).pipe(
      map((response: Place[]) => {
        const newState = [...this.getValue(), ...response];
        this.setState(newState);
        return response;
      })
    );
  }

  getPlacesByName(name: string, { limit = null, offset = null }: { limit?: number, offset?: number } = {}): Observable<Place[]> {
    let params = new HttpParams();
    if (limit) {
      params = params.append('limit', limit.toString());
    }
    if (offset) {
      params = params.append('offset', offset.toString());
    }
    return this.http.get<Place[]>(`${environment.baseUrl}/places/${name}`, { params });
  }

  postPlace(place: Place): Observable<Place> {
    return this.http.post<Place>(`${environment.baseUrl}/places`, place).pipe(
      map((response: Place) => {
        this.setState([]);
        return response;
      })
    );
  }

  putPlace(place: Place): Observable<Place> {
    return this.http.put<Place>(`${environment.baseUrl}/places/${place.id}`, place).pipe(
      map((response: Place) => {
        const list = this.getValue();
        const index = list.findIndex((listPlace: Place) => listPlace.id === response.id);
        list[index] = response;
        list.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);

        this.setState(list);

        return response;
      })
    );
  }
}
