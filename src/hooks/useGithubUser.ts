import { useEffect, useState } from 'react'
import type { UsuarioGithub } from '../types'

type Estado =
  | { status: 'carregando' }
  | { status: 'ok'; usuario: UsuarioGithub }
  | { status: 'erro' }

/** Busca nome e foto de um usuário do GitHub; nunca deixa o cabeçalho vazio. */
export function useGithubUser(login: string): Estado {
  const [estado, setEstado] = useState<Estado>({ status: 'carregando' })

  useEffect(() => {
    const controle = new AbortController()

    async function buscar() {
      try {
        const resposta = await fetch(`https://api.github.com/users/${encodeURIComponent(login)}`, {
          signal: controle.signal,
        })
        if (!resposta.ok) throw new Error(`GitHub respondeu ${resposta.status}`)
        const dados = (await resposta.json()) as { name: string | null; login: string; avatar_url: string; html_url: string }
        setEstado({
          status: 'ok',
          usuario: { nome: dados.name ?? dados.login, avatar: dados.avatar_url, perfil: dados.html_url },
        })
      } catch (erro) {
        if (controle.signal.aborted) return
        console.warn('Não foi possível carregar o perfil do GitHub:', erro)
        setEstado({ status: 'erro' })
      }
    }

    buscar()
    return () => controle.abort()
  }, [login])

  return estado
}
