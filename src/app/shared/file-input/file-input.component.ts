import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'fb-file-input',
  templateUrl: 'file-input.component.html',
  styleUrls: ['file-input.component.scss']
})
export class FileInputComponent implements OnInit {

  fileName: string;

  @Input()
  uploadSuccessful = false;

  progress = 0;

  @Output()
  fileContent = new EventEmitter<string | ArrayBuffer>();

  @Output()
  onFileSelectEvent = new EventEmitter<File>();

  @Output()
  deleteEvent = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file: File = (event.target as HTMLInputElement).files[0];
      this.fileName = file.name;
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = e => {
        this.fileContent.emit(reader.result);
      };
      this.onFileSelectEvent.emit(file);
    }
  }

  deleteFile() {
    this.deleteEvent.emit(this.fileName);
  }
}
