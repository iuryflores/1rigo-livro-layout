# Gerador de PDF de Livro de Protocolos

Este é um projeto Node.js que gera PDFs baseados no layout antigo do livro de protocolos do sistema para cartórios Asgard. A aplicação permite a geração de relatórios em PDF, listando todas as anotações do livro de protocolo de um determinado dia, incluindo cabeçalho, tabelas de anotações e um resumo no final.

## Dependências

- `cors`
- `dotenv`
- `express`
- `morgan`
- `pdfmake`
- `nodemon` (dependência de desenvolvimento)

## Funcionalidades

- Rota GET para gerar o PDF do livro de protocolos
- Layout em A4 landscape
- Cabeçalho com a identificação do livro, nome do cartório e data
- Tabela com as colunas:
  - Protocolo
  - Apresentação
  - Anotações
  - Natureza
  - Apresentante
  - Ocorrência
- Lista de protocolos prenotados no dia
- Resumo das ocorrências:
  - Quantidade de protocolos cancelados, exigência, prenotado, registrado, reingressado e o total de todas as ocorrências
- Assinatura do oficial no termo de encerramento

## Instalação

1. Clone o repositório:

    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    ```

2. Navegue até o diretório do projeto:

    ```bash
    cd seu-repositorio
    ```

3. Instale as dependências:

    ```bash
    npm install
    ```

## Configuração

1. Crie um arquivo `.env` na raiz do projeto e configure as variáveis de ambiente necessárias. Um exemplo de arquivo `.env` pode ser encontrado abaixo:

    ```env
    PORT=3000
    ```

## Uso

Para iniciar a aplicação em modo de desenvolvimento, execute:

```bash
npm run dev
