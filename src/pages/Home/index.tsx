import { useCallback, useEffect, useRef, useState } from 'react'
import { Cabecalho } from '../../components/Cabecalho'
import { Formulario } from '../../components/Formulario'
import { ListaPresencas } from '../../components/ListaPresencas'
import { PainelTurma } from '../../components/PainelTurma'
import { Toast, type ToastDados } from '../../components/Toast'
import { usePresencas } from '../../hooks/usePresencas'
import { useTema } from '../../hooks/useTema'
import type { Presenca } from '../../types'
import { formatarHora, paraCsv, paraTexto } from '../../utils/formatar'
import './styles.css'

export function Home() {
  const { turma, presencas, adicionar, remover, restaurar, limpar, renomearTurma } = usePresencas()
  const { tema, alternar } = useTema()
  const [toast, setToast] = useState<ToastDados | null>(null)
  const [recente, setRecente] = useState<string | null>(null)
  const campo = useRef<HTMLInputElement>(null)

  const avisar = useCallback((mensagem: string, acao?: ToastDados['acao']) => {
    setToast({ id: Date.now(), mensagem, acao })
  }, [])
  const fecharToast = useCallback(() => setToast(null), [])

  // "/" leva ao campo de nome de qualquer lugar da página, menos de dentro de outro campo
  useEffect(() => {
    function atalho(evento: KeyboardEvent) {
      const alvo = evento.target as HTMLElement
      if (evento.key === '/' && !['INPUT', 'TEXTAREA'].includes(alvo.tagName)) {
        evento.preventDefault()
        campo.current?.focus()
      }
    }
    document.addEventListener('keydown', atalho)
    return () => document.removeEventListener('keydown', atalho)
  }, [])

  // A faixa de destaque do recém-chegado some depois de alguns segundos
  useEffect(() => {
    if (!recente) return
    const id = window.setTimeout(() => setRecente(null), 4000)
    return () => window.clearTimeout(id)
  }, [recente])

  function handleAdicionar(nome: string): string | null {
    const resultado = adicionar(nome)
    if (!resultado.ok) {
      return `${resultado.existente.nome} já está na lista desde ${formatarHora(resultado.existente.chegada)}.`
    }
    setRecente(resultado.presenca.id)
    avisar(`${nome} registrado às ${formatarHora(resultado.presenca.chegada)}.`)
    return null
  }

  function handleRemover(presenca: Presenca) {
    remover(presenca.id)
    avisar(`${presenca.nome} saiu da lista.`, { rotulo: 'Desfazer', executar: () => restaurar(presenca) })
    campo.current?.focus()
  }

  async function handleCopiar() {
    try {
      await navigator.clipboard.writeText(paraTexto(presencas, turma))
      avisar('Lista copiada. Cole no chat ou no e-mail.')
    } catch {
      avisar('Não foi possível copiar. Use “Baixar CSV”.')
    }
  }

  function handleBaixar() {
    const arquivo = new Blob(['﻿' + paraCsv(presencas)], { type: 'text/csv;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(arquivo)
    link.download = `presenca-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
    avisar('CSV baixado.')
  }

  function handleLimpar() {
    if (!window.confirm(`Encerrar a chamada e apagar os ${presencas.length} registros?`)) return
    const copia = [...presencas]
    limpar()
    avisar('Chamada encerrada.', { rotulo: 'Desfazer', executar: () => copia.forEach(restaurar) })
    campo.current?.focus()
  }

  return (
    <div className="pagina">
      <Cabecalho tema={tema} onAlternarTema={alternar} />

      <main className="pagina__conteudo">
        <div className="pagina__principal">
          <div className="pagina__titulo">
            <p className="eyebrow">Registro de chegada</p>
            <h1>Lista de presença</h1>
          </div>
          <Formulario ref={campo} onAdicionar={handleAdicionar} />
          <ListaPresencas presencas={presencas} recente={recente} onRemover={handleRemover} />
        </div>

        <PainelTurma
          key={turma}
          turma={turma}
          presencas={presencas}
          onRenomear={renomearTurma}
          onCopiar={handleCopiar}
          onBaixar={handleBaixar}
          onLimpar={handleLimpar}
        />
      </main>

      <footer className="pagina__rodape">
        <p className="eyebrow">React 19 · TypeScript · dados salvos só neste navegador</p>
      </footer>

      <Toast toast={toast} onFechar={fecharToast} />
    </div>
  )
}
