import type { CSSProperties } from 'react'
import { anguloDoNome, iniciais } from '../../utils/formatar'
import './styles.css'

/** Iniciais sobre a divisão diagonal de duas cores, assinatura visual do Will Labs. */
export function Avatar({ nome }: { nome: string }) {
  const estilo = { '--angulo': `${anguloDoNome(nome)}deg` } as CSSProperties
  return (
    <span className="avatar" style={estilo} aria-hidden="true">
      {iniciais(nome)}
    </span>
  )
}
