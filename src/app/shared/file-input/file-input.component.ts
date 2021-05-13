import { NgForm } from '@angular/forms';
import { Component, forwardRef, HostBinding, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'file-input',
  templateUrl: 'file-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileInputComponent),
      multi: true
    }
  ],
  styleUrls: ['file-input.component.scss']
})
export class FileInputComponent implements ControlValueAccessor {
  private isDisabled: boolean;
  @Input() formGroup2: NgForm;

  fileName = '';

  val = File;

  constructor() {
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  set value(val: any) {
    if ( val !== undefined) {
      this.val = val;
      this.onChange(val);
      this.onTouch(val);
    }
  }

  onChange: any = () => {
  }

  onTouch: any = () => {
  }

  onFileSelected(event: { target: { files: File[]; }; }) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
    }
  }
}
