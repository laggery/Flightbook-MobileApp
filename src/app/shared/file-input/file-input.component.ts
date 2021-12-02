import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'fb-file-input',
  templateUrl: 'file-input.component.html',
  styleUrls: ['file-input.component.scss']
})
export class FileInputComponent implements OnInit {

  @Input()
  uploadSuccessful = false;

  @Input()
  multiple = false;

  progress = 0;

  @Output()
  fileContent = new EventEmitter<string | ArrayBuffer>();

  @Output()
  onFilesSelectEvent = new EventEmitter<File[]>();

  constructor(
    private alertController: AlertController,
    private translate: TranslateService) {
  }

  ngOnInit() {
  }

  async onFilesSelect(event: any) {
    const files = (event.target as HTMLInputElement).files;
    const newFiles = [];

    if (!this.multiple) {
      const fileType = files[0].name.slice(-3);
      if (fileType.toLowerCase() != "igc") {
        const alert = await this.alertController.create({
          header: this.translate.instant('message.infotitle'),
          message: this.translate.instant('message.wrongIgcFileType'),
          buttons: [this.translate.instant('buttons.done')]
        });
        await alert.present();
        return;
      }
    }

    for (let i = 0; i < files.length; i++) {
      const file = (event.target as HTMLInputElement).files[i]
      const fileType = file.name.slice(-3);
      if (file.size > 0 && fileType.toLocaleLowerCase() == "igc") {
        let fileName = `${uuidv4()}-${file.name}`;
        newFiles.push(new File([file], fileName));
      }
    }

    this.onFilesSelectEvent.emit(newFiles);
  }
}
