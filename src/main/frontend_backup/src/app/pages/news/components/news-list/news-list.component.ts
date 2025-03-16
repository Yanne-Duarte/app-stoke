import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { NewsDTO } from '../../../../api/models.dto';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  standalone: true,
  imports: [CommonModule, NgbCollapse, FormsModule]
})
export class NewsListComponent {
  @Input() news: NewsDTO[] = [];
  @Input() loading = false;
  @Output() onEdit = new EventEmitter<NewsDTO>();
  @Output() onDelete = new EventEmitter<NewsDTO>();
  
  isCollapsed = true;
  searchTitle = '';
  searchCategory = '';
  searchAuthor = '';

  get filteredNews(): NewsDTO[] {
    return this.news.filter(item => {
      const matchTitle = !this.searchTitle || 
        item.title.toLowerCase().includes(this.searchTitle.toLowerCase());
      const matchCategory = !this.searchCategory || 
        item.category.toLowerCase().includes(this.searchCategory.toLowerCase());
      const matchAuthor = !this.searchAuthor || 
        item.author.toLowerCase().includes(this.searchAuthor.toLowerCase());
      
      return matchTitle && matchCategory && matchAuthor;
    });
  }
} 