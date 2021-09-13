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

  constructor(
    private alertController: AlertController,
    private translate: TranslateService) {
  }

  ngOnInit() {
  }

  async onFileSelect(event: any) {
    const fileType = (event.target as HTMLInputElement).files[0].name.slice(-3);
    if (fileType.toLowerCase() != "igc") {
      const alert = await this.alertController.create({
        header: this.translate.instant('message.infotitle'),
        message: this.translate.instant('message.wrongIgcFileType'),
        buttons: [this.translate.instant('buttons.done')]
      });
      await alert.present();
      return;
    }

    if (event.target.files.length > 0) {
      if (event.target.files[0].size === 0) {
        const alert = await this.alertController.create({
          header: this.translate.instant('message.infotitle'),
          message: this.translate.instant('message.emptyIgcFile'),
          buttons: [this.translate.instant('buttons.done')]
        });
        await alert.present();
        return;
      }

      this.fileName = `${uuidv4()}-${(event.target as HTMLInputElement).files[0].name}`;
      const file: File = new File([(event.target as HTMLInputElement).files[0]], this.fileName);
      this.fileName = file.name;
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = e => {
        this.fileContent.emit(reader.result);
      };
      this.onFileSelectEvent.emit(file);
    }
  }
}
