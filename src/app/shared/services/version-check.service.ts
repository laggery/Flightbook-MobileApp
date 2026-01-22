import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

export enum UpdateStatus {
  UP_TO_DATE = 'up_to_date',
  OPTIONAL_UPDATE = 'optional_update',
  FORCE_UPDATE = 'force_update',
}

export interface VersionCheckRequest {
  platform: string;
  app_version: string;
  build_number: number;
  os_version: string;
  locale: string;
}

export interface VersionCheckResponse {
  status: UpdateStatus;
  min_supported_build: number;
  latest_build: number;
  app_id: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class VersionCheckService {

  constructor(private http: HttpClient) { }

  async checkVersion(): Promise<VersionCheckResponse | null> {
    if (!Capacitor.isNativePlatform()) {
      return null;
    }

    try {
      const request = await this.buildVersionCheckRequest();
      return await this.performVersionCheck(request);
    } catch (error) {
      console.error('Version check failed:', error);
      return null;
    }
  }

  private async buildVersionCheckRequest(): Promise<VersionCheckRequest> {
    const appInfo = await App.getInfo();
    const platform = Capacitor.getPlatform();
    const osVersion = this.getOSVersion(platform);
    const locale = localStorage.getItem('language') || navigator.language.split('-')[0];

    return {
      platform: platform,
      app_version: appInfo.version,
      build_number: parseInt(appInfo.build, 10),
      os_version: osVersion,
      locale: locale
    };
  }

  private getOSVersion(platform: string): string {
    const userAgent = navigator.userAgent;
    
    if (platform === 'ios') {
      const match = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
      return match ? `${match[1]}.${match[2]}${match[3] ? '.' + match[3] : ''}` : 'unknown';
    } else if (platform === 'android') {
      const match = userAgent.match(/Android (\d+\.?\d*)/);
      return match ? match[1] : 'unknown';
    }
    
    return 'unknown';
  }

  private async performVersionCheck(request: VersionCheckRequest): Promise<VersionCheckResponse | null> {
    try {
      const response = await firstValueFrom(
        this.http.post<VersionCheckResponse>(
          `${environment.baseUrl}/configuration/version-check`,
          request
        ).pipe(
          catchError(error => {
            console.error('Version check API error:', error);
            return of(null);
          })
        )
      );

      return response;
    } catch (error) {
      console.error('Version check request failed:', error);
      return null;
    }
  }
}
