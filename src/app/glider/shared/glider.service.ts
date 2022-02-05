import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Store } from 'src/app/shared/services/store.class';
import { Glider } from './glider.model';
import { GliderFilter } from './glider-filter.model';
import { Pager } from 'src/app/shared/domain/pager.model';

@Injectable({
  providedIn: 'root'
})
export class GliderService extends Store<Glider[]> {
  public isGliderlistComplete = false;
  public filter: GliderFilter;
  public filtered$: BehaviorSubject<boolean>;
  public defaultLimit = 40;
  public disableList = false;

  constructor(private http: HttpClient) {
    super([]);
    this.filter = new GliderFilter();
    this.filtered$ = new BehaviorSubject(false);
  }

  getGliders({ limit = null, offset = null, store = true, clearStore = false }: { limit?: number, offset?: number, store?: boolean, clearStore?: boolean } = {}): Observable<Glider[]> {
    let params: HttpParams = this.createFilterParams(limit, offset);

    return this.http.get<Glider[]>(`${environment.baseUrl}/gliders`, { params }).pipe(
      map((response: Glider[]) => {
        let newState;
        if (store) {
          if (clearStore) {
            newState = [...response];
          } else {
            newState = [...this.getValue(), ...response];
          }
          this.setState(newState);
        }
        return response;
      })
    );
  }

  getGliderByName(name: string): Observable<Glider> {
    if (!name) {
      return;
    }

    return this.http.get<Glider>(`${environment.baseUrl}/gliders/name/${name}`);
  }

  getPager({ limit = null, offset = null }: { limit?: number, offset?: number } = {}): Observable<Pager> {
    let params: HttpParams = this.createFilterParams(limit, offset);
    return this.http.get<Pager>(`${environment.baseUrl}/gliders/pager`, { params });
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

  deleteGlider(glider: Glider): Observable<Glider> {
    return this.http.delete<Glider>(`${environment.baseUrl}/gliders/${glider.id}`).pipe(
      map((response: any) => {
        const list = this.getValue();
        const index = list.findIndex((listGliders: Glider) => listGliders.id === glider.id);
        list.splice(index, 1);
        return response;
      })
    );
  }

  private setFilterState(nextState: boolean) {
    this.filtered$.next(nextState);
  }

  private createFilterParams(limit: Number, offset: Number): HttpParams {
    let params = new HttpParams();
    let filterState = false;
    if (this.filter.brand && this.filter.brand !== "") {
      params = params.append('brand', this.filter.brand);
      filterState = true
    }
    if (this.filter.name && this.filter.name !== "") {
      params = params.append('name', this.filter.name);
      filterState = true
    }
    if (this.filter.type && this.filter.type !== "") {
      params = params.append('type', this.filter.type);
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
