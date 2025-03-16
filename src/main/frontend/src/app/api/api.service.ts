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
    return this.http.get<any>(`${this.apiUrl}/users/me`, {
      headers: this.getHeaders(),
    });
  }
  //__________________________________________________________________________

  // logout
  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/auth/logout`,
      {},
      { headers: this.getHeaders() }
    );
  }

  //__________________________________________________________________________
  // register
  register(registerDTO: RegisterDTO): Observable<RegisterDTO> {
    return this.http.post<RegisterDTO>(
      `${this.apiUrl}/auth/signup`,
      registerDTO,
      { headers: this.getHeaders() }
    );
  }

  //__________________________________________________________________________
  //  USER
  //__________________________________________________________________________
  getCurrentUser(): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/users/me`, {
      headers: this.getHeaders(),
    });
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
      headers: this.getHeaders(),
    });
  }

  getAllTechnicalUsers(): Observable<{id: number, fullName: string}[]> {
    return this.http.get<{id: number, fullName: string}[]>(
      `${this.apiUrl}/users/getAllTechnical`,
      { headers: this.getHeaders() }
    );
  }

  registerUser(registerDTO: RegisterDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(
      `${this.apiUrl}/users/register`,
      registerDTO,
      { headers: this.getHeaders() }
    );
  }

  toggleUserStatus(userId: number): Observable<UserDTO> {
    return this.http.patch<UserDTO>(
      `${this.apiUrl}/users/${userId}/toggle-status`,
      {},
      { headers: this.getHeaders() }
    );
  }

  updateUserByUser(
    userId: number,
    updateData: UpdateUserByUserDto
  ): Observable<UserDTO> {
    return this.http.patch<UserDTO>(
      `${this.apiUrl}/users/${userId}/update-user-by-user`,
      updateData,
      { headers: this.getHeaders() }
    );
  }

  updateUserByAdmin(
    userId: number,
    updateData: UpdateUserByAdminDto
  ): Observable<UserDTO> {
    return this.http.patch<UserDTO>(
      `${this.apiUrl}/users/${userId}/update-user-by-admin`,
      updateData,
      { headers: this.getHeaders() }
    );
  }

  //__________________________________________________________________________
  // NOTIFICATION
  //__________________________________________________________________________
  getNotifications(): Observable<NotificationDTO[]> {
    return this.http.get<NotificationDTO[]>(`${this.apiUrl}/notifications`, {
      headers: this.getHeaders(),
    });
  }

  getUnreadNotifications(): Observable<NotificationDTO[]> {
    return this.http.get<NotificationDTO[]>(
      `${this.apiUrl}/notifications/unread`,
      { headers: this.getHeaders() }
    );
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/notifications/unread/count`, {
      headers: this.getHeaders(),
    });
  }

  getNotificationById(id: number): Observable<NotificationDTO> {
    return this.http.get<NotificationDTO>(
      `${this.apiUrl}/notifications/${id}`,
      { headers: this.getHeaders() }
    );
  }

  createNotification(notification: {
    title: string;
    message: string;
    recipientUserId: number;
  }): Observable<NotificationDTO> {
    return this.http.post<NotificationDTO>(
      `${this.apiUrl}/notifications`,
      notification,
      { headers: this.getHeaders() }
    );
  }

  markAsRead(id: number): Observable<NotificationDTO> {
    return this.http.patch<NotificationDTO>(
      `${this.apiUrl}/notifications/${id}/read`,
      {},
      { headers: this.getHeaders() }
    );
  }

  markAsUnread(id: number): Observable<NotificationDTO> {
    return this.http.patch<NotificationDTO>(
      `${this.apiUrl}/notifications/${id}/unread`,
      {},
      { headers: this.getHeaders() }
    );
  }

  markAllAsRead(): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/notifications/mark-all-read`,
      {},
      { headers: this.getHeaders() }
    );
  }

  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/notifications/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // Obter utilizador por ID
  getUserById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/users/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // Atualizar utilizador
  updateUser(id: number, userDTO: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/users/${id}`, userDTO, {
      headers: this.getHeaders(),
    });
  }

  // Atualizar utilizador
  updateUserStatus(
    id: number,
    userStatusDTO: UserStatusDTO
  ): Observable<UserDTO> {
    return this.http.patch<UserDTO>(
      `${this.apiUrl}/users/${id}/status`,
      userStatusDTO,
      { headers: this.getHeaders() }
    );
  }

  // Deletar utilizador
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`, {
      headers: this.getHeaders(),
    });
  }

  //__________________________________________________________________________
  // MESSAGES
  //__________________________________________________________________________
  getUserChats(): Observable<ChatDTO[]> {
    return this.http.get<ChatDTO[]>(`${this.apiUrl}/messages`, {
      headers: this.getHeaders(),
    });
  }

  getChatMessages(chatId: number): Observable<MessageDTO[]> {
    return this.http.get<MessageDTO[]>(`${this.apiUrl}/messages/${chatId}`, {
      headers: this.getHeaders(),
    });
  }

  sendMessage(content: string, recipientId: number): Observable<MessageDTO> {
    return this.http.post<MessageDTO>(
      `${this.apiUrl}/messages`,
      { content, recipientId },
      { headers: this.getHeaders() }
    );
  }

  markMessageAsRead(messageId: number): Observable<MessageDTO> {
    return this.http.patch<MessageDTO>(
      `${this.apiUrl}/messages/${messageId}/read`,
      {},
      { headers: this.getHeaders() }
    );
  }

  markAllMessagesAsRead(): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/messages/mark-all-read`,
      {},
      { headers: this.getHeaders() }
    );
  }

  //__________________________________________________________________________
  // NEWS
  //__________________________________________________________________________
  getAllNews(): Observable<NewsDTO[]> {
    return this.http.get<NewsDTO[]>(`${this.apiUrl}/news`, {
      headers: this.getHeaders(),
    });
  }

  getNewsById(id: number): Observable<NewsDTO> {
    return this.http.get<NewsDTO>(`${this.apiUrl}/news/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createNews(news: Omit<NewsDTO, 'id'>): Observable<NewsDTO> {
    return this.http.post<NewsDTO>(`${this.apiUrl}/news`, news, {
      headers: this.getHeaders(),
    });
  }

  updateNews(id: number, news: Omit<NewsDTO, 'id'>): Observable<NewsDTO> {
    return this.http.put<NewsDTO>(`${this.apiUrl}/news/${id}`, news, {
      headers: this.getHeaders(),
    });
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
    console.log('Getting plans with filters:', filters);
    console.log('Current token:', localStorage.getItem('token'));
    
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

    return this.http.get<PlanDTO[]>(`${this.apiUrl}/plans`, { 
      params,
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log('Plans response:', response)),
      catchError(error => {
        console.error('Error getting plans:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          error: error.error
        });
        return throwError(() => error);
      })
    );
  }

  getPlanById(id: number): Observable<PlanDTO> {
    console.log('Getting plan by id:', id);
    console.log('Current token:', localStorage.getItem('token'));
    
    return this.http.get<PlanDTO>(`${this.apiUrl}/plans/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log('Get plan response:', response)),
      catchError(error => {
        console.error('Error getting plan:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          error: error.error
        });
        return throwError(() => error);
      })
    );
  }

  getAvailableUsers(): Observable<UserDTO[]> {
    console.log('Getting available users');
    console.log('Current token:', localStorage.getItem('token'));
    
    return this.http.get<UserDTO[]>(`${this.apiUrl}/plans/available-users`, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log('Available users response:', response)),
      catchError(error => {
        console.error('Error getting available users:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          error: error.error
        });
        return throwError(() => error);
      })
    );
  }

  createPlan(plan: PlanDTO): Observable<PlanDTO> {
    console.log('Creating plan:', plan);
    console.log('Current token:', localStorage.getItem('token'));
    
    return this.http.post<PlanDTO>(`${this.apiUrl}/plans`, plan, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log('Create plan response:', response)),
      catchError(error => {
        console.error('Error creating plan:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          error: error.error
        });
        return throwError(() => error);
      })
    );
  }

  updatePlan(id: number, plan: PlanDTO): Observable<PlanDTO> {
    return this.http.put<PlanDTO>(`${this.apiUrl}/plans/${id}`, plan, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log('Update plan response:', response)),
      catchError(error => {
        console.error('Error updating plan:', error);
        console.error('Error details:', error);
        return throwError(() => error);
      })
    );
  }

  updatePlanValidityDate(id: number, newValidityDate: string): Observable<PlanDTO> {
    return this.http.patch<PlanDTO>(
      `${this.apiUrl}/plans/${id}/validity-date`,
      newValidityDate,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => console.log('Update validity date response:', response)),
      catchError(error => {
        console.error('Error updating validity date:', error);
        console.error('Error details:', error);
        return throwError(() => error);
      })
    );
  }

  updatePlanEnabled(id: number, enabled: boolean): Observable<PlanDTO> {
    return this.http.patch<PlanDTO>(
      `${this.apiUrl}/plans/${id}/enabled`,
      enabled,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => console.log('Update enabled status response:', response)),
      catchError(error => {
        console.error('Error updating enabled status:', error);
        console.error('Error details:', error);
        return throwError(() => error);
      })
    );
  }

  deletePlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/plans/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => console.log('Plan deleted successfully')),
      catchError(error => {
        console.error('Error deleting plan:', error);
        console.error('Error details:', error);
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
