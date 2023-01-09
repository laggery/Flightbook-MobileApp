import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PaymentStatus } from 'src/app/account/shared/paymentStatus.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private paymentStatus$: BehaviorSubject<PaymentStatus>;

  constructor() {
    this.paymentStatus$ = new BehaviorSubject(null);
  }

  getPaymentStatusValue(): PaymentStatus {
    return this.paymentStatus$.getValue();
  }

  getPaymentStatus(): Observable<PaymentStatus> {
    return this.paymentStatus$.asObservable();
  }

  setPaymentStatus(nextState: PaymentStatus): void {
    this.paymentStatus$.next(nextState);
  }
}
