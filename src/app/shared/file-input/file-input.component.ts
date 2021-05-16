import { Component, EventEmitter, forwardRef, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Place } from 'flightbook-commons-library';

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
    const file: File = (event.target as HTMLInputElement).files[0];
    this.fileName = file.name;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = e => {
      this.fileContent.emit(reader.result);
    };
  }
}
