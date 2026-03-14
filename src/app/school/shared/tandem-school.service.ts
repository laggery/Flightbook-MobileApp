import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { School } from './school.model';

@Injectable({
  providedIn: 'root'
})
export class TandemSchoolService {

  private schoolsSignal = signal<School[] | null>(null);
  readonly schools = computed(() => this.schoolsSignal());

  constructor(private http: HttpClient) {
  }

  async getSchools(): Promise<School[]> {
    if (!this.schoolsSignal()) {
      const schools = await firstValueFrom(this.http.get<School[]>(`${environment.baseUrl}/tandem-pilot/schools`));
      this.schoolsSignal.set(schools);
    }
    return this.schoolsSignal()!;
  }

  clearSchools() {
    this.schoolsSignal.set(null);
  }
}
