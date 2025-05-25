export class SidebarItem {
  static userMenu = [
    {
      label: 'Início',
      icon: 'fas fa-home',
      route: '/inicio',
    },
    {
      label: 'Planos',
      icon: 'fas fa-layer-group',
      route: '/plano',
    },
    {
      label: 'Métricas',
      icon: 'fas fa-chart-line',
      route: '/metricas',
    },
    /*{
      label: 'Sessões',
      icon: 'fas fa-calendar-check',
      route: '/sessao',
    },*/
    {
      label: 'Gravações',
      icon: 'fas fa-record-vinyl',
      route: '/gravacoes',
    },
  ];

  static technicalMenu = [
    {
      label: 'Início',
      icon: 'fas fa-home',
      route: '/inicio',
    },
    {
      label: 'Utentes',
      icon: 'fas fa-users',
      route: '/users',
    },
    {
      label: 'Planos',
      icon: 'fas fa-layer-group',
      route: '/plano',
    },
    /*{
      label: 'Sessões',
      icon: 'fas fa-calendar-check',
      route: '/sessao',
    },*/
    {
      label: 'Mensagens',
      icon: 'fas fa-envelope',
      route: '/mensagens',
    },
    {
      label: 'Conteúdos',
      icon: 'fas fa-plus',
      route: '/criar-conteudo',
    },
    /*{
      label: 'Relatórios',
      icon: 'fas fa-chart-bar',
      route: '/reports',
    },*/
    {
      label: 'Métricas',
      icon: 'fas fa-chart-line',
      route: '/metricas',
    },
  ];

  static adminMenu = [
    {
      label: 'Início',
      icon: 'fas fa-home',
      route: '/inicio',
    },
    {
      label: 'Utilizadores',
      icon: 'fas fa-users',
      route: '/users',
    },
    /* {
      label: 'Planos',
      icon: 'fas fa-layer-group',
      route: '/plano',
    },
    {
      label: 'Sessões',
      icon: 'fas fa-calendar-check',
      route: '/sessao',
    }
    {
      label: 'Mensagens',
      icon: 'fas fa-envelope',
      route: '/mensagens',
    },
    {
      label: 'Criar Conteúdo',
      icon: 'fas fa-plus',
      route: '/criar-conteudo',
    },
    {
      label: 'Relatórios',
      icon: 'fas fa-chart-bar',
      route: '/reports',
    },,*/
    {
      label: 'Configurações',
      icon: 'fas fa-cog',
      route: '/settings',
    },
  ];
}
