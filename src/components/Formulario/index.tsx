import { useState, type FormEvent, type Ref } from 'react'
import './styles.css'

const LIMITE_NOME = 60

interface FormularioProps {
  /** Retorna a mensagem de erro, ou null se o nome entrou na lista */
  onAdicionar: (nome: string) => string | null
  ref?: Ref<HTMLInputElement>
}

export function Formulario({ onAdicionar, ref }: FormularioProps) {
  const [nome, setNome] = useState('')
  const [erro, setErro] = useState('')

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const limpo = nome.trim().replace(/\s+/g, ' ')
    const mensagem = limpo ? onAdicionar(limpo) : 'Digite o nome do aluno antes de registrar.'

    if (mensagem) {
      setErro(mensagem)
      return
    }
    setNome('')
    setErro('')
  }

  return (
    <form className="formulario" onSubmit={handleSubmit} noValidate>
      <label htmlFor="nome" className="formulario__rotulo">
        Nome do aluno
      </label>
      <div className="formulario__linha">
        <input
          ref={ref}
          id="nome"
          type="text"
          value={nome}
          maxLength={LIMITE_NOME}
          autoComplete="off"
          enterKeyHint="done"
          placeholder="Ex.: Ana Souza"
          aria-invalid={Boolean(erro)}
          aria-describedby={erro ? 'nome-erro' : 'nome-ajuda'}
          onChange={(e) => {
            setNome(e.target.value)
            if (erro) setErro('')
          }}
        />
        <button type="submit" className="btn btn--primary">
          Registrar
        </button>
      </div>
      {erro ? (
        <p id="nome-erro" className="formulario__erro" role="alert">
          {erro}
        </p>
      ) : (
        <p id="nome-ajuda" className="formulario__ajuda">
          Enter registra o horário de chegada. <kbd>/</kbd> volta para este campo.
        </p>
      )}
    </form>
  )
}
