import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VideoRecordDTO } from '../../../api/models.dto';
import { ApiService } from '../../../api/api.service';

@Component({
  selector: 'app-gravacoes-lista',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './gravacoes-lista.component.html',
  styleUrls: ['./gravacoes-lista.component.scss'],
})
export class GravacoesListaComponent implements OnInit {
  videos: VideoRecordDTO[] = [];
  loading = false;
  error: string | null = null;
  selectedVideo: VideoRecordDTO | null = null;

  lastID = signal(0);

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadVideos();
  }

  private loadVideos() {
    this.loading = true;
    this.error = null;

    this.apiService.getVideos().subscribe({
      next: (videos) => {
        this.videos = videos;
        this.loading = false;

        if (this.videos.length > 0) {
          this.lastID.set(
            this.videos.reduce(
              (max, video) => (video.id > max ? video.id : max),
              0
            ) + 1
          );
        }
      },
      error: (error) => {
        console.error('Erro ao carregar vídeos:', error);
        this.error = 'Erro ao carregar os vídeos. Por favor, tente novamente.';
        this.loading = false;
      },
    });
  }

  playVideo(video: VideoRecordDTO) {
    if (video.storedLocally) {
      // Mostrar diálogo com instruções
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
      modal.style.display = 'flex';
      modal.style.flexDirection = 'column';
      modal.style.justifyContent = 'center';
      modal.style.alignItems = 'center';
      modal.style.zIndex = '1000';

      // Criar container para o conteúdo
      const container = document.createElement('div');
      container.style.backgroundColor = 'white';
      container.style.padding = '20px';
      container.style.borderRadius = '8px';
      container.style.maxWidth = '500px';
      container.style.width = '90%';
      container.style.textAlign = 'center';

      // Adicionar instruções
      const instructions = document.createElement('p');
      instructions.textContent = `Por favor, selecione o vídeo "${video.name}" da sua pasta de downloads.`;
      instructions.style.marginBottom = '20px';

      // Botão para selecionar arquivo
      const selectButton = document.createElement('button');
      selectButton.textContent = 'Selecionar Vídeo';
      selectButton.style.padding = '10px 20px';
      selectButton.style.backgroundColor = '#007bff';
      selectButton.style.color = 'white';
      selectButton.style.border = 'none';
      selectButton.style.borderRadius = '4px';
      selectButton.style.cursor = 'pointer';
      selectButton.style.marginRight = '10px';

      // Botão para cancelar
      const cancelButton = document.createElement('button');
      cancelButton.textContent = 'Cancelar';
      cancelButton.style.padding = '10px 20px';
      cancelButton.style.backgroundColor = '#6c757d';
      cancelButton.style.color = 'white';
      cancelButton.style.border = 'none';
      cancelButton.style.borderRadius = '4px';
      cancelButton.style.cursor = 'pointer';

      // Adicionar event listeners
      selectButton.onclick = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'video/*';

        fileInput.onchange = (e: any) => {
          const file = e.target.files[0];
          if (file) {
            document.body.removeChild(modal);

            const videoUrl = URL.createObjectURL(file);
            const videoPlayer = document.createElement('video');
            videoPlayer.src = videoUrl;
            videoPlayer.controls = true;
            videoPlayer.style.width = '100%';
            videoPlayer.style.maxWidth = '800px';

            // Mostrar o vídeo numa janela modal
            const videoModal = document.createElement('div');
            videoModal.style.position = 'fixed';
            videoModal.style.top = '0';
            videoModal.style.left = '0';
            videoModal.style.width = '100%';
            videoModal.style.height = '100%';
            videoModal.style.backgroundColor = 'rgba(0,0,0,0.8)';
            videoModal.style.display = 'flex';
            videoModal.style.justifyContent = 'center';
            videoModal.style.alignItems = 'center';
            videoModal.style.zIndex = '1000';

            // Botão de fechar
            const closeButton = document.createElement('button');
            closeButton.textContent = '×';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '20px';
            closeButton.style.right = '20px';
            closeButton.style.fontSize = '24px';
            closeButton.style.color = 'white';
            closeButton.style.background = 'none';
            closeButton.style.border = 'none';
            closeButton.style.cursor = 'pointer';

            closeButton.onclick = () => {
              document.body.removeChild(videoModal);
              URL.revokeObjectURL(videoUrl);
            };

            videoModal.appendChild(videoPlayer);
            videoModal.appendChild(closeButton);
            document.body.appendChild(videoModal);

            videoPlayer.play();
          }
        };

        fileInput.click();
      };

      cancelButton.onclick = () => {
        document.body.removeChild(modal);
      };

      // Montar a estrutura do modal
      container.appendChild(instructions);
      container.appendChild(selectButton);
      container.appendChild(cancelButton);
      modal.appendChild(container);
      document.body.appendChild(modal);
    } else {
      // Para vídeos guardados no servidor
      window.open(`download/${video.filePath}`, '_blank');
    }
  }

  deleteVideo(video: VideoRecordDTO) {
    if (confirm('Tem certeza que deseja excluir este vídeo?')) {
      this.apiService.deleteVideo(video.id).subscribe({
        next: () => {
          this.loadVideos(); // Recarregar a lista após excluir
        },
        error: (error) => {
          console.error('Erro ao excluir vídeo:', error);
          this.error = 'Erro ao excluir o vídeo. Por favor, tente novamente.';
        },
      });
    }
  }
}
