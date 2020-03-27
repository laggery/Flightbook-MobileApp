import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  public places: any;

  constructor(private http: HttpClient) {
    this.places = [];
  }

  getPlaces({ limit = null, offset = null }: { limit?: number, offset?: number } = {}): Observable<any> {
    let params = new HttpParams();
    if (limit) {
      params = params.append('limit', limit.toString());
    }
    if (offset) {
      params = params.append('offset', offset.toString());
    }

    return this.http.get<any>(`${environment.baseUrl}/places`, {params}).pipe(
      map(response => {
        this.places.push(...response);
        return response;
      })
    );
  }
}
