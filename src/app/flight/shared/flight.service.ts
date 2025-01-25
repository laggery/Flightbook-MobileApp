import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import moment from 'moment';
import { environment } from 'src/environments/environment';
import { Store } from 'src/app/shared/services/store.class';
import { Flight } from './flight.model';
import { FlightFilter } from './flight-filter.model';
import { FlightStatistic } from './flightStatistic.model';
import { Pager } from 'src/app/shared/domain/pager.model';

@Injectable({
  providedIn: 'root'
})
export class FlightService extends Store<Flight[]> {
  public filter: FlightFilter;
  public filtered$: WritableSignal<boolean> = signal(false);
  public defaultLimit = 20;

  constructor(private http: HttpClient) {
    super([]);
    this.filter = new FlightFilter();
  }

  getFlights({ limit = null, offset = null, store = true, clearStore = false }: { limit?: number, offset?: number, store?: boolean, clearStore?: boolean } = {}): Observable<Flight[]> {
    let params: HttpParams = this.createFilterParams();
    if (limit) {
      params = params.append('limit', limit.toString());
    }
    if (offset) {
      params = params.append('offset', offset.toString());
    }

    return this.http.get<Flight[]>(`${environment.baseUrl}/flights`, { params }).pipe(
      map((response: Flight[]) => {
        let newState;
        if (store) {
          if (clearStore) {
            newState = [...response];
          } else {
            newState = [...this.getValue(), ...response];
            newState.sort((a, b) => {
              return new Date(a.date) > new Date(b.date) ? -1 : 1;
            });
          }
          this.setState(newState);
        }
        return response;
      })
    );
  }

  getStatistics(type: string): Observable<FlightStatistic[]> {
    let params: HttpParams = this.createFilterParams();
    params = params.append('type', type);

    return this.http.get<FlightStatistic[]>(`${environment.baseUrl}/v2/flights/statistic`, { params })
  }

  getPager({ limit = null, offset = null }: { limit?: number, offset?: number } = {}): Observable<Pager> {
    let params: HttpParams = this.createFilterParams();
    if (limit) {
      params = params.append('limit', limit.toString());
    }
    if (offset) {
      params = params.append('offset', offset.toString());
    }
    return this.http.get<Pager>(`${environment.baseUrl}/flights/pager`, { params });
  }

  nbFlightsByPlaceId(placeId: number): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/flights/places/${placeId}/count`)
  }

  nbFlightsByGliderId(gliderId: number): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/flights/gliders/${gliderId}/count`)
  }

  postFlight(flight: Flight, { clearStore = true }: { clearStore?: boolean } = {}): Observable<Flight> {
    return this.http.post<Flight>(`${environment.baseUrl}/flights`, flight).pipe(
      map((response: Flight) => {
        if (clearStore) {
          this.setState([]);
        } else {
          let newState = [...this.getValue(), response];
          newState.sort((a, b) => {
            return new Date(a.date) > new Date(b.date) ? -1 : 1;
          });
          this.setState(newState);
        }
        return response;
      })
    );
  }

  putFlight(flight: Flight): Observable<Flight> {
    return this.http.put<Flight>(`${environment.baseUrl}/flights/${flight.id}`, flight).pipe(
      map((response: Flight) => {
        const list = this.getValue();
        const index = list.findIndex((listFlight: Flight) => listFlight.id === response.id);
        response.number = list[index].number;
        list[index] = response;
        return response;
      })
    );
  }

  deleteFlight(flight: Flight): Observable<Flight> {
    return this.http.delete<Flight>(`${environment.baseUrl}/flights/${flight.id}`);
  }

  private setFilterState(nextState: boolean) {
    this.filtered$.set(nextState);
  }

  private createFilterParams(): HttpParams {
    let params = new HttpParams();
    let filterState = false;
    if (this.filter.glider.id && this.filter.glider.id !== null) {
      params = params.append('glider', this.filter.glider.id.toString());
      filterState = true;
    }
    if (this.filter.from && this.filter.from !== null) {
      params = params.append('from', moment(this.filter.from).format('YYYY-MM-DD'));
      filterState = true;
    }
    if (this.filter.to && this.filter.to !== null) {
      params = params.append('to', moment(this.filter.to).format('YYYY-MM-DD'));
      filterState = true;
    }
    if (this.filter.gliderType && this.filter.gliderType !== '') {
      params = params.append('glider-type', this.filter.gliderType);
      filterState = true;
    }
    if (this.filter.description && this.filter.description !== "") {
      params = params.append('description', this.filter.description);
      filterState = true
    }
    this.setFilterState(filterState);
    return params;
  }
}
