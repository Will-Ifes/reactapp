import type { Presenca } from '../types'

export const formatarHora = (iso: string) =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

export const formatarHoraCompleta = (iso: string) =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

export const formatarData = (data: Date) =>
  data.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

/** "agora", "há 3 min", "há 2 h" */
export function tempoRelativo(iso: string, agora: number): string {
  const minutos = Math.floor((agora - new Date(iso).getTime()) / 60_000)
  if (minutos < 1) return 'agora'
  if (minutos < 60) return `há ${minutos} min`
  return `há ${Math.floor(minutos / 60)} h`
}

export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/)
  const primeira = partes[0]?.[0] ?? ''
  const ultima = partes.length > 1 ? (partes.at(-1)?.[0] ?? '') : ''
  return (primeira + ultima).toUpperCase()
}

/** Ângulo estável por nome, para a diagonal do avatar variar entre pessoas */
export function anguloDoNome(nome: string): number {
  let hash = 0
  for (const letra of nome) hash = (hash * 31 + letra.charCodeAt(0)) | 0
  return 100 + (Math.abs(hash) % 140)
}

export const normalizar = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

export function paraTexto(presencas: Presenca[], turma: string): string {
  const linhas = presencas.map((p) => `${formatarHora(p.chegada)}  ${p.nome}`)
  return [`${turma} · ${presencas.length} presentes`, ...linhas].join('\n')
}

/** CSV com ponto e vírgula, que o Excel em português abre sem configurar nada */
export function paraCsv(presencas: Presenca[]): string {
  const escapar = (valor: string) => `"${valor.replace(/"/g, '""')}"`
  const linhas = presencas.map((p) =>
    [escapar(p.nome), new Date(p.chegada).toLocaleDateString('pt-BR'), formatarHoraCompleta(p.chegada)].join(';'),
  )
  return ['Nome;Data;Chegada', ...linhas].join('\r\n')
}
