# Lista de presença · React

Registro de nomes e horários com perfil consultado na API do GitHub.

## Contexto e objetivo

Estudo de React 18, Vite, props, estado e efeitos.

## Funcionalidades presentes

- Inclusão de nomes com horário de registro.
- Cartões renderizados a partir do estado.
- Consulta de nome e avatar do GitHub.

## Por dentro do código

| Código | O que observar |
| --- | --- |
| [`src/pages/Home/index.jsx`](src/pages/Home/index.jsx) | Estado e carregamento de perfil. |
| [`src/components/Card/index.jsx`](src/components/Card/index.jsx) | Apresentação dos registros. |

## Executar localmente

Requer Node.js e npm compatíveis com as dependências versionadas.

```bash
git clone https://github.com/Will-Ifes/reactapp.git
cd reactapp
npm install
npm run dev
```

Abra o endereço informado pelo servidor no terminal.



## Comandos disponíveis

| Comando | Script versionado |
| --- | --- |
| `npm run dev` | `vite` |
| `npm run build` | `vite build` |
| `npm run preview` | `vite preview` |

Os comandos refletem o `package.json`. A existência de um script não comprova execução bem-sucedida no ambiente atual.

## Escopo e evolução

Os registros ficam em memória. Validação de nomes, identificadores estáveis, persistência e tratamento de erro são evoluções possíveis.

---

Mantido por **Will Oliveira** · [Perfil](https://github.com/Will-Ifes) · [LinkedIn](https://www.linkedin.com/in/wildemberg-de-jesus-oliveira/)
