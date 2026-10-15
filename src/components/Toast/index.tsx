import { useEffect } from 'react'
import './styles.css'

export interface ToastDados {
  id: number
  mensagem: string
  acao?: { rotulo: string; executar: () => void }
}

interface ToastProps {
  toast: ToastDados | null
  onFechar: () => void
  duracaoMs?: number
}

/** Aviso curto (até 300 px) que some sozinho; a ação de desfazer fica acessível pelo teclado. */
export function Toast({ toast, onFechar, duracaoMs = 6000 }: ToastProps) {
  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(onFechar, duracaoMs)
    return () => window.clearTimeout(id)
  }, [toast, onFechar, duracaoMs])

  return (
    <div className="toast-regiao" role="status" aria-live="polite">
      {toast && (
        <div className="toast" key={toast.id}>
          <span>{toast.mensagem}</span>
          {toast.acao && (
            <button
              type="button"
              className="toast__acao"
              onClick={() => {
                toast.acao?.executar()
                onFechar()
              }}
            >
              {toast.acao.rotulo}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
