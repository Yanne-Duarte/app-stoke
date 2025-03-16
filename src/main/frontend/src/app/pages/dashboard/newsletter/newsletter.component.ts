import { ApiService } from './../../../api/api.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsDTO } from '../../../api/models.dto';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './newsletter.component.html',
})
export class NewsletterComponent implements OnInit {
  newsletters:  NewsDTO[] = [];

  constructor(private ApiService: ApiService) {}

  ngOnInit(): void {
    this.loadNewsletters();
  }

  private loadNewsletters(): void {
    this.ApiService.getAllNews().subscribe({
      next: (data) => {
        this.newsletters = data;
      },
      error: (error) => {
        console.error('Error fetching newsletters:', error);
        // You might want to handle errors appropriately in your UI
      }
    });
  }
}
