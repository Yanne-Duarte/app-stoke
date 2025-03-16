import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  supportsMediaRecorder(): boolean {
    return typeof MediaRecorder !== 'undefined';
  }
}
