import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NewsDTO } from '../../../../api/models.dto';
import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class NewsDetailComponent implements OnInit {
  news: NewsDTO | null = null;
  loading = false;
  safeContent: SafeHtml | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadNews(+id);
    }
  }

  loadNews(id: number): void {
    this.loading = true;
    this.apiService.getNewsById(id).subscribe({
      next: (news) => {
        this.news = news;
        this.safeContent = this.sanitizer.bypassSecurityTrustHtml(news.content);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading news: ' + error;
        this.loading = false;
      }
    });
  }
} 