import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NewsDTO } from '../../../../api/models.dto';
import { ApiService } from '../../../../api/api.service';
import { EditorComponent } from '../../../../core/layout/components/editor/editor.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-news-form',
  templateUrl: './news-form.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, EditorComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
      content: ['', Validators.required]
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
        this.newsForm.patchValue({
          title: news.title,
          content: news.content
        });
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
      const formValue = this.newsForm.value;
      console.log('Form content:', formValue.content);
      
      const newsData: Partial<NewsDTO> = {
        title: formValue.title.trim(),
        content: formValue.content
      };
      
      if (this.isEditing && this.newsId) {
        this.apiService.updateNews(this.newsId, newsData as NewsDTO).subscribe({
          next: () => {
            this.router.navigate(['/criar-conteudo']);
          },
          error: (error) => {
            console.error('Error updating news:', error);
            alert('Erro ao atualizar a notícia. Por favor, tente novamente.');
          }
        });
      } else {
        this.apiService.createNews(newsData as NewsDTO).subscribe({
          next: () => {
            this.router.navigate(['/criar-conteudo']);
          },
          error: (error) => {
            console.error('Error creating news:', error);
            alert('Erro ao criar a notícia. Por favor, tente novamente.');
          }
        });
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/criar-conteudo']);
  }
} 