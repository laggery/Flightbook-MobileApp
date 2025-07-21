import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PassengerConfirmationListPage } from './passenger-confirmation-list.page';

describe('PasengerConfirmationListPage', () => {
  let component: PassengerConfirmationListPage;
  let fixture: ComponentFixture<PassengerConfirmationListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerConfirmationListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
