export interface Presenca {
  id: string
  nome: string
  /** Horário de chegada em ISO 8601, formatado só na hora de exibir */
  chegada: string
}

export interface UsuarioGithub {
  nome: string
  avatar: string
  perfil: string
}
