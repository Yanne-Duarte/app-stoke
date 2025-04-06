import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  private readonly MOBILE_BREAKPOINT = 1024; // Breakpoint para dispositivos móveis e tablets
  
  private isMobileSignal = signal(this.checkIfMobile());
  public isMobile = this.isMobileSignal.asReadonly();

  constructor() {
    // Observa mudanças no tamanho da janela
    window.addEventListener('resize', () => {
      this.isMobileSignal.set(this.checkIfMobile());
    });
 
  }

  private checkIfMobile(): boolean {
    return (
      window.innerWidth <= this.MOBILE_BREAKPOINT ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  }

  isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  supportsMediaRecorder(): boolean {
    return typeof MediaRecorder !== 'undefined';
  }
}
