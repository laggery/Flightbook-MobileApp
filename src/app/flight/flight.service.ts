import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flight } from './flight';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  public flights: Flight[];

  constructor(private http: HttpClient) {
    this.flights = [];
  }

  getFlights({ limit = null, offset = null }: { limit?: number, offset?: number } = {}): Observable<Flight[]> {
    let params = new HttpParams();
    if (limit) {
      params = params.append('limit', limit.toString());
    }
    if (offset) {
      params = params.append('offset', offset.toString());
    }

    return this.http.get<Flight[]>(`${environment.baseUrl}/flights`, { params }).pipe(
      map((response: Flight[]) => {
        this.flights.push(...response);
        return response;
      })
    );
  }
}
