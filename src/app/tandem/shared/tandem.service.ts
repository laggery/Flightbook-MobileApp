import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PassengerConfirmation } from './domain/passenger-confirmation.model';

@Injectable({
  providedIn: 'root'
})
export class TandemService {

  // filter: AppointmentFilter;
  filtered$: BehaviorSubject<boolean>;
  defaultLimit = 20;

  constructor(private http: HttpClient) {
    this.filtered$ = new BehaviorSubject(false);
  }

  getPassengerConfirmations({ limit = null, offset = null }: { limit?: number, offset?: number } = {}): Observable<PassengerConfirmation[]> {
    let params: HttpParams = this.createFilterParams(limit, offset);
    return this.http.get<PassengerConfirmation[]>(`${environment.baseUrl}/tandem/passenger-confirmations`, { params });
  }

  postPassengerConfirmations(passengerConfirmation: PassengerConfirmation): Observable<PassengerConfirmation> {
    return this.http.post<PassengerConfirmation>(`${environment.baseUrl}/tandem/passenger-confirmations`, passengerConfirmation);
  }

  deletePassengerConfirmation(passengerConfirmationId: number): Observable<void> {
    return this.http.delete<void>(`${environment.baseUrl}/tandem/passenger-confirmations/${passengerConfirmationId}`);
  }

  private setFilterState(nextState: boolean) {
    this.filtered$.next(nextState);
  }

  private createFilterParams(limit: Number, offset: Number): HttpParams {
    let params = new HttpParams();
    let filterState = false;

    if (limit) {
      params = params.append('limit', limit.toString());
    }
    if (offset) {
      params = params.append('offset', offset.toString());
    }

    this.setFilterState(filterState);
    return params;
  }
}
