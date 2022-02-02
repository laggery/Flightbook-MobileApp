import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Store } from './store.class';
import { Place } from '../domain/place';
import { environment } from 'src/environments/environment';
import { Pager } from '../domain/pager';

@Injectable({
  providedIn: 'root'
})
export class PlaceService extends Store<Place[]> {

  constructor(private http: HttpClient) {
    super([]);
  }

  getPlaces({ limit = null, offset = null, store = true, clearStore = false }: { limit?: number, offset?: number, store?: boolean, clearStore?: boolean } = {}): Observable<Place[]> {
    let params: HttpParams = this.createFilterParams(limit, offset);

    return this.http.get<Place[]>(`${environment.baseUrl}/places`, { params }).pipe(
      map((response: Place[]) => {
        let newState
        if (store) {
          if (clearStore) {
            newState = [...response];
          } else {
            newState = [...this.getValue(), ...response];
          }
          this.setState(newState);
        }
        return response;
      })
    );
  }

  getPager({ limit = null, offset = null }: { limit?: number, offset?: number } = {}): Observable<Pager> {
    let params: HttpParams = this.createFilterParams(limit, offset);
    return this.http.get<Pager>(`${environment.baseUrl}/places/pager`, { params });
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

  deletePlace(place: Place): Observable<Place> {
    return this.http.delete<Place>(`${environment.baseUrl}/places/${place.id}`).pipe(
      map((response: any) => {
        const list = this.getValue();
        const index = list.findIndex((listPlaces: Place) => listPlaces.id === place.id);
        list.splice(index, 1);
        return response;
      })
    );
  }

  private createFilterParams(limit: Number, offset: Number): HttpParams {
    let params = new HttpParams();
    if (limit) {
      params = params.append('limit', limit.toString());
    }
    if (offset) {
      params = params.append('offset', offset.toString());
    }
    return params;
  }
}
