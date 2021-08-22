import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'fb-file-input',
  templateUrl: 'file-input.component.html',
  styleUrls: ['file-input.component.scss']
})
export class FileInputComponent implements OnInit {

  uploadForm: FormGroup;
  fileName: string;

  @Input()
  uploadSuccessful = false;

  @Input()
  isEdit = false;

  progress = 0;

  @Output()
  fileContent = new EventEmitter<string | ArrayBuffer>();

  @Output()
  file = new EventEmitter<File>();

  @Output()
  deleteEvent = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      file: ['']
    });
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file: File = (event.target as HTMLInputElement).files[0];
      this.uploadForm.get('file').setValue(file);
      this.fileName = file.name;
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = e => {
        this.fileContent.emit(reader.result);
      };
    }
  }

  onSubmit() {
    this.file.emit(this.uploadForm.get('file').value);
  }

  deleteFile() {
    this.deleteEvent.emit(this.fileName);
  }
}