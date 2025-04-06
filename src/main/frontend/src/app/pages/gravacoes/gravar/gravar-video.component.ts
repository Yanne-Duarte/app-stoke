import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../api/api.service';
import { PlatformService } from '../../../api/platform.service';
import { ModalComponent } from 'src/app/core/layout/components/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VideoDescriptionModalComponent } from '../../../pages/video/components/video-description-modal/video-description-modal.component';

@Component({
  selector: 'app-gravar-video',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gravar-video.component.html',
})
export class GravarVideoComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement', { static: true })
  videoElement!: ElementRef<HTMLVideoElement>;

  lastID: any;

  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: BlobPart[] = [];
  private stream: MediaStream | null = null;

  isRecording = false;
  isPreviewActive = false;
  recordingError = '';
  duration = 0;
  private durationInterval: any;
  private startTime: number = 0;
  isSaving = false;
  username: any;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private platformService: PlatformService,
    private modalService: NgbModal
  ) {
    this.route.fragment.subscribe((fragment) => {
      this.lastID = fragment || '0000___';
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.username = user.username || this.generatedRandowName();
  }

  generatedRandowName() {
    return Math.random().toString(36).substring(2, 8);
  }

  async ngOnInit() {
    try {
      await this.setupCamera();
    } catch (error) {
      this.recordingError =
        'Erro ao acessar a câmera. Por favor, verifique as permissões.';
    }
  }

  ngOnDestroy() {
    this.stopRecording();
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
    }
  }

  private async setupCamera() {
    try {
      const constraints = {
        video: this.getVideoConstraints(),
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: this.platformService.isMobile() ? 22050 : 44100,
        },
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (this.videoElement?.nativeElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
        await this.videoElement.nativeElement.play();
        this.isPreviewActive = true;
      }
    } catch (error) {
      console.error('Erro ao configurar câmera:', error);
      this.recordingError =
        'Erro ao acessar a câmera. Por favor, verifique as permissões.';
      throw error;
    }
  }

  private getVideoConstraints() {
    if (this.platformService.isMobile()) {
      return {
        width: { ideal: 720 },
        height: { ideal: 1280 },
        frameRate: { ideal: 24 },
        facingMode: 'user',
      };
    }

    return {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30 },
    };
  }

  async startRecording() {
    try {
      if (!this.stream) {
        await this.setupCamera();
      }

      if (!this.stream) {
        throw new Error('Stream não disponível');
      }

      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.duration = 0;
      this.startTime = Date.now();

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.saveRecording();
      };

      this.mediaRecorder.start();
      this.isRecording = true;

      this.durationInterval = setInterval(() => {
        this.duration = Math.floor((Date.now() - this.startTime) / 1000);
      }, 1000);
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      this.recordingError = 'Erro ao iniciar a gravação.';
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      clearInterval(this.durationInterval);
    }
  }

  private async saveRecording() {
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    const timestamp = new Date();
    const fileName = `FS__${this.username}__${this.lastID}`;

    try {
      this.isSaving = true;

      // Salvar o arquivo localmente
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // Limpar e remover o elemento
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Abrir modal de descrição
      const descriptionModalRef = this.modalService.open(VideoDescriptionModalComponent, {
        size: 'md',
        centered: true,
      });

      // Aguardar a descrição do usuário
      const description = await new Promise<string>((resolve) => {
        descriptionModalRef.result.then(
          (result: string) => {
            if (result) {
              resolve(result);
            } else {
              resolve('Sem descrição'); // Valor padrão se o usuário cancelar
            }
          },
          () => {
            resolve('Sem descrição'); // Valor padrão se o usuário cancelar
          }
        );
      });

      // Preparar dados para o servidor
      const videoData = {
        name: fileName,
        duration: this.duration,
        timestamp: timestamp.toISOString(),
        filePath: 'local',
        size: blob.size / (1024 * 1024),
        storedLocally: true,
        downloadFolder: 'Pasta de Transferências',
        description: description // Adicionar a descrição ao objeto
      };

      // Enviar metadados para o servidor
      await this.apiService.saveVideo(videoData).toPromise();

      // Mostrar modal de sucesso
      this.openModal(videoData.filePath, videoData.name);

      this.router.navigate(['/gravacoes']);
    } catch (error) {
      console.error('Erro ao salvar gravação:', error);
      this.recordingError = 'Erro ao salvar a gravação.';
    } finally {
      this.isSaving = false;
    }
  }

  openModal(src: any, name: any) {
    const modalRef = this.modalService.open(ModalComponent, {
      size: 'lg',
      centered: true,
    });

    modalRef.componentInstance.title = 'Vídeo Guardado';
    modalRef.componentInstance.message = `Vídeo guardado com sucesso na sua ${src}!\nNome do ficheiro: ${name}`;
    modalRef.componentInstance.showCancelButton = false;
    modalRef.componentInstance.buttonConfirmLabel = 'Ok';

    modalRef.componentInstance.result.subscribe((result: boolean) => {
      if (result) {
        this.router.navigate(['/gravacoes']);
      }
    });
  }
}
