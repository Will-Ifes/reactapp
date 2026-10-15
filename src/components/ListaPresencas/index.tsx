import { useMemo, useState } from 'react'
import { useAgora } from '../../hooks/useAgora'
import type { Presenca } from '../../types'
import { normalizar } from '../../utils/formatar'
import { ItemPresenca } from '../ItemPresenca'
import './styles.css'

type Ordem = 'chegada' | 'nome'

interface ListaPresencasProps {
  presencas: Presenca[]
  recente: string | null
  onRemover: (presenca: Presenca) => void
}

export function ListaPresencas({ presencas, recente, onRemover }: ListaPresencasProps) {
  const [filtro, setFiltro] = useState('')
  const [ordem, setOrdem] = useState<Ordem>('chegada')
  const agora = useAgora()

  // Número de chegada fixo, mesmo quando a lista é filtrada ou ordenada por nome
  const posicao = useMemo(() => new Map(presencas.map((p, i) => [p.id, i + 1])), [presencas])

  const visiveis = useMemo(() => {
    const termo = normalizar(filtro)
    const lista = termo ? presencas.filter((p) => normalizar(p.nome).includes(termo)) : [...presencas]
    if (ordem === 'nome') lista.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
    return lista
  }, [presencas, filtro, ordem])

  return (
    <section className="lista" aria-labelledby="lista-titulo">
      <div className="lista__topo">
        <h2 id="lista-titulo">Chegadas</h2>
        <div className="lista__controles">
          <label className="sr-only" htmlFor="filtro">
            Buscar na lista
          </label>
          <input
            id="filtro"
            type="search"
            placeholder="Buscar nome"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            disabled={presencas.length === 0}
          />
          <div className="lista__ordem" role="group" aria-label="Ordenar por">
            {(['chegada', 'nome'] as const).map((opcao) => (
              <button
                key={opcao}
                type="button"
                aria-pressed={ordem === opcao}
                onClick={() => setOrdem(opcao)}
                disabled={presencas.length === 0}
              >
                {opcao === 'chegada' ? 'Chegada' : 'A–Z'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {presencas.length === 0 ? (
        <div className="lista__vazia">
          <span className="lista__vazia-selo" aria-hidden="true" />
          <p>
            <strong>Ninguém chegou ainda.</strong>
          </p>
          <p>Digite um nome e pressione Enter. O horário é registrado na hora.</p>
        </div>
      ) : visiveis.length === 0 ? (
        <p className="lista__sem-resultado">Nenhum nome com “{filtro}”.</p>
      ) : (
        <ul className="lista__itens">
          {visiveis.map((p) => (
            <ItemPresenca
              key={p.id}
              presenca={p}
              ordem={posicao.get(p.id) ?? 0}
              agora={agora}
              destaque={p.id === recente}
              onRemover={() => onRemover(p)}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
