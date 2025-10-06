import { Injectable, Injector, computed, effect, inject, runInInjectionContext, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, concatMap, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Flight } from './flight.model';
import { FlightFilter } from './flight-filter.model';
import { FlightStatistic } from './flightStatistic.model';
import { Pager } from 'src/app/shared/domain/pager.model';
import moment from 'moment';

export interface FlightState {
  flights: Flight[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class FlightStore {
  // HTTP client
  private http = inject(HttpClient);
  
  // State
  private state = signal<FlightState>({
    flights: [],
    loading: false,
    error: null
  });
  
  // Public filter state
  public filter = signal<FlightFilter>(new FlightFilter());
  
  // Default limit for pagination
  public defaultLimit = 25;
  
  // Selectors (computed values)
  public flights = computed(() => this.state().flights);
  public loading = computed(() => this.state().loading);
  public error = computed(() => this.state().error);
  public filtered = computed(() => this.isFiltered());
  constructor() {}
  
  getFlights({ limit = null, offset = null, store = true, clearStore = false }: 
    { limit?: number, offset?: number, store?: boolean, clearStore?: boolean } = {}): Observable<Flight[]> {
    
    this.state.update(state => ({ ...state, loading: true }));
    
    // Create params
    let params: HttpParams = this.createFilterParams();
    if (limit) {
      params = params.append('limit', limit.toString());
    }
    if (offset) {
      params = params.append('offset', offset.toString());
    }
    
    return this.http.get<Flight[]>(`${environment.baseUrl}/flights`, { params }).pipe(
      tap({
        next: (response: Flight[]) => {
          if (store) {
            // Update state with new flights
            this.state.update(state => {
              let newFlights: Flight[];
              
              if (clearStore) {
                newFlights = [...response];
              } else {
                newFlights = [...state.flights, ...response];
                // Sort by date descending
                newFlights.sort((a, b) => {
                  return new Date(a.date) > new Date(b.date) ? -1 : 1;
                });
              }
              
              return {
                ...state,
                flights: newFlights,
                loading: false,
                error: null
              };
            });
          } else {
            this.state.update(state => ({ ...state, loading: false, error: null }));
          }
        },
        error: (error) => {
          this.state.update(state => ({ 
            ...state, 
            loading: false, 
            error: error.message || 'An error occurred while fetching flights' 
          }));
        }
      }),
      map(response => response)
    );
  }
  
  getFlightById(id: number): Observable<Flight> {
    this.state.update(state => ({ ...state, loading: true }));
    
    return this.http.get<Flight>(`${environment.baseUrl}/flights/${id}`).pipe(
      tap({
        next: () => this.state.update(state => ({ ...state, loading: false, error: null })),
        error: (error) => this.state.update(state => ({ 
          ...state, 
          loading: false, 
          error: error.message || 'An error occurred while fetching flight details' 
        }))
      })
    );
  }
  
  getStatistics(type: string): Observable<FlightStatistic[]> {
    let params: HttpParams = this.createFilterParams();
    params = params.append('type', type);
    
    return this.http.get<FlightStatistic[]>(`${environment.baseUrl}/v2/flights/statistic`, { params });
  }
  
  nbFlightsByPlaceId(placeId: number): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/flights/places/${placeId}/count`);
  }
  
  nbFlightsByGliderId(gliderId: number): Observable<any> {
    return this.http.get<any>(`${environment.baseUrl}/flights/gliders/${gliderId}/count`);
  }
  
  postFlight(flight: Flight): Observable<Flight> {
    this.state.update(state => ({ ...state, loading: true }));
    
    return this.http.post<Flight>(`${environment.baseUrl}/flights`, flight).pipe(
      tap((response: Flight) => {
        // Mark the post operation as complete
        this.state.update(state => ({
          ...state,
          loading: false,
          error: null
        }));
      }),
      // After posting the flight, get the updated flight list
      concatMap((response: Flight) => {
        return this.getFlights({ limit: this.defaultLimit, clearStore: true }).pipe(
          map(() => response)
        );
      }),
      tap({
        error: (error) => {
          this.state.update(state => ({ 
            ...state, 
            loading: false, 
            error: error.message || 'An error occurred while saving the flight' 
          }));
        }
      })
    );
  }
  
  putFlight(flight: Flight): Observable<Flight> {
    this.state.update(state => ({ ...state, loading: true }));
    
    return this.http.put<Flight>(`${environment.baseUrl}/flights/${flight.id}`, flight).pipe(
      tap({
        next: (response: Flight) => {
          this.state.update(state => {
            const updatedFlights = [...state.flights];
            const index = updatedFlights.findIndex((listFlight: Flight) => listFlight.id === response.id);
            
            if (index !== -1) {
              // Preserve the flight number
              response.number = updatedFlights[index].number;
              updatedFlights[index] = response;
            }
            
            return {
              ...state,
              flights: updatedFlights,
              loading: false,
              error: null
            };
          });
        },
        error: (error) => {
          this.state.update(state => ({ 
            ...state, 
            loading: false, 
            error: error.message || 'An error occurred while updating the flight' 
          }));
        }
      })
    );
  }
  
  deleteFlight(flight: Flight): Observable<Flight> {
    this.state.update(state => ({ ...state, loading: true }));
    
    return this.http.delete<Flight>(`${environment.baseUrl}/flights/${flight.id}`).pipe(
        tap((response: Flight) => {
            // Mark the post operation as complete
            this.state.update(state => ({
              ...state,
              loading: false,
              error: null
            }));
          }),
          // After posting the flight, get the updated flight list
          concatMap((response: Flight) => {
            return this.getFlights({ limit: this.defaultLimit, clearStore: true }).pipe(
              map(() => response)
            );
          }),
          tap({
            error: (error) => {
              this.state.update(state => ({ 
                ...state, 
                loading: false, 
                error: error.message || 'An error occurred while deleting the flight' 
              }));
            }
          })
        );
  }
  
  updateFilter(filter: Partial<FlightFilter>): void {
    this.filter.update(currentFilter => ({ ...currentFilter, ...filter }));
  }
  
  resetFilter(): void {
    this.filter.set(new FlightFilter());
  }
  
  clearFlights(): void {
    this.state.update(state => ({ ...state, flights: [] }));
  }
  
  private isFiltered(): boolean {
    const currentFilter = this.filter();
    return !!(
      (currentFilter.glider.id && currentFilter.glider.id !== null) ||
      (currentFilter.from && currentFilter.from !== null) ||
      (currentFilter.to && currentFilter.to !== null) ||
      (currentFilter.gliderType && currentFilter.gliderType !== '') ||
      (currentFilter.description && currentFilter.description !== '')
    );
  }
  
  private createFilterParams(): HttpParams {
    let params = new HttpParams();
    const currentFilter = this.filter();
    
    if (currentFilter.glider.id && currentFilter.glider.id !== null) {
      params = params.append('glider', currentFilter.glider.id.toString());
    }
    if (currentFilter.from && currentFilter.from !== null) {
      params = params.append('from', moment(currentFilter.from).format('YYYY-MM-DD'));
    }
    if (currentFilter.to && currentFilter.to !== null) {
      params = params.append('to', moment(currentFilter.to).format('YYYY-MM-DD'));
    }
    if (currentFilter.gliderType && currentFilter.gliderType !== '') {
      params = params.append('glider-type', currentFilter.gliderType);
    }
    if (currentFilter.description && currentFilter.description !== "") {
      params = params.append('description', currentFilter.description);
    }
    
    return params;
  }
}
