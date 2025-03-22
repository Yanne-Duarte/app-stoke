import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-play-video',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './play-video.component.html',
  styleUrl: './play-video.component.scss'
})
export class PlayVideoComponent {
  @Input() videoName: string = '';
  @Output() result = new EventEmitter<boolean>();
  uploadedFileName: string = '';
  isPlaying: boolean = false;
  videoFile: File | null = null;
  URL = window.URL;

  constructor(private activeModal: NgbActiveModal) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.videoFile = file;
      this.uploadedFileName = file.name;
    }
  }

  onConfirm() {
    if (this.uploadedFileName === this.videoName) {
      this.isPlaying = true;
      this.result.emit(true);
    }
  }

  onCancel() {
    this.result.emit(false);
    this.activeModal.dismiss();
  }
}
