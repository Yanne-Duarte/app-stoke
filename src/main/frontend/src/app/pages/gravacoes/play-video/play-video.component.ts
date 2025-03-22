import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
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
export class PlayVideoComponent implements OnDestroy {
  @Input() videoName: string = '';
  @Output() result = new EventEmitter<boolean>();
  uploadedFileName: string = '';
  isPlaying: boolean = false;
  videoFile: File | null = null;
  videoUrl: string = '';

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
    }
  }

  onCancel() {
    this.result.emit(false);
    this.activeModal.dismiss();
  }

  ngOnDestroy() {
    // Clean up the blob URL when component is destroyed
    if (this.videoUrl) {
      URL.revokeObjectURL(this.videoUrl);
    }
  }
}
