import { Component, Input, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { IonInput, IonSelect, IonSelectOption, IonText } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

interface CountryPrefix {
  name: string;
  prefix: string;
  pattern: RegExp;
  placeholder: string;
}

@Component({
  selector: 'fb-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrls: ['./phone-number.component.scss'],
  imports: [IonInput, IonSelect, IonSelectOption, IonText, FormsModule, TranslateModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneNumberComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PhoneNumberComponent),
      multi: true
    }
  ]
})
export class PhoneNumberComponent implements ControlValueAccessor, Validator, OnDestroy {
  unsubscribe$ = new Subject<void>();
  @Input() required: boolean = false;

  countryPrefixes: CountryPrefix[] = [];
  selectedPrefix: string = '+41';
  selectedPlaceholder: string = '79 000 00 00';
  private _phoneNumber: string = '';
  disabled: boolean = false;
  onChange = (_: any) => { };
  onTouched = () => { };
  invalidPhone = false;

  get phoneNumber(): string {
    return this._phoneNumber;
  }

  set phoneNumber(val: string) {
    this._phoneNumber = val;
    this.updateValue();
  }

  get value(): string {
    if (this.selectedPrefix === '-') {
      return this.phoneNumber ? this.phoneNumber : null;
    }

    if (!this.phoneNumber) {
      return null
    }

    return this.selectedPrefix + " " + this.phoneNumber.trimStart();
  }

  set value(val: string) {
    if (val) {
      // Extract prefix and number from the full phone number
      const prefix = this.countryPrefixes.find(cp => val.startsWith(cp.prefix));
      if (prefix) {
        this.selectedPrefix = prefix.prefix;
        this.selectedPlaceholder = prefix.placeholder;
        this._phoneNumber = val.substring(prefix.prefix.length).trimStart();
      } else {
        this.selectedPrefix = "-";
        this.selectedPlaceholder = "";
        this._phoneNumber = val;
      }
    } else {
      this._phoneNumber = '';
    }
    this.onChange(this.value);
  }

  constructor(private translate: TranslateService) {
    this.defineCountryPrefix();
    translate.onLangChange.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.defineCountryPrefix()
    });
  }

  private defineCountryPrefix(): void {
    this.countryPrefixes = [
      { name: this.translate.instant('country.switzerland'), prefix: '+41', pattern: /^[0-9]{2}\s[0-9]{3}\s[0-9]{2}\s[0-9]{2}$/, placeholder: '79 000 00 00' },
      { name: this.translate.instant('country.france'), prefix: '+33', pattern: /^[0-9\s]{9,15}$/, placeholder: '06 00 00 00 00' },
      { name: this.translate.instant('country.germany'), prefix: '+49', pattern: /^[0-9\s]{10,15}$/, placeholder: '0151 12345678' },
      { name: this.translate.instant('country.austria'), prefix: '+43', pattern: /^[0-9]{3,4}\s?[0-9]{3,7}$/, placeholder: '0664 1234567' },
      { name: this.translate.instant('country.italy'), prefix: '+39', pattern: /^[0-9]{3}\s?[0-9]{3,4}\s?[0-9]{3,4}$/, placeholder: '345 123 4567' },
      { name: this.translate.instant('country.other'), prefix: '-', pattern: /^(\+[0-9]{1,3}\s)?[0-9]{1,4}(\s[0-9]{1,5}){1,4}$/, placeholder: '' }
    ];
  }

  validatePhoneNumber(): boolean {
    if (this.phoneNumber === '') return true; // No validation if phone number is empty
    const country = this.countryPrefixes.find(c => c.prefix === this.selectedPrefix);
    if (!country) return true; // No validation if country not found
    
    return country.pattern.test(this.phoneNumber);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.required && !control.value) {
      return null; // Not required and empty is valid
    }
    
    return this.validatePhoneNumber() ? null : { invalidPhone: true };
  }

  writeValue(value: string): void {
    if (value !== undefined && value !== null) {
      this.value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  updateValue(): void {
    this.onChange(this.value);
  }

  onPrefixChange(): void {
    this.invalidPhone = !this.validatePhoneNumber();
    this.selectedPlaceholder = this.countryPrefixes.find(cp => cp.prefix === this.selectedPrefix).placeholder;
    this.updateValue();
  }

  onInputChange(): void {
    this.invalidPhone = !this.validatePhoneNumber();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
}
}
