import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NewsDTO } from '../../../../api/models.dto';
import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-news-form',
  templateUrl: './news-form.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class NewsFormComponent implements OnInit {
  newsForm: FormGroup;
  isEditing = false;
  newsId?: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {
    this.newsForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      author: ['', Validators.required],
      category: ['', Validators.required],
      date: ['', Validators.required],
      status: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.newsId = +id;
      this.loadNews(this.newsId);
    }
  }

  loadNews(id: number) {
    this.loading = true;
    this.apiService.getNewsById(id).subscribe({
      next: (news) => {
        this.newsForm.patchValue(news);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading news:', error);
        this.loading = false;
        this.router.navigate(['/criar-conteudo']);
      }
    });
  }

  onSubmit(): void {
    if (this.newsForm.valid) {
      const newsData = this.newsForm.value;
      
      if (this.isEditing && this.newsId) {
        this.apiService.updateNews(this.newsId, newsData).subscribe({
          next: () => {
            this.router.navigate(['/criar-conteudo']);
          },
          error: (error) => {
            console.error('Error updating news:', error);
          }
        });
      } else {
        this.apiService.createNews(newsData).subscribe({
          next: () => {
            this.router.navigate(['/criar-conteudo']);
          },
          error: (error) => {
            console.error('Error creating news:', error);
          }
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/criar-conteudo']);
  }
} 