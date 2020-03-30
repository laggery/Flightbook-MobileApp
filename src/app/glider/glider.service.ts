import { Injectable } from '@angular/core';
import { Glider } from './glider';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GliderService {
  public gliders: Glider[];
  public isGliderlistComplete = false;

  constructor(private http: HttpClient) {
    this.gliders = [];
  }

  getGliders({ limit = null, offset = null }: { limit?: number, offset?: number } = {}): Observable<Glider[]> {
    let params = new HttpParams();
    if (limit) {
      params = params.append('limit', limit.toString());
    }
    if (offset) {
      params = params.append('offset', offset.toString());
    }

    return this.http.get<Glider[]>(`${environment.baseUrl}/gliders`, {params}).pipe(
      map((response: Glider[]) => {
        this.gliders.push(...response);
        return response;
      })
    );
  }
}
