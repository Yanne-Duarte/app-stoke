# FisioStoke Frontend

Este é o frontend da aplicação FisioStoke, desenvolvido em Angular 17.

## Requisitos

- Node.js 18.x ou superior
- npm 9.x ou superior

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm start
```

A aplicação estará disponível em `http://localhost:4200`.

## Build

Para criar uma build de produção:

```bash
npm run build
```

Os arquivos compilados estarão disponíveis em `dist/fisio-stoke-frontend`.

## Testes

Para executar os testes:

```bash
npm test
```

## Estrutura do Projeto

```
src/
├── app/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/         # Páginas da aplicação
│   ├── services/      # Serviços
│   ├── models/        # Interfaces e tipos
│   └── app.component.ts
├── assets/           # Recursos estáticos
└── environments/     # Configurações de ambiente
```

## Tecnologias Utilizadas

- Angular 17
- TypeScript
- SCSS
- Font Awesome
- RxJS

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
