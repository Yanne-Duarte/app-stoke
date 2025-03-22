import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LoginDTO,
  MemorizarDTO,
  RegisterDTO,
  UserDTO,
  UserStatusDTO,
  UserFilterDTO,
  NotificationDTO,
  ChatDTO,
  MessageDTO,
  UpdateUserByUserDto,
  UpdateUserByAdminDto,
  NewsDTO,
  VideoRecordDTO,
  PlanDTO,
} from './models.dto';
import { environment } from 'src/environments/environment.production';
import { Injectable } from '@angular/core';
import { tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = `${environment.apiUrl}/api`;
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token ? `Bearer ${this.token}` : '',
    });
  }

  //__________________________________________________________________________
  // login
  login(loginDTO: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, loginDTO);
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  //__________________________________________________________________________
  // DADOS DO UTILIZADOR
  getUserLogin(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/me`);
  }
  //__________________________________________________________________________

  // logout
  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/logout`, {});
  }

  //__________________________________________________________________________
  // register
  register(registerDTO: RegisterDTO): Observable<RegisterDTO> {
    return this.http.post<RegisterDTO>(
      `${this.apiUrl}/auth/signup`,
      registerDTO
    );
  }

  //__________________________________________________________________________
  //  USER
  //__________________________________________________________________________
  getCurrentUser(): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/users/me`);
  }

  getAllUsers(filter?: {
    fullName?: string;
    username?: string;
    perfil?: string;
    birthdate?: string;
    plano?: string;
    fisioterapeuta?: string;
  }): Observable<UserDTO[]> {
    let params = new HttpParams();

    if (filter) {
      Object.keys(filter).forEach((key) => {
        const value = filter[key as keyof typeof filter];
        if (value) {
          params = params.append(key, value);
        }
      });
    }

    return this.http.get<UserDTO[]>(`${this.apiUrl}/users`, {
      params,
    });
  }

  getAllTechnicalUsers(): Observable<{ id: number; fullName: string }[]> {
    return this.http.get<{ id: number; fullName: string }[]>(
      `${this.apiUrl}/users/getAllTechnical`
    );
  }

  registerUser(registerDTO: RegisterDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(
      `${this.apiUrl}/users/register`,
      registerDTO
    );
  }

  toggleUserStatus(userId: number): Observable<UserDTO> {
    return this.http.patch<UserDTO>(
      `${this.apiUrl}/users/${userId}/toggle-status`,
      {}
    );
  }

  updateUserByUser(
    userId: number,
    updateData: UpdateUserByUserDto
  ): Observable<UserDTO> {
    return this.http.patch<UserDTO>(
      `${this.apiUrl}/users/${userId}/update-user-by-user`,
      updateData
    );
  }

  updateUserByAdmin(
    userId: number,
    updateData: UpdateUserByAdminDto
  ): Observable<UserDTO> {
    return this.http.patch<UserDTO>(
      `${this.apiUrl}/users/${userId}/update-user-by-admin`,
      updateData
    );
  }

  //__________________________________________________________________________
  // NOTIFICATION
  //__________________________________________________________________________
  getNotifications(): Observable<NotificationDTO[]> {
    return this.http.get<NotificationDTO[]>(`${this.apiUrl}/notifications`, {});
  }

  getUnreadNotifications(): Observable<NotificationDTO[]> {
    return this.http.get<NotificationDTO[]>(
      `${this.apiUrl}/notifications/unread`
    );
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/notifications/unread/count`,
      {}
    );
  }

  getNotificationById(id: number): Observable<NotificationDTO> {
    return this.http.get<NotificationDTO>(`${this.apiUrl}/notifications/${id}`);
  }

  createNotification(notification: {
    title: string;
    message: string;
    recipientUserId: number;
  }): Observable<NotificationDTO> {
    return this.http.post<NotificationDTO>(
      `${this.apiUrl}/notifications`,
      notification
    );
  }

  markAsRead(id: number): Observable<NotificationDTO> {
    return this.http.patch<NotificationDTO>(
      `${this.apiUrl}/notifications/${id}/read`,
      {}
    );
  }

  markAsUnread(id: number): Observable<NotificationDTO> {
    return this.http.patch<NotificationDTO>(
      `${this.apiUrl}/notifications/${id}/unread`,
      {}
    );
  }

  markAllAsRead(): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/notifications/mark-all-read`,
      {}
    );
  }

  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/notifications/${id}`, {});
  }

  // Obter utilizador por ID
  getUserById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/users/${id}`, {});
  }

  // Atualizar utilizador
  updateUser(id: number, userDTO: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/users/${id}`, userDTO, {});
  }

  // Atualizar utilizador
  updateUserStatus(
    id: number,
    userStatusDTO: UserStatusDTO
  ): Observable<UserDTO> {
    return this.http.patch<UserDTO>(
      `${this.apiUrl}/users/${id}/status`,
      userStatusDTO
    );
  }

  // Deletar utilizador
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`, {});
  }

  //__________________________________________________________________________
  // MESSAGES
  //__________________________________________________________________________
  getUserChats(): Observable<ChatDTO[]> {
    return this.http.get<ChatDTO[]>(`${this.apiUrl}/messages`, {});
  }

  getChatMessages(chatId: number): Observable<MessageDTO[]> {
    return this.http.get<MessageDTO[]>(`${this.apiUrl}/messages/${chatId}`, {});
  }

  sendMessage(content: string, recipientId: number): Observable<MessageDTO> {
    return this.http.post<MessageDTO>(`${this.apiUrl}/messages`, {
      content,
      recipientId,
    });
  }

  markMessageAsRead(messageId: number): Observable<MessageDTO> {
    return this.http.patch<MessageDTO>(
      `${this.apiUrl}/messages/${messageId}/read`,
      {}
    );
  }

  markAllMessagesAsRead(): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/messages/mark-all-read`, {});
  }

  //__________________________________________________________________________
  // NEWS
  //__________________________________________________________________________
  getAllNews(): Observable<NewsDTO[]> {
    return this.http.get<NewsDTO[]>(`${this.apiUrl}/news`, {});
  }

  getNewsById(id: number): Observable<NewsDTO> {
    return this.http.get<NewsDTO>(`${this.apiUrl}/news/${id}`, {});
  }

  createNews(news: Omit<NewsDTO, 'id'>): Observable<NewsDTO> {
    return this.http.post<NewsDTO>(`${this.apiUrl}/news`, news, {});
  }

  updateNews(id: number, news: Omit<NewsDTO, 'id'>): Observable<NewsDTO> {
    return this.http.put<NewsDTO>(`${this.apiUrl}/news/${id}`, news, {});
  }

  deleteNews(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/news/${id}`);
  }

  //__________________________________________________________________________
  // VIDEOS
  //__________________________________________________________________________
  getVideos(): Observable<VideoRecordDTO[]> {
    return this.http.get<VideoRecordDTO[]>(`${this.apiUrl}/videos`);
  }

  getVideoById(id: number): Observable<VideoRecordDTO> {
    return this.http.get<VideoRecordDTO>(`${this.apiUrl}/videos/${id}`);
  }

  saveVideo(videoData: Omit<VideoRecordDTO, 'id'>): Observable<VideoRecordDTO> {
    return this.http.post<VideoRecordDTO>(`${this.apiUrl}/videos`, videoData);
  }

  deleteVideo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/videos/${id}`);
  }

  //__________________________________________________________________________
  // PLANOS
  //__________________________________________________________________________
  getAllPlans(filters?: {
    userName?: string;
    creationDateStart?: string;
    creationDateEnd?: string;
    validityDateStart?: string;
    validityDateEnd?: string;
  }): Observable<PlanDTO[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.userName)
        params = params.append('userName', filters.userName);
      if (filters.creationDateStart)
        params = params.append('creationDateStart', filters.creationDateStart);
      if (filters.creationDateEnd)
        params = params.append('creationDateEnd', filters.creationDateEnd);
      if (filters.validityDateStart)
        params = params.append('validityDateStart', filters.validityDateStart);
      if (filters.validityDateEnd)
        params = params.append('validityDateEnd', filters.validityDateEnd);
    }

    return this.http
      .get<PlanDTO[]>(`${this.apiUrl}/plans`, {
        params,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  getPlanById(id: number): Observable<PlanDTO> {
    return this.http.get<PlanDTO>(`${this.apiUrl}/plans/${id}`, {}).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getAvailableUsers(): Observable<UserDTO[]> {
    return this.http
      .get<UserDTO[]>(`${this.apiUrl}/plans/available-users`, {})
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  createPlan(plan: PlanDTO): Observable<PlanDTO> {
    return this.http.post<PlanDTO>(`${this.apiUrl}/plans`, plan, {}).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  updatePlan(id: number, plan: PlanDTO): Observable<PlanDTO> {
    return this.http.put<PlanDTO>(`${this.apiUrl}/plans/${id}`, plan, {}).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  updatePlanValidityDate(
    id: number,
    newValidityDate: string
  ): Observable<PlanDTO> {
    return this.http
      .patch<PlanDTO>(
        `${this.apiUrl}/plans/${id}/validity-date`,
        newValidityDate
      )
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  updatePlanEnabled(id: number, enabled: boolean): Observable<PlanDTO> {
    return this.http
      .patch<PlanDTO>(`${this.apiUrl}/plans/${id}/enabled`, enabled, {})
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  deletePlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/plans/${id}`, {}).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  ///

  downloadAttachment(fileName: string): Observable<Blob> {
    return this.http.get(
      `${environment.apiUrl}/chats/attachments/${fileName}`,
      {
        responseType: 'blob',
      }
    );
  }
}
