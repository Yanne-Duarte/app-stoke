export interface UserDTO {
  id?: number;
  fullName: string;
  username: string;
  birthdate: string;
  password?: string;
  token?: string;
  perfil: string;
  plano: string;
  fisioterapeuta: any;
}

export interface UserStatusDTO {
  status: boolean;
}

// memorizar
export interface MemorizarDTO {
  id?: number;
  // adicione aqui os outros campos necessários do seu DTO
}

export interface NewsDTO {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  category: string;
  status: boolean;
}

export interface LoginDTO {
  username: string;
  password: string;
  token?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface RegisterDTO {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface UserFilterDTO {
  fullName?: string;
  username?: string;
  perfil?: string;
  birthdate?: string;
  plano?: string;
  fisioterapeuta?: string;
}

export interface NotificationDTO {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  userId: number;
  senderId?: number;
  senderName?: string;
}

 

 
export interface UpdateUserByUserDto {
  fullName?: string;
  username?: string;
  birthdate?: string;
  password?: string;
}

export interface UpdateUserByAdminDto extends UpdateUserByUserDto {
  password?: string;
  perfil?: string;
  plano?: string;
  fisioterapeuta?: string;
}

export interface VideoRecordDTO {
  id: number;
  name: string;
  duration: number;
  timestamp: string;
  filePath: string;
  size: number;
  storedLocally?: boolean;
  downloadFolder?: string;
}

export interface ExerciseDTO {
  description: string;
  videoPath: string;
}

export interface PlanDTO {
  id?: number;
  user: UserDTO;
  createdBy?: string;
  description: string;
  creationDate: string;
  validityDate: string;
  enabled: boolean;
  exercises?: ExerciseDTO[];
}

export interface Sessao {
  id: number;
  nomeUtente: string;
  titulo: string;
  dataInicio: Date;
  duracao: number;
  local: string;
}

export interface FiltroSessao {
  nomeUtente: string;
  titulo: string;
  dataInicio: Date | null;
  duracao: number | null;
  local: string;
}

 

export interface AttachmentDTO {
  id: number;
  messageId: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: Date;
}

 
export interface PlanFilterDTO {
  userName?: string;
  creationDateStart?: string;
  creationDateEnd?: string;
  validityDateStart?: string;
  validityDateEnd?: string;
}