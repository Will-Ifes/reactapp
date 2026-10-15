import type { Presenca } from '../../types'
import { formatarHora, tempoRelativo } from '../../utils/formatar'
import { Avatar } from '../Avatar'
import './styles.css'

interface ItemPresencaProps {
  presenca: Presenca
  ordem: number
  agora: number
  destaque: boolean
  onRemover: () => void
}

export function ItemPresenca({ presenca, ordem, agora, destaque, onRemover }: ItemPresencaProps) {
  return (
    <li className="item" data-destaque={destaque || undefined}>
      <span className="item__ordem" aria-hidden="true">
        {String(ordem).padStart(2, '0')}
      </span>
      <Avatar nome={presenca.nome} />
      <span className="item__nome">{presenca.nome}</span>
      <span className="item__hora">
        <time dateTime={presenca.chegada}>{formatarHora(presenca.chegada)}</time>
        <small>{tempoRelativo(presenca.chegada, agora)}</small>
      </span>
      <button type="button" className="btn btn--ghost btn--icon btn--danger" onClick={onRemover} aria-label={`Remover ${presenca.nome}`}>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </li>
  )
}
