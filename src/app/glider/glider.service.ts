import { Injectable } from '@angular/core';
import { Glider } from './glider';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Store } from '../store.class';

@Injectable({
  providedIn: 'root'
})
export class GliderService extends Store<Glider[]> {
  public isGliderlistComplete = false;

  constructor(private http: HttpClient) {
    super([]);
  }

  getGliders({ limit = null, offset = null, clearStore= false }: { limit?: number, offset?: number, clearStore?: boolean } = {}): Observable<Glider[]> {
    let params = new HttpParams();
    if (limit) {
      params = params.append('limit', limit.toString());
    }
    if (offset) {
      params = params.append('offset', offset.toString());
    }

    return this.http.get<Glider[]>(`${environment.baseUrl}/gliders`, { params }).pipe(
      map((response: Glider[]) => {
        let newState;
        if (clearStore) {
          newState = [...response];
        } else {
          newState = [...this.getValue(), ...response];
        }
        this.setState(newState);
        return response;
      })
    );
  }

  postGlider(glider: Glider): Observable<Glider> {
    return this.http.post<Glider>(`${environment.baseUrl}/gliders`, glider).pipe(
      map((response: Glider) => {
        this.setState([]);
        this.isGliderlistComplete = false;
        return response;
      })
    );
  }

  putGlider(glider: Glider): Observable<Glider> {
    return this.http.put<Glider>(`${environment.baseUrl}/gliders/${glider.id}`, glider).pipe(
      map((response: Glider) => {
        const list = this.getValue();
        const index = list.findIndex((listGlider: Glider) => listGlider.id === response.id);
        list[index] = response;
        list.sort((a, b) => {
          if (a.brand.toUpperCase() === b.brand.toUpperCase()) {
            return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
          }
          return a.brand.toUpperCase() > b.brand.toUpperCase() ? 1 : -1;
        });
        return response;
      })
    );
  }
}
