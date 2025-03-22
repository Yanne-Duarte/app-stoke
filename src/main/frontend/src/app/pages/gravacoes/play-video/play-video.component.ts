import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-play-video',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './play-video.component.html',
  styleUrl: './play-video.component.scss',
})
export class PlayVideoComponent implements OnDestroy {
  @Input() videoName: string = '';
  @Output() result = new EventEmitter<boolean>();
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  uploadedFileName: string = '';
  isPlaying: boolean = false;
  videoFile: File | null = null;
  videoUrl: string = '';
  isPaused: boolean = false;
  isMuted: boolean = false;
  videoSize: 'small' | 'normal' | 'big' = 'normal';

  constructor(private activeModal: NgbActiveModal) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.videoFile = file;
      this.uploadedFileName = file.name;
      // Create blob URL when file is selected
      if (this.videoUrl) {
        URL.revokeObjectURL(this.videoUrl);
      }
      this.videoUrl = URL.createObjectURL(file);
    }
  }

  onConfirm() {
    if (this.uploadedFileName === this.videoName) {
      this.isPlaying = true;
      this.result.emit(true);
      // Add a small delay to ensure the video element is ready
      setTimeout(() => {
        if (this.videoPlayer) {
          this.videoPlayer.nativeElement.play();
          this.isPaused = false;
        }
      }, 100);
    }
  }

  onCancel() {
    this.result.emit(false);
    this.activeModal.dismiss();
  }

  playVideo() {
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.play();
      this.isPaused = false;
    }
  }

  pauseVideo() {
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.pause();
      this.isPaused = true;
    }
  }

  stopVideo() {
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.pause();
      this.videoPlayer.nativeElement.currentTime = 0;
      this.isPaused = true;
    }
  }

  muteUnmute() {
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.muted =
        !this.videoPlayer.nativeElement.muted;
      this.isMuted = this.videoPlayer.nativeElement.muted;
    }
  }

  makeBig() {
    this.videoSize = 'big';
  }

  makeSmall() {
    this.videoSize = 'small';
  }

  makeNormal() {
    this.videoSize = 'normal';
  }

  ngOnDestroy() {
    // Clean up the blob URL when component is destroyed
    if (this.videoUrl) {
      URL.revokeObjectURL(this.videoUrl);
    }
  }
}
