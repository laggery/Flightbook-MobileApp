import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { v4 as uuidv4 } from 'uuid';
import { FilePicker, PickedFile } from '@capawesome/capacitor-file-picker';
import { NgIf } from '@angular/common';

@Component({
    selector: 'fb-file-input',
    templateUrl: 'file-input.component.html',
    styleUrls: ['file-input.component.scss'],
    standalone: true,
    imports: [NgIf, IonicModule]
})
export class FileInputComponent implements OnInit {

  @Input()
  uploadSuccessful = false;

  @Input()
  multiple = false;

  progress = 0;

  isIos = false;

  @Output()
  fileContent = new EventEmitter<string | ArrayBuffer>();

  @Output()
  onFilesSelectEvent = new EventEmitter<File[]>();

  constructor(
    private alertController: AlertController,
    private translate: TranslateService) {
      if (Capacitor.getPlatform() == "ios") {
        this.isIos = true;
      }
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

  async onIosFilesSelect() {
    const result = await FilePicker.pickFiles({
      // types: ['text/igc'], // No longer working with ios 16
      limit: this.multiple ? 0 : 1,
      readData: true
    });

    const newFiles: File[] = [];

    if (!this.multiple && (result.files[0] as PickedFile).name.slice(-3).toLowerCase() != "igc") {
      const alert = await this.alertController.create({
        header: this.translate.instant('message.infotitle'),
        message: this.translate.instant('message.wrongIgcFileType'),
        buttons: [this.translate.instant('buttons.done')]
      });
      await alert.present();
      return;
    }

    result.files.forEach((file: PickedFile) => {
      if (file.size > 0 && file.name.slice(-3).toLowerCase() == "igc") {
        let fileName = `${uuidv4()}-${file.name}`;
        const stringContent = atob(file.data);
        newFiles.push(new File([new Blob([stringContent])], fileName, {
          type: ""
        }));
      }
    })

    this.onFilesSelectEvent.emit(newFiles);
  }
}
