import { useState } from 'react'
import type { Presenca } from '../../types'
import { formatarData, formatarHora } from '../../utils/formatar'
import './styles.css'

interface PainelTurmaProps {
  turma: string
  presencas: Presenca[]
  onRenomear: (turma: string) => void
  onCopiar: () => void
  onBaixar: () => void
  onLimpar: () => void
}

export function PainelTurma({ turma, presencas, onRenomear, onCopiar, onBaixar, onLimpar }: PainelTurmaProps) {
  const [rascunho, setRascunho] = useState(turma)
  const primeira = presencas[0]
  const ultima = presencas.at(-1)
  const vazia = presencas.length === 0

  return (
    <aside className="painel" aria-label="Resumo da turma">
      <p className="eyebrow">{formatarData(new Date())}</p>

      <div className="painel__turma">
        <label htmlFor="turma" className="sr-only">
          Nome da turma
        </label>
        <input
          id="turma"
          className="painel__turma-campo"
          value={rascunho}
          maxLength={40}
          onChange={(e) => setRascunho(e.target.value)}
          onBlur={() => onRenomear(rascunho)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur()
          }}
        />
        <span className="painel__dica">Clique no nome para renomear</span>
      </div>

      <dl className="painel__numeros">
        <div className="painel__numero painel__numero--grande">
          <dt>Presentes</dt>
          <dd>{presencas.length}</dd>
        </div>
        <div className="painel__numero">
          <dt>Primeira chegada</dt>
          <dd>{primeira ? formatarHora(primeira.chegada) : '--:--'}</dd>
        </div>
        <div className="painel__numero">
          <dt>Última chegada</dt>
          <dd>{ultima ? formatarHora(ultima.chegada) : '--:--'}</dd>
        </div>
      </dl>

      <div className="painel__acoes">
        <button type="button" className="btn btn--outline" onClick={onCopiar} disabled={vazia}>
          Copiar lista
        </button>
        <button type="button" className="btn btn--outline" onClick={onBaixar} disabled={vazia}>
          Baixar CSV
        </button>
        <button type="button" className="btn btn--ghost btn--danger" onClick={onLimpar} disabled={vazia}>
          Encerrar chamada
        </button>
      </div>
    </aside>
  )
}
