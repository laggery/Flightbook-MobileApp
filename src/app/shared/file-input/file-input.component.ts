import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { readFileSync } from 'fs';

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

  fileName = '';

  @Output()
  fileContent = new EventEmitter<string | ArrayBuffer>();

  @Output()
  file = new EventEmitter<FormData>();

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
    if (val !== undefined) {
      this.val = val;
      this.onChange(val);
      this.onTouch(val);
    }
  }

  onChange: any = () => {
  }

  onTouch: any = () => {
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files[0];
    const formData = new FormData();
    formData.append('file', file, file.name);
    this.file.emit(formData);
    const reader = new FileReader();
    this.fileName = file.name;
    reader.onload = e => {
      this.fileContent.emit(reader.result);
    };
  }
}
