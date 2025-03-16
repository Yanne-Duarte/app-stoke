import { Routes } from '@angular/router';
import { PortalComponent } from './core/layout/components/portal/portal.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { PlanoComponent } from './pages/plano/plano.component';
import { PlanoViewComponent } from './pages/plano/components/plano-view/plano-view.component';
import { PlanoEditComponent } from './pages/plano/components/plano-edit/plano-edit.component';
import { MensagensComponent } from './pages/mensagens/mensagens.component';
import { SessaoComponent } from './pages/sessao/sessao.component';
import { GravacoesListaComponent } from './pages/gravacoes/lista/gravacoes-lista.component';
import { GravarVideoComponent } from './pages/gravacoes/gravar/gravar-video.component';
import { NotificacoesComponent } from './pages/notificacoes/notificacoes.component';
import { NewsComponent } from './pages/news/news.component';
import { myGuardGuard } from './_security/my-guard.guard';
import { UserFormComponent } from './pages/users/components/user-form/user-form.component';
import { NotificacaoCreateComponent } from './pages/notificacoes/components/notificacao-create/notificacao-create.component';
import { NewsFormComponent } from './pages/news/components/news-form/news-form.component';
import { PlanoFormComponent } from './pages/plano/components/plano-form/plano-form.component';
import { UserViewComponent } from './pages/users/components/user-view/user-view.component';

export const routes: Routes = [
  {
    path: '',
    component: PortalComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [myGuardGuard],
        data: {
          roles: ['ADMIN', 'TECHNICAL', 'USER'],
        },
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [myGuardGuard],
        data: {
          roles: ['ADMIN', 'TECHNICAL'],
        },
      },
      {
        path: 'users/create',
        component: UserFormComponent,
        canActivate: [myGuardGuard],
        data: {
          roles: ['ADMIN'],
        },
      },
      {
        path: 'users/:id',
        component: UserViewComponent,
        canActivate: [myGuardGuard],
        data: {
          roles: ['ADMIN', 'TECHNICAL'],
        },
      },
      {
        path: 'users/:id/edit',
        component: UserFormComponent,
        canActivate: [myGuardGuard],
        data: {
          roles: ['ADMIN', 'TECHNICAL'],
        },
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [myGuardGuard],
        data: {
          roles: ['ADMIN'],
        },
      },
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [myGuardGuard],
        data: {
          roles: ['ADMIN', 'TECHNICAL'],
        },
      },
      {
        path: 'plano',
        component: PlanoComponent,
        canActivate: [myGuardGuard],
        data: {
          roles: ['ADMIN', 'TECHNICAL', 'USER'],
        },
      },
      {
        path: 'plano/criar',
        component: PlanoFormComponent,
        canActivate: [myGuardGuard],
        data: {
          roles: ['ADMIN', 'TECHNICAL'],
        },
      },
      {
        path: 'plano/:id',
        component: PlanoViewComponent,
        canActivate: [myGuardGuard],
        data: {
          roles: ['ADMIN', 'TECHNICAL', 'USER'],
        },
      },
      {
        path: 'plano/:id/edit',
        component: PlanoFormComponent,
        canActivate: [myGuardGuard],
        data: {
          roles: ['ADMIN', 'TECHNICAL'],
        },
      },
      {
        path: 'mensagens',
        component: MensagensComponent,
        canActivate: [myGuardGuard],
        data: {
          roles: ['ADMIN', 'TECHNICAL'],
        },
      },
      {
        path: 'sessao',
        component: SessaoComponent,
        canActivate: [myGuardGuard],
        data: {
          roles: ['TECHNICAL', 'USER'],
        },
      },
      {
        path: 'gravacoes',
        component: GravacoesListaComponent,
        canActivate: [myGuardGuard],
        data: {
          roles: ['TECHNICAL', 'USER'],
        },
      },
      {
        path: 'gravacoes/gravar',
        component: GravarVideoComponent,
        canActivate: [myGuardGuard],
        data: {
          roles: ['TECHNICAL', 'USER'],
        },
      },
      {
        path: 'notificacoes',
        component: NotificacoesComponent,
        canActivate: [myGuardGuard],
        data: {
          roles: ['ADMIN', 'TECHNICAL', 'USER'],
        },
      },
      {
        path: 'notificacoes/criar',
        component: NotificacaoCreateComponent,
        canActivate: [myGuardGuard],
        data: {
          roles: ['ADMIN', 'TECHNICAL', 'USER'],
        },
      },
      {
        path: 'criar-conteudo',
        component: NewsComponent,
        canActivate: [myGuardGuard],
        data: {
          roles: ['TECHNICAL'],
        },
      },
      {
        path: 'criar-conteudo/criar',
        component: NewsFormComponent,
        canActivate: [myGuardGuard],
        data: {
          roles: ['TECHNICAL'],
        },
      },
      {
        path: 'criar-conteudo/editar/:id',
        component: NewsFormComponent,
        canActivate: [myGuardGuard],
        data: {
          roles: ['TECHNICAL'],
        },
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '**',
    redirectTo: 'mensagens',
  },
];
