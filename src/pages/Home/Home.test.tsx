import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Home } from '.'

const perfil = {
  name: 'Will Oliveira',
  login: 'Will-Ifes',
  avatar_url: 'https://example.com/avatar.png',
  html_url: 'https://github.com/Will-Ifes',
}

function mockGithub(resposta: Partial<Response>) {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, status: 200, json: async () => perfil, ...resposta } as Response)
}

const campoNome = () => screen.getByLabelText('Nome do aluno')
const itens = () => within(screen.getByRole('list')).getAllByRole('listitem')

async function registrar(user: ReturnType<typeof userEvent.setup>, ...nomes: string[]) {
  for (const nome of nomes) await user.type(campoNome(), `${nome}{Enter}`)
}

describe('Lista de presença', () => {
  beforeEach(() => mockGithub({}))

  it('registra com Enter, normaliza espaços, limpa o campo e atualiza o painel', async () => {
    const user = userEvent.setup()
    render(<Home />)

    await user.type(campoNome(), '  Ana   Souza  {Enter}')

    expect(within(screen.getByRole('list')).getByText('Ana Souza')).toBeInTheDocument()
    expect(campoNome()).toHaveValue('')
    expect(campoNome()).toHaveFocus()
    expect(screen.getByText('Presentes').nextElementSibling).toHaveTextContent('1')
    expect(screen.getByRole('status')).toHaveTextContent('Ana Souza registrado')
  })

  it('recusa nome vazio com erro ligado ao campo', async () => {
    const user = userEvent.setup()
    render(<Home />)

    await user.click(screen.getByRole('button', { name: 'Registrar' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Digite o nome do aluno')
    expect(campoNome()).toHaveAttribute('aria-invalid', 'true')
    expect(campoNome()).toHaveAccessibleDescription(/Digite o nome do aluno/)
  })

  it('recusa nome repetido, sem diferenciar acento nem maiúscula', async () => {
    const user = userEvent.setup()
    render(<Home />)

    await registrar(user, 'José Lima', 'jose lima')

    expect(itens()).toHaveLength(1)
    expect(screen.getByRole('alert')).toHaveTextContent(/José Lima já está na lista desde/)
  })

  it('mantém alunos registrados no mesmo segundo', async () => {
    const user = userEvent.setup()
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-10-15T10:00:00'))
    render(<Home />)

    await registrar(user, 'Ana', 'Bruno')

    expect(itens()).toHaveLength(2)
    vi.useRealTimers()
  })

  it('remove e desfaz a remoção na posição original', async () => {
    const user = userEvent.setup()
    render(<Home />)
    await registrar(user, 'Ana', 'Bruno', 'Carla')

    await user.click(screen.getByRole('button', { name: 'Remover Bruno' }))
    expect(itens()).toHaveLength(2)

    await user.click(screen.getByRole('button', { name: 'Desfazer' }))
    expect(itens().map((li) => li.textContent)).toEqual([
      expect.stringContaining('Ana'),
      expect.stringContaining('Bruno'),
      expect.stringContaining('Carla'),
    ])
  })

  it('busca sem acento e ordena por nome', async () => {
    const user = userEvent.setup()
    render(<Home />)
    await registrar(user, 'Carla', 'Ângela', 'Bruno')

    await user.type(screen.getByLabelText('Buscar na lista'), 'angela')
    expect(itens()).toHaveLength(1)
    expect(itens()[0]).toHaveTextContent('Ângela')

    await user.clear(screen.getByLabelText('Buscar na lista'))
    await user.click(screen.getByRole('button', { name: 'A–Z' }))
    expect(itens().map((li) => li.querySelector('.item__nome')?.textContent)).toEqual(['Ângela', 'Bruno', 'Carla'])
  })

  it('guarda turma e presenças no navegador', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<Home />)

    await registrar(user, 'Ana')
    const turma = screen.getByLabelText('Nome da turma')
    await user.clear(turma)
    await user.type(turma, '3º ano B{Enter}')
    unmount()

    render(<Home />)
    expect(screen.getByLabelText('Nome da turma')).toHaveValue('3º ano B')
    expect(within(screen.getByRole('list')).getByText('Ana')).toBeInTheDocument()
  })

  it('alterna o tema e lembra a escolha', async () => {
    const user = userEvent.setup()
    render(<Home />)

    const botao = screen.getByRole('button', { name: 'Tema escuro' })
    await user.click(botao)

    expect(botao).toHaveAttribute('aria-pressed', 'true')
    expect(document.documentElement.dataset.tema).toBe('forest')
    expect(localStorage.getItem('lista-de-presenca:tema')).toBe('forest')
  })

  it('encerra a chamada só depois de confirmar', async () => {
    const user = userEvent.setup()
    render(<Home />)
    await registrar(user, 'Ana', 'Bruno')

    vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true)
    await user.click(screen.getByRole('button', { name: 'Encerrar chamada' }))
    expect(itens()).toHaveLength(2)

    await user.click(screen.getByRole('button', { name: 'Encerrar chamada' }))
    expect(screen.getByText('Ninguém chegou ainda.')).toBeInTheDocument()
  })

  it('mostra o perfil do GitHub e não quebra quando a API falha', async () => {
    const { unmount } = render(<Home />)
    expect(await screen.findByRole('link', { name: /Will Oliveira/ })).toHaveAttribute('href', perfil.html_url)
    unmount()

    vi.spyOn(console, 'warn').mockImplementation(() => {})
    mockGithub({ ok: false, status: 403 })
    render(<Home />)
    await waitFor(() => expect(screen.getByText('Perfil indisponível')).toBeInTheDocument())
  })
})
