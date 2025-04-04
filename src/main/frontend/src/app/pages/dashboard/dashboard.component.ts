import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GravarVideoComponent } from '../gravacoes/gravar/gravar-video.component';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { NewsletterComponent } from './newsletter/newsletter.component';

Chart.register(...registerables);
Chart.register(ChartDataLabels);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NewsletterComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  menuItems: any; /*= [
    {
      title: 'Gravar',
      icon: 'fas fa-record-vinyl',
      route: '/gravacoes/gravar',
    },
    / * {
      title: 'Sessões',
      icon: 'fas fa-calendar-alt',
      route: '/sessoes'
    },* /
    {
      title: 'Gravações',
      icon: 'fas fa-video',
      route: '/gravacoes',
    },
    {
      title: 'Notificações',
      icon: 'fas fa-bell',
      route: '/notificacoes',
    },
    / *{
      title: 'Mensagens',
      icon: 'fas fa-envelope',
      route: '/mensagens'
    },* /
    {
      title: 'Progresso',
      icon: 'fas fa-chart-line',
      route: '/metricas',
    },
  ];*/

  adminMenu = [
    {
      title: 'Gravar',
      icon: 'fas fa-record-vinyl',
      route: '/gravacoes/gravar',
    },

    {
      title: 'Notificações',
      icon: 'fas fa-bell',
      route: '/notificacoes',
    },
    {
      title: 'Mensagens',
      icon: 'fas fa-envelope',
      route: '/mensagens',
    },
  ];

  technicalMenu = [
    {
      title: 'Notificações',
      icon: 'fas fa-bell',
      route: '/notificacoes',
    },
    {
      title: 'Mensagens',
      icon: 'fas fa-envelope',
      route: '/mensagens',
    },
    {
      title: 'Progresso',
      icon: 'fas fa-chart-line',
      route: '/metricas',
    },
  ];

  userMenu = [
    {
      title: 'Gravar',
      icon: 'fas fa-record-vinyl',
      route: '/gravacoes/gravar',
    },

    /*{
      title: 'Gravações',
      icon: 'fas fa-video',
      route: '/gravacoes',
    },*/
    {
      title: 'Notificações',
      icon: 'fas fa-bell',
      route: '/notificacoes',
    },

    {
      title: 'Progresso',
      icon: 'fas fa-chart-line',
      route: '/metricas',
    },
  ];
  constructor() {}

  ngOnInit() {
    this.createSessionsChart();
    this.createProgressChart();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(user.perfil);
    if (user.perfil === 'ADMIN') {
      this.menuItems = this.adminMenu;
    } else if (user.perfil === 'TECHNICAL') {
      this.menuItems = this.technicalMenu;
    } else if (user.perfil === 'USER') {
      this.menuItems = this.userMenu;
    }
  }

  createSessionsChart() {
    /* const ctx = document.getElementById('sessionsChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Sessões Completas', 'Telesessões Completas', 'Telesessões Falhadas', 'Sessões Pendentes'],
        datasets: [{
          data: [4, 3, 1, 2],
          backgroundColor: [
            '#2ecc71', // verde
            '#3498db', // azul
            '#e74c3c', // vermelho
            '#95a5a6'  // cinza
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Status das Sessões'
          },
          tooltip: {
            enabled: true
          },
          datalabels: {
            color: '#fff',
            font: {
              weight: 'bold',
              size: 16
            },
            formatter: (value, context) => {
              return value.toString();
            }
          }
        }
      }
    });*/
  }

  createProgressChart() {
    /* const ctx = document.getElementById('progressChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [{
          label: 'Progresso Mensal',
          data: [65, 72, 78, 75, 82, 88],
          fill: true,
          borderColor: '#2ecc71',
          backgroundColor: 'rgba(46, 204, 113, 0.2)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Progresso ao Longo do Tempo'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }
    });*/
  }
}
