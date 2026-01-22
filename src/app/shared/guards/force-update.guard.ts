import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { VersionCheckService, UpdateStatus, VersionCheckResponse } from '../services/version-check.service';
import { UpdatePromptComponent } from '../components/update-prompt/update-prompt.component';

@Injectable({
  providedIn: 'root'
})
export class ForceUpdateGuard {
  private versionChecked = false;
  private checkInProgress = false;

  constructor(
    private versionCheckService: VersionCheckService,
    private modalController: ModalController
  ) {}

  async canActivate(): Promise<boolean> {
    if (this.versionChecked || this.checkInProgress) {
      return true;
    }

    this.checkInProgress = true;

    try {
      const versionInfo = await this.versionCheckService.checkVersion();
      
      if (versionInfo && (versionInfo.status === UpdateStatus.FORCE_UPDATE || versionInfo.status === UpdateStatus.OPTIONAL_UPDATE)) {
        await this.showUpdatePrompt(versionInfo);
        
        if (versionInfo.status === UpdateStatus.FORCE_UPDATE) {
          this.checkInProgress = false;
          return false;
        }
      }
      
      this.versionChecked = true;
      return true;
    } catch (error) {
      console.error('Version check error in guard:', error);
      this.versionChecked = true;
      return true;
    } finally {
      this.checkInProgress = false;
    }
  }

  private async showUpdatePrompt(updateInfo: VersionCheckResponse): Promise<void> {
    const modal = await this.modalController.create({
      component: UpdatePromptComponent,
      componentProps: {
        updateInfo: updateInfo
      },
      backdropDismiss: updateInfo.status !== UpdateStatus.FORCE_UPDATE,
      keyboardClose: false
    });

    await modal.present();
  }

  resetCheck(): void {
    this.versionChecked = false;
  }
}
