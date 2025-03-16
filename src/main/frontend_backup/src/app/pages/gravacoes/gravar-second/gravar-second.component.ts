import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import RecordRTC from 'recordrtc';

@Component({
  selector: 'app-gravar-second',
  templateUrl: './gravar-second.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class GravarSecondComponent implements OnDestroy {
  @ViewChild('videoElement') videoElement?: ElementRef<HTMLVideoElement>;
  private stream?: MediaStream;
  private recorder?: RecordRTC;
  isRecording = false;
  videoUrl: string = '';
  isPreviewActive = false;
  recordingError: string | null = null;

  async startRecording() {
    try {
      await this.setupCamera();

      if (!this.stream) return;

      this.recorder = new RecordRTC(this.stream, {
        type: 'video',
      });

      this.recorder.startRecording();
      this.isRecording = true;
    } catch (err) {
      console.error('Erro ao iniciar gravação:', err);
    }
  }

  async stopRecording() {
    if (!this.recorder) return;

    this.recorder.stopRecording(() => {
      const blob = this.recorder?.getBlob();
      if (blob) {
        this.videoUrl = URL.createObjectURL(blob);
      }
      this.isRecording = false;
      this.stopMediaTracks();
    });
  }

  private stopMediaTracks() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
  }

  private async setupCamera() {
    try {
      // Add timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout accessing camera')), 10000);
      });

      this.stream = (await Promise.race([
        navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        }),
        timeoutPromise,
      ])) as MediaStream;

      if (this.videoElement?.nativeElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
        await this.videoElement.nativeElement.play();
        this.isPreviewActive = true;
      }
    } catch (error) {
      console.error('Erro ao configurar câmera:', error);
      this.recordingError =
        'Verifique se sua câmera está conectada e se você permitiu o acesso.';
      throw error;
    }
  }

  ngOnDestroy() {
    this.stopMediaTracks();
  }
}
