import { describe, expect, it } from 'vitest'
import { anguloDoNome, iniciais, normalizar, paraCsv, tempoRelativo } from './formatar'

describe('formatar', () => {
  it('gera iniciais do primeiro e do último nome', () => {
    expect(iniciais('Ana Maria Souza')).toBe('AS')
    expect(iniciais('bruno')).toBe('B')
  })

  it('descreve o tempo desde a chegada', () => {
    const chegada = '2026-10-15T10:00:00.000Z'
    const base = new Date(chegada).getTime()
    expect(tempoRelativo(chegada, base + 20_000)).toBe('agora')
    expect(tempoRelativo(chegada, base + 5 * 60_000)).toBe('há 5 min')
    expect(tempoRelativo(chegada, base + 125 * 60_000)).toBe('há 2 h')
  })

  it('normaliza acento, caixa e espaços', () => {
    expect(normalizar('  Ângela ')).toBe('angela')
  })

  it('mantém o mesmo ângulo para o mesmo nome', () => {
    expect(anguloDoNome('Ana')).toBe(anguloDoNome('Ana'))
  })

  it('escapa aspas e separa por ponto e vírgula no CSV', () => {
    const csv = paraCsv([{ id: '1', nome: 'Ana "Nina" Souza', chegada: '2026-10-15T10:00:00.000Z' }])
    const [cabecalho, linha] = csv.split('\r\n')
    expect(cabecalho).toBe('Nome;Data;Chegada')
    expect(linha?.startsWith('"Ana ""Nina"" Souza";')).toBe(true)
  })
})
