import { useEffect, useState } from 'react'
import type { Presenca } from '../types'
import { normalizar } from '../utils/formatar'

const CHAVE = 'lista-de-presenca'

interface Salvo {
  turma: string
  presencas: Presenca[]
}

const VAZIO: Salvo = { turma: 'Turma sem nome', presencas: [] }

function lerSalvo(): Salvo {
  try {
    const bruto = localStorage.getItem(CHAVE)
    if (!bruto) return VAZIO
    const dados: unknown = JSON.parse(bruto)
    // Formato antigo da v1 guardava só o array de presenças
    if (Array.isArray(dados)) return { ...VAZIO, presencas: dados as Presenca[] }
    const salvo = dados as Partial<Salvo>
    return {
      turma: typeof salvo.turma === 'string' && salvo.turma ? salvo.turma : VAZIO.turma,
      presencas: Array.isArray(salvo.presencas) ? salvo.presencas : [],
    }
  } catch {
    return VAZIO
  }
}

export type ResultadoAdicionar =
  | { ok: true; presenca: Presenca }
  | { ok: false; existente: Presenca }

/** Lista de presença e nome da turma, salvos no navegador. */
export function usePresencas() {
  const [estado, setEstado] = useState<Salvo>(lerSalvo)

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(estado))
    } catch {
      // Navegação privada ou cota cheia: a lista continua funcionando em memória
    }
  }, [estado])

  function adicionar(nome: string): ResultadoAdicionar {
    const existente = estado.presencas.find((p) => normalizar(p.nome) === normalizar(nome))
    if (existente) return { ok: false, existente }

    const presenca: Presenca = { id: crypto.randomUUID(), nome, chegada: new Date().toISOString() }
    setEstado((atual) => ({ ...atual, presencas: [...atual.presencas, presenca] }))
    return { ok: true, presenca }
  }

  function remover(id: string) {
    setEstado((atual) => ({ ...atual, presencas: atual.presencas.filter((p) => p.id !== id) }))
  }

  /** Devolve uma presença removida à posição original de chegada */
  function restaurar(presenca: Presenca) {
    setEstado((atual) => ({
      ...atual,
      presencas: [...atual.presencas, presenca].sort((a, b) => a.chegada.localeCompare(b.chegada)),
    }))
  }

  function limpar() {
    setEstado((atual) => ({ ...atual, presencas: [] }))
  }

  function renomearTurma(turma: string) {
    setEstado((atual) => ({ ...atual, turma: turma.trim() || VAZIO.turma }))
  }

  return { ...estado, adicionar, remover, restaurar, limpar, renomearTurma }
}
