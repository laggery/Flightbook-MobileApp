import {Observable, BehaviorSubject} from 'rxjs';

export class Store<T> {

    private state$: BehaviorSubject<T>;

    protected constructor (initialState: T) {
        this.state$ = new BehaviorSubject(initialState);
    }

    getValue(): T {
        return this.state$.getValue();
    }

    getState(): Observable<T> {
      return this.state$.asObservable();
    }

    setState(nextState: T): void {
        this.state$.next(nextState);
    }
}