import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppointmentFilter } from './appointment-filter.model';
import { Appointment } from './appointment.model';
import { School } from './school.model';
import { ControlSheet } from 'src/app/shared/domain/control-sheet';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  filter: AppointmentFilter;
  filtered$: BehaviorSubject<boolean>;
  defaultLimit = 20;
  private schools: School[];

  constructor(private http: HttpClient) {
    this.filter = new AppointmentFilter();
    this.filtered$ = new BehaviorSubject(false);
  }

  async getSchools(): Promise<School[]> {
    if (!this.schools) {
      this.schools = await firstValueFrom(this.http.get<School[]>(`${environment.baseUrl}/student/schools`));
    }
    return this.schools;
  }

  clearSchools() {
    this.schools = null;
  }

  getAppointments({ limit = null, offset = null}: { limit?: number, offset?: number} = {}, schoolId: number ): Observable<Appointment[]> {
    let params: HttpParams = this.createFilterParams(limit, offset);

    return this.http.get<Appointment[]>(`${environment.baseUrl}/student/schools/${schoolId}/appointments`, { params });
  }

  getAppointment(schoolId: number, appointmentId: number ): Observable<Appointment> {
    return this.http.get<Appointment>(`${environment.baseUrl}/student/schools/${schoolId}/appointments/${appointmentId}`);
  }

  subscribeToAppointment(schoolId: number, appointmentId: number): Observable<Appointment> {
    return this.http.post<Appointment>(`${environment.baseUrl}/student/schools/${schoolId}/appointments/${appointmentId}/subscriptions`, {});
  }

  deleteAppointmentSubscription(schoolId: number, appointmentId: number): Observable<Appointment> {
    return this.http.delete<Appointment>(`${environment.baseUrl}/student/schools/${schoolId}/appointments/${appointmentId}/subscriptions`);
  }

  getControlSheet(): Observable<ControlSheet> {
    return this.http.get<ControlSheet>(`${environment.baseUrl}/student/control-sheet`);
  }

  postControlSheet(controlSheet: ControlSheet): Observable<ControlSheet> {
    return this.http.post<ControlSheet>(`${environment.baseUrl}/student/control-sheet`, controlSheet);
  }

  private setFilterState(nextState: boolean) {
    this.filtered$.next(nextState);
  }

  private createFilterParams(limit: Number, offset: Number): HttpParams {
    let params = new HttpParams();
    let filterState = false;
    if (this.filter.from && this.filter.from !== null) {
      params = params.append('from', moment(this.filter.from).format('YYYY-MM-DD'));
      filterState = true;
    }
    if (this.filter.to && this.filter.to !== null) {
      params = params.append('to', moment(this.filter.to).format('YYYY-MM-DD'));
      filterState = true;
    }
    if (this.filter.state) {
      params = params.append('state', this.filter.state);
      filterState = true
    }

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
