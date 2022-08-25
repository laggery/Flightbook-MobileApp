import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Appointment } from './appointment.model';
import { School } from './school.model';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  constructor(private http: HttpClient) { }

  getSchools(): Observable<School[]> {
    return this.http.get<School[]>(`${environment.baseUrl}/students/schools`);
  }

  getAppointments({ limit = null, offset = null}: { limit?: number, offset?: number} = {}, schoolId: number ): Observable<Appointment[]> {
    // TODO add appointments filter 

    let params: HttpParams = new HttpParams();
    if (limit) {
      params = params.append('limit', limit.toString());
    }
    if (offset) {
      params = params.append('offset', offset.toString());
    }
    return this.http.get<Appointment[]>(`${environment.baseUrl}/students/schools/${schoolId}/appointments`, { params });
  }

  subscribeToAppointment(schoolId: number, appointmentId: number): Observable<Appointment> {
    return this.http.post<Appointment>(`${environment.baseUrl}/students/schools/${schoolId}/appointments/${appointmentId}/subscriptions`, {});
  }

  deleteAppointmentSubscription(schoolId: number, appointmentId: number): Observable<Appointment> {
    return this.http.delete<Appointment>(`${environment.baseUrl}/students/schools/${schoolId}/appointments/${appointmentId}/subscriptions`);
  }
}
