import { useGithubUser } from '../../hooks/useGithubUser'
import type { Tema } from '../../hooks/useTema'
import './styles.css'

interface CabecalhoProps {
  tema: Tema
  onAlternarTema: () => void
}

export function Cabecalho({ tema, onAlternarTema }: CabecalhoProps) {
  const github = useGithubUser('Will-Ifes')
  const escuro = tema === 'forest'

  return (
    <header className="cabecalho">
      <div className="cabecalho__marca">
        <span className="cabecalho__selo" aria-hidden="true" />
        <p className="eyebrow">Lab 01 / Chamada</p>
      </div>

      <div className="cabecalho__acoes">
        <button
          type="button"
          className="btn btn--outline btn--tema"
          onClick={onAlternarTema}
          aria-pressed={escuro}
          aria-label="Tema escuro"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {escuro ? (
              <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
            ) : (
              <>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </>
            )}
          </svg>
          <span className="cabecalho__tema-texto" aria-hidden="true">{escuro ? 'Floresta' : 'Papel'}</span>
        </button>

        <div className="cabecalho__perfil" aria-busy={github.status === 'carregando'}>
          {github.status === 'ok' && (
            <a href={github.usuario.perfil} target="_blank" rel="noopener noreferrer" className="cabecalho__link">
              <img src={github.usuario.avatar} alt="" width={32} height={32} />
              <span>{github.usuario.nome}</span>
            </a>
          )}
          {github.status === 'carregando' && <span className="cabecalho__esqueleto" aria-label="Carregando perfil" />}
          {github.status === 'erro' && <span className="cabecalho__erro">Perfil indisponível</span>}
        </div>
      </div>
    </header>
  )
}
