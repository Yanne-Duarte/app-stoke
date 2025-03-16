import { Injectable } from '@angular/core';
import RecordRTC from 'recordrtc';

@Injectable({
  providedIn: 'root',
})
export class VideoRecorderService {
  private getMediaRecorderOptions(): MediaRecorderOptions {
    const options: MediaRecorderOptions = {
      mimeType: this.getSupportedMimeType(),
      videoBitsPerSecond: 2500000, // 2.5 Mbps
      audioBitsPerSecond: 128000, // 128 kbps
    };
    return options;
  }

  private getSupportedMimeType(): string {
    const types = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return '';
  }

  async createRecorder(
    stream: MediaStream
  ): Promise<MediaRecorder | RecordRTC> {
    if (this.getSupportedMimeType()) {
      return new MediaRecorder(stream, this.getMediaRecorderOptions());
    } else {
      // Fallback para RecordRTC
      return new RecordRTC(stream, {
        type: 'video',
        frameRate: 30,
        bitsPerSecond: 2500000, // 2.5 Mbps

        /*video: {
          width: 1280,
          height: 720
        }*/
      });
    }
  }
}
