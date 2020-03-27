import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Place } from './place';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  public places: Place[];

  constructor(private http: HttpClient) {
    this.places = [];
  }

  getPlaces({ limit = null, offset = null }: { limit?: number, offset?: number } = {}): Observable<Place[]> {
    let params = new HttpParams();
    if (limit) {
      params = params.append('limit', limit.toString());
    }
    if (offset) {
      params = params.append('offset', offset.toString());
    }

    return this.http.get<Place[]>(`${environment.baseUrl}/places`, {params}).pipe(
      map((response: Place[]) => {
        this.places.push(...response);
        return response;
      })
    );
  }

  putPlace(place: Place): Observable<Place> {
    return this.http.put<Place>(`${environment.baseUrl}/places/${place.id}`, place).pipe(
      map((response: Place) => {
        const index = this.places.findIndex((listPlace: Place) => listPlace.id === response.id);
        this.places[index] = response;
        this.places.sort((a, b) => a.name > b.name ? 1 : -1);
        return response;
      })
    );
  }
}
