import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flight } from './flight';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Store } from '../store.class';

@Injectable({
  providedIn: 'root'
})
export class FlightService extends Store<Flight[]> {

  constructor(private http: HttpClient) {
    super([]);
  }

  getFlights({ limit = null, offset = null, store = true }: { limit?: number, offset?: number, store?: boolean } = {}): Observable<Flight[]> {
    let params = new HttpParams();
    if (limit) {
      params = params.append('limit', limit.toString());
    }
    if (offset) {
      params = params.append('offset', offset.toString());
    }
    return this.http.get<Flight[]>(`${environment.baseUrl}/flights`, { params }).pipe(
      map((response: Flight[]) => {
        if (store) {
          const newState = [...this.getValue(), ...response];
          newState.sort((a, b) => {
            return new Date(a.date) > new Date(b.date) ? -1 : 1;
          });
          this.setState(newState);
        }
        return response;
      })
    );
  }

  postFlight(flight: Flight): Observable<Flight> {
    return this.http.post<Flight>(`${environment.baseUrl}/flights`, flight).pipe(
      map((response: Flight) => {
        this.setState([]);
        return response;
      })
    );
  }

  putFlight(flight: Flight): Observable<Flight> {
    return this.http.put<Flight>(`${environment.baseUrl}/flights/${flight.id}`, flight).pipe(
      map((response: Flight) => {
        const list = this.getValue();
        const index = list.findIndex((listFlight: Flight) => listFlight.id === response.id);
        list[index] = response;
        list.sort((a, b) => {
          return new Date(a.date) > new Date(b.date) ? -1 : 1;
        });
        return response;
      })
    );
  }
}
