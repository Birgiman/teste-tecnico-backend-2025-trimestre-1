# ⚙️ Setup do Projeto

Este documento descreve como clonar, configurar e executar a aplicação localmente usando Docker.

## 🔗 Navegação Rápida

* [Voltar para o README.md](./README.md)

## 📦 Requisitos

Certifique-se de ter as seguintes ferramentas instaladas em seu ambiente de desenvolvimento:

* [**Git**](https://git-scm.com/)

* [**Docker**](https://www.docker.com/)

* [**Docker Compose**](https://docs.docker.com/compose/)

## 🚀 Como Rodar o Projeto Localmente

Siga os passos abaixo para iniciar a aplicação em seu ambiente local:

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/Birgiman/teste-tecnico-backend-2025-trimestre-1.git
    cd teste-tecnico-backend-2025-trimestre-1
    ```

2.  **Inicie os serviços com Docker Compose:**

    ```bash
    docker-compose up --build
    ```

    *Observação: Este comando irá construir as imagens Docker necessárias (se ainda não existirem ou se houverem mudanças no Dockerfile) e iniciar os contêineres para a aplicação e o serviço de cache (Redis).*

### Acesso à Aplicação

A aplicação estará disponível em: <http://localhost:3000>

### Estrutura de Diretórios e Armazenamento

Ao iniciar o projeto, uma pasta chamada `/videos` será criada automaticamente na raiz do container da aplicação para armazenar os vídeos enviados. Os dados persistirão entre as reinicializações do contêiner.

## 📤 Upload de Vídeos

**Rota:** `POST /upload/video`

Este endpoint permite o envio de um único arquivo de vídeo via `multipart/form-data`.

* **Limite de Tamanho:** 10 MB (megabytes).

* **Nome do Campo do Arquivo:** O campo do arquivo no formulário deve ser chamado `file`.

* **Tipos de Vídeo Permitidos:** Definidos no `enum SupportedVideoExtensions` (verifique o código-fonte da aplicação para detalhes).

**Exemplo de Requisição (Insomnia/Postman):**

```http
POST http://localhost:3000/upload/video
Content-Type: multipart/form-data

Body:
  file: [selecione o vídeo .mp4, .webm, .mov etc.]
```

  Respostas Esperadas:

* ✅ Vídeo válido e upload bem-sucedido → HTTP 204 No Content
* ❌ Tipo de arquivo inválido → HTTP 400 Bad Request
* ❌ Tamanho do arquivo acima de 10MB → HTTP 400 Bad Request, dependendo da configuração exata do middleware de erro

## 🎥 Streaming de Vídeos

**Rota:** `GET /static/video/:filename`

Este endpoint retorna o conteúdo de um vídeo existente, com suporte ao cabeçalho `Range` para streaming parcial.

### Exemplos de Requisição:

1.  **Requisição Completa (sem `Range`):**

    ```http
    GET http://localhost:3000/static/video/nome-do-video.mp4
    ```

2.  **Requisição com Cabeçalho `Range` (ex: primeiros 1024 bytes):**

    ```http
    GET http://localhost:3000/static/video/nome-do-video.mp4
    Headers:
        Range: bytes=0-1023
    ```

### Respostas Esperadas:

* ✅ Vídeo encontrado (requisição completa) → `HTTP 200 OK`
* ✅ Vídeo encontrado (requisição com `Range`) → `HTTP 206 Partial Content`
* ❌ Vídeo não encontrado → `HTTP 404 Not Found`
