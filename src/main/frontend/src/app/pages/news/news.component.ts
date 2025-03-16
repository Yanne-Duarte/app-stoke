import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewsListComponent } from './components/news-list/news-list.component';
import { NewsFormComponent } from './components/news-form/news-form.component';
import { DeleteConfirmationComponent } from './components/delete-confirmation/delete-confirmation.component';
import { NewsDTO } from '../../api/models.dto';
import { ApiService } from '../../api/api.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  standalone: true,
  imports: [CommonModule, NewsListComponent, RouterModule],
})
export class NewsComponent implements OnInit {
  news: NewsDTO[] = [];
  loading = false;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.loading = true;
    this.apiService.getAllNews().subscribe({
      next: (news) => {
        this.news = news;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading news:', error);
        this.loading = false;
      }
    });
  }

  openCreateNewsModal(): void {
    const modalRef = this.modalService.open(NewsFormComponent, { size: 'lg' });
    modalRef.componentInstance.isEditing = false;
    modalRef.result.then(
      (result) => {
        if (result) {
          this.news.push({ ...result, id: this.news.length + 1 });
        }
      },
      () => {}
    );
  }

  navigateToEdit(news: NewsDTO): void {
    this.router.navigate(['/criar-conteudo/editar', news.id]);
  }

  openDeleteConfirmation(news: NewsDTO): void {
    const modalRef = this.modalService.open(DeleteConfirmationComponent);
    modalRef.componentInstance.news = news;
    modalRef.result.then(
      (result) => {
        if (result) {
          this.apiService.deleteNews(news.id).subscribe({
            next: () => {
              this.loadNews();
            },
            error: (error) => {
              console.error('Error deleting news:', error);
            }
          });
        }
      },
      () => {}
    );
  }
}
