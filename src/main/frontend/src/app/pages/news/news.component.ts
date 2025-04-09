import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationComponent } from './components/delete-confirmation/delete-confirmation.component';
import { NewsDTO } from '../../api/models.dto';
import { ApiService } from '../../api/api.service';
import { SearchResultsComponent } from '../../core/layout/components/search-results/search-results.component';
import {
  FilterField,
  TableHeader,
} from '../../core/layout/components/search-results/search.model';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchResultsComponent],
})
export class NewsComponent implements OnInit {
  news: NewsDTO[] = [];
  loading = false;

  filterFields: FilterField[] = [
    { name: 'title', label: 'Título', type: 'text' },
    { name: 'authorName', label: 'Autor', type: 'text' },
    { name: 'createdAt', label: 'Data', type: 'date' },
  ];

  headers: TableHeader[] = [
    { key: 'title', label: 'Título' },
    { key: 'authorName', label: 'Autor' },
    { key: 'createdAt', label: 'Data' },
  ];
  canCreate: boolean = false;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.canCreate =
      JSON.parse(localStorage.getItem('user') ?? '').perfil === 'TECHNICAL';
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
      },
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/criar-conteudo/criar']);
  }

  navigateToEdit(news: NewsDTO): void {
    this.router.navigate(['/criar-conteudo/editar', news.id]);
  }

  navigateToView(news: NewsDTO): void {
    this.router.navigate(['/criar-conteudo', news.id]);
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
            },
          });
        }
      },
      () => {}
    );
  }

  handleFilter(filters: any): void {
    // Implement filter logic here
    this.loadNews();
  }

  handleClear(): void {
    this.loadNews();
  }
}
